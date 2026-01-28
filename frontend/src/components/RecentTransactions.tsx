import * as React from "react";
import { Paper, Stack, Typography, Box, Link, Divider, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { useNavigate } from "react-router-dom";
import StatusChip from "./StatusChip";
import type { TxItem } from "../types/transactions";

export default function RecentTransactions({ transactions }: { transactions: TxItem[] }): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{borderRadius: 6, border: "1px solid", borderColor: "divider", boxShadow: "0 10px 30px rgba(0,0,0,0.06)",p: { xs: 2.5, sm: 3 }}}
    >
      <Stack direction="row" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 900 }}>
          Recent Transactions
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Link
          component="button"
          type="button"
          onClick={() => navigate("/transactions")}
          underline="none"
          sx={{ color: "#6b4cb9", fontWeight: 800 }}
        >
          View All
        </Link>
      </Stack>

      <Divider />

      {transactions.length === 0 ? (
        <Stack sx={{ py: 4 }} spacing={1} alignItems="center">
          <Typography sx={{ fontWeight: 900 }}>No transactions yet</Typography>
          <Typography sx={{ color: "text.secondary" }}>Your recent transfers will appear here.</Typography>
        </Stack>
      ) : (
        <List sx={{ mt: 1 }}>
          {transactions.map((tx, idx) => {
            const isIn = tx.direction === "in";

            return (
              <React.Fragment key={tx.id}>
                <ListItem
                  sx={{ py: 2.2 }}
                  secondaryAction={
                    <Stack spacing={0.8} alignItems="flex-end">
                      <Typography sx={{ fontWeight: 900, color: isIn ? "#2e7d32" : "#d32f2f" }}>
                        {tx.amountText}
                      </Typography>
                      <StatusChip status={tx.status} />
                    </Stack>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: isIn ? "rgba(46,125,50,0.12)" : "rgba(211,47,47,0.12)",
                        color: isIn ? "#2e7d32" : "#d32f2f",
                        width: 44,
                        height: 44,
                      }}
                    >
                      {isIn ? <TrendingUpIcon /> : <TrendingDownIcon />}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 900 }}>{tx.title}</Typography>}
                    secondary={
                      <Stack spacing={0.2}>
                        <Typography sx={{ color: "text.secondary", fontWeight: 700 }}>{tx.subtitleText}</Typography>
                        <Typography sx={{ color: "text.secondary" }}>{tx.date}</Typography>
                      </Stack>
                    }
                  />
                </ListItem>

                {idx !== transactions.length - 1 ? <Divider component="li" /> : null}
              </React.Fragment>
            );
          })}
        </List>
      )}
    </Paper>
  );
}
