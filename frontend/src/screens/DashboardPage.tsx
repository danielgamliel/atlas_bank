import * as React from "react";
import { Box, Typography, Stack } from "@mui/material";

import AppLayout from "../components/AppLayout";
import BalanceCard from "../components/BalanceCard";
import RecentTransactions from "../components/RecentTransactions";
import { useDashboardData } from "../hooks/useDashboardData";

export default function DashboardPage(): React.JSX.Element {
  const { loading, errorText, userName, balanceText, transactions } = useDashboardData();

  if (loading) {
    return (
      <Box sx={{minHeight: "100vh",bgcolor: "#fbf9ff",display: "flex",alignItems: "center",justifyContent: "center",}}>
        <Typography sx={{ color: "text.secondary", fontWeight: 800 }}>
          Loading dashboard...
        </Typography>
      </Box>
    );
  }

  return (
    <AppLayout>
      <Stack spacing={1} sx={{ mb: 2 }}>
        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1 }}>
          Dashboard
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          {userName} Here&apos;s your account overview.
        </Typography>

        {errorText ? (
          <Typography sx={{ color: "error.main", fontWeight: 800 }}>
            {errorText}
          </Typography>
        ) : null}
      </Stack>

      <BalanceCard balanceText={balanceText} />
      <RecentTransactions transactions={transactions} />
    </AppLayout>
  );
}
