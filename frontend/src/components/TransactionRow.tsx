import * as React from "react";
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Stack } from "@mui/material";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import type { TxItem } from "../types/transactions";
import StatusChip from "./StatusChip"; 

export default function TransactionRow({ tx }: { tx: TxItem }): React.JSX.Element {
  const isIn = tx.direction === "in";
  const avatarBg = isIn ? "rgba(46,125,50,0.12)" : "rgba(211,47,47,0.12)";
  const avatarColor = isIn ? "#2e7d32" : "#d32f2f";

  return (
    <ListItem
      sx={{ py: { xs: 2, sm: 2.4 }, px: { xs: 2, sm: 3 } }}
      secondaryAction={
        <Stack spacing={0.8} alignItems="flex-end">
          <Typography
            sx={{
              fontWeight: 900,
              fontSize: 18,
              color: isIn ? "#2e7d32" : "text.primary",
            }}
          >
            {tx.amountText}
          </Typography>
          <StatusChip status={tx.status} />
        </Stack>
      }
    >
      <ListItemAvatar>
        <Avatar sx={{ bgcolor: avatarBg, color: avatarColor, width: 48, height: 48 }}>
          {isIn ? <TrendingUpIcon /> : <TrendingDownIcon />}
        </Avatar>
      </ListItemAvatar>

      <ListItemText
        primary={<Typography sx={{ fontWeight: 900 }}>{tx.title}</Typography>}
        secondary={
          <Stack spacing={0.2}>
            <Typography sx={{ color: "text.secondary", fontWeight: 600 }}>
              {tx.subtitleText}
            </Typography>
            <Typography sx={{ color: "text.secondary" }}>
              {tx.date}
            </Typography>
          </Stack>
        }
      />
    </ListItem>
  );
}
