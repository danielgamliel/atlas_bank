import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { Typography, Stack, Paper, Divider, List, Button, CircularProgress } from "@mui/material";

import AppLayout from "../components/AppLayout";
import TransactionRow from "../components/TransactionRow";
import type { TxItem } from "../types/transactions";
import { mapServerTxToItem, type TxServer } from "../utils/transaction";

type GetTransactionsResponse = {
  success: boolean;
  data?: {
    transactions: TxServer[];
    total: number;
    offset: number;
    limit: number;
  };
  error?: unknown;
};

export default function TransactionsPage(): React.JSX.Element {
  const apiBaseUrl = import.meta.env.VITE_API_BASE as string;

  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<TxItem[]>([]);

  const endpoint = useMemo(() => `${apiBaseUrl}/transactions?offset=0&limit=100`, [apiBaseUrl]);

  useEffect(() => {
    let cancelled = false;

    async function load(): Promise<void> {
      setLoading(true);
      setErrorText(null);

      try {
        const res = await fetch(endpoint, {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (!res.ok) throw new Error(`Failed to load transactions (${res.status})`);
        
        const json = (await res.json()) as GetTransactionsResponse;
        if (!json.success || !json.data) throw new Error("Server error");

        if (!cancelled) setTransactions(json.data.transactions.map(mapServerTxToItem));
        
      } catch (e: any) {
        if (!cancelled) {
          setErrorText(e.message ?? "Unknown error");
          setTransactions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {cancelled = true};
  }, [endpoint]);

  return (
    <AppLayout>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 900 }}>
          Transactions
        </Typography>
        <Typography sx={{ color: "text.secondary" }}>
          View all your transaction history
        </Typography>
      </Stack>

      <Paper sx={{ borderRadius: 6, border: "1px solid", borderColor: "divider", p: 2 }}>
        {loading ? (
          <Stack alignItems="center" sx={{ py: 8 }} spacing={2}>
            <CircularProgress />
            <Typography color="text.secondary">Loading transactions...</Typography>
          </Stack>
        ) : errorText ? (
          <Stack sx={{ py: 6 }} spacing={1}>
            <Typography fontWeight={900}>Couldn’t load transactions</Typography>
            <Typography color="text.secondary">{errorText}</Typography>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </Stack>
        ) : transactions.length === 0 ? (
          <Stack sx={{ py: 8 }} alignItems="center">
            <Typography fontWeight={900}>No transactions yet</Typography>
            <Typography color="text.secondary">
              Once you make a transfer, it will appear here.
            </Typography>
          </Stack>
        ) : (
          <List>
            {transactions.map((tx, idx) => (
              <React.Fragment key={tx.id}>
                <TransactionRow tx={tx} />
                {idx !== transactions.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </AppLayout>
  );
}
