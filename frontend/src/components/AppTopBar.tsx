import * as React from "react";
import { AppBar, Toolbar, Box, Typography, Button, Stack } from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { useNavigate, useLocation } from "react-router-dom";

export default function AppTopBar(): React.JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();

  const activePath = location.pathname;

  async function onLogout(): Promise<void> {
    try {
      await fetch("http://localhost:3000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      navigate("/", { replace: true });
    }
  }

  const navBtnSx = (path: string) => {
    const isActive = activePath === path;
    return {
      textTransform: "none",
      borderRadius: 999,
      px: 2,
      fontWeight: isActive ? 800 : 700,
      bgcolor: isActive ? "rgba(107,76,185,0.12)" : "transparent",
      color: isActive ? "#6b4cb9" : "text.secondary",
      "&:hover": { bgcolor: isActive ? "rgba(107,76,185,0.18)" : "rgba(0,0,0,0.04)" },
    } as const;
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "white",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <AccountBalanceIcon sx={{ color: "#6b4cb9" }} />
        <Typography sx={{ fontWeight: 900 }}>Atlas Bank</Typography>

        <Stack direction="row" spacing={1} sx={{ ml: 2 }} alignItems="center">
          <Button startIcon={<DashboardIcon />} onClick={() => navigate("/dashboard")} sx={navBtnSx("/dashboard")}>
            Dashboard
          </Button>

          <Button startIcon={<SwapHorizIcon />} onClick={() => navigate("/transfer")} sx={navBtnSx("/transfer")}>
            Transfer
          </Button>

          <Button startIcon={<ReceiptLongIcon />} onClick={() => navigate("/transactions")} sx={navBtnSx("/transactions")}>
            Transactions
          </Button>
        </Stack>

        <Box sx={{ flexGrow: 1 }} />

        <Button
          variant="outlined"
          onClick={onLogout}
          sx={{
            textTransform: "none",
            borderRadius: 999,
            borderColor: "rgba(107,76,185,0.35)",
            color: "#6b4cb9",
            fontWeight: 800,
            "&:hover": { borderColor: "#6b4cb9" },
          }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}
