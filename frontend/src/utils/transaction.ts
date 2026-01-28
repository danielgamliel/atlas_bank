import type { TxItem, TxStatus } from "../types/transactions";

export type TxServer = {
  _id: string;
  userId: string;
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

export function normalizeStatus(status: any): TxStatus {
  const s = String(status || "completed").toLowerCase();
  if (s === "completed" || s === "pending" || s === "failed") return s;
  return "failed";
}

export function formatAmount(amount: number | string, direction: "in" | "out"): string {
  const n = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(n)) return direction === "in" ? "+$0.00" : "-$0.00";

  const abs = Math.abs(n).toFixed(2);
  return direction === "in" ? `+$${abs}` : `-$${abs}`;
}

export function formatDateTimeText(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;

  const date = d.toISOString().slice(0, 10);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${date} at ${time}`;
}

export function mapServerTxToItem(tx: TxServer): TxItem {
  const direction: "in" | "out" = tx.direction || tx.type || "out";

  const counterparty = tx.counterpartyEmail || tx.recipientEmail || "—";
  const subtitleText = direction === "in" ? `From: ${counterparty}` : `To: ${counterparty}`;

  const title =
    tx.title ||
    tx.description ||
    (direction === "in" ? "Incoming transfer" : "Outgoing transfer");

  const iso = tx.timestamp || tx.createdAt;

  return {
    id: tx._id,
    title,
    subtitleText,
    date: formatDateTimeText(iso),
    amountText: formatAmount(tx.amount ?? 0, direction),
    direction,
    status: normalizeStatus(tx.status),
  };
}
