import * as React from "react";
import { Chip } from "@mui/material";

export type TxStatus = "completed" | "pending" | "failed";

export default function StatusChip({ status }: { status: TxStatus }): React.JSX.Element {
  if (status === "completed") {
    return (
      <Chip
        label="completed"
        size="small"
        sx={{ bgcolor: "#2e7d32", color: "white", fontWeight: 700, textTransform: "lowercase" }}
      />
    );
  }

  if (status === "pending") {
    return (
      <Chip
        label="pending"
        size="small"
        sx={{ bgcolor: "#ed6c02", color: "white", fontWeight: 700, textTransform: "lowercase" }}
      />
    );
  }

  return (
    <Chip
      label="failed"
      size="small"
      sx={{ bgcolor: "#d32f2f", color: "white", fontWeight: 700, textTransform: "lowercase" }}
    />
  );
}
