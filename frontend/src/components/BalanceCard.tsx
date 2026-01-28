import * as React from "react";
import { Paper, Box, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

export default function BalanceCard({ balanceText }: { balanceText: string }): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 6,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        mb: 4,
      }}
    >
      <Box
        sx={{
          p: { xs: 3, sm: 4 },
          minHeight: 170,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(90deg, rgba(93,120,255,0.95), rgba(107,76,185,0.95))",
          color: "white",
        }}
      >
        <Typography sx={{ opacity: 0.9, fontWeight: 700 }}>Total Balance</Typography>

        <Typography variant="h2" sx={{ fontWeight: 900, letterSpacing: -1, mt: 1 }}>
          {balanceText}
        </Typography>

        <Box sx={{ mt: 3 }}>
          <Button
            onClick={() => navigate("/transfer")}
            startIcon={<ArrowForwardIcon />}
            sx={{
              textTransform: "none",
              borderRadius: 999,
              px: 2.2,
              py: 0.9,
              bgcolor: "rgba(255,255,255,0.18)",
              color: "white",
              fontWeight: 800,
              "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
            }}
          >
            Transfer money
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
