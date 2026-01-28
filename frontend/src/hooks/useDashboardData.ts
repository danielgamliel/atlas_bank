import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export type TxStatus = "completed" | "pending" | "failed";

export type TxItem = {
  id: string;
  title: string;
  subtitleText: string;
  date: string;
  amountText: string;
  direction: "in" | "out";
  status: TxStatus;
};

type MeResponse =
  | { success: true; data: { id: string; email: string; firstName?: string | null; lastName?: string | null; balance: number } }
  | { success: false; error: string };

type TxServer = {
  _id: string;
  amount: number | string;
  direction?: "in" | "out";
  type?: "in" | "out";
  status?: string;
  timestamp?: string;
  createdAt?: string;
  description?: string;
  title?: string;
  counterpartyEmail?: string;
  recipientEmail?: string;
};

function normalizeStatus(status: any): TxStatus {
  const s = String(status || "completed").toLowerCase();
  if (s === "completed" || s === "pending" || s === "failed") return s;
  return "failed";
}

function formatAmount(amount: number | string, direction: "in" | "out"): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  const abs = Number.isFinite(n) ? Math.abs(n).toFixed(2) : "0.00";
  return direction === "in" ? `+$${abs}` : `-$${abs}`;
}

function formatDateOnly(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}

function mapServerTxToDashboard(tx: TxServer): TxItem {
  const direction: "in" | "out" = tx.direction || tx.type || "out";
  const counterparty = tx.counterpartyEmail || tx.recipientEmail || "—";

  return {
    id: tx._id,
    title: tx.title || tx.description || (direction === "in" ? "Incoming transfer" : "Outgoing transfer"),
    subtitleText: direction === "in" ? `From: ${counterparty}` : `To: ${counterparty}`,
    date: formatDateOnly(tx.timestamp || tx.createdAt),
    amountText: formatAmount(tx.amount ?? 0, direction),
    direction,
    status: normalizeStatus(tx.status),
  };
}

export function useDashboardData(): {
  loading: boolean;
  errorText: string;
  userName: string;
  balanceText: string;
  transactions: TxItem[];
} {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_BASE;

  const [loading, setLoading] = useState<boolean>(true);
  const [errorText, setErrorText] = useState<string>("");

  const [userName, setUserName] = useState<string>("Welcome back!");
  const [balanceText, setBalanceText] = useState<string>("$0.00");
  const [transactions, setTransactions] = useState<TxItem[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function load(): Promise<void> {
      setLoading(true);
      setErrorText("");

      try {
        const meRes = await fetch(`${API}/me`, { credentials: "include" });
        const meText = await meRes.text();
        const meData = (meText ? JSON.parse(meText) : null) as MeResponse | null;

        if (!meRes.ok || !meData || meData.success === false) {
          navigate("/", { replace: true });
          return;
        }

        const u = meData.data;
        const fullName = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();

        if (isMounted) {
          setUserName(fullName ? `Welcome back, ${fullName}!` : `Welcome back, ${u.email}!`);
          setBalanceText(new Intl.NumberFormat("he-IL", { style: "currency", currency: "USD" }).format(u.balance));
        }

        const txRes = await fetch("http://localhost:3000/api/v1/transactions?offset=0&limit=3", { credentials: "include" });
        const txText = await txRes.text();

        if (txRes.ok) {
          const txData = txText ? JSON.parse(txText) : null;
          const list = (txData?.data?.transactions || []) as TxServer[];
          if (isMounted) setTransactions(list.map(mapServerTxToDashboard));
        } else if (isMounted) {
          setTransactions([]);
        }
      } catch (err: any) {
        if (isMounted) setErrorText("Network error. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return { loading, errorText, userName, balanceText, transactions };
}
