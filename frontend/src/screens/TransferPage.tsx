import * as React from "react";
import { useMemo, useState } from "react";
import {AppBar,Toolbar,Box,Typography,Button,Container,Stack,Paper,TextField
  ,InputAdornment,Divider} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SendIcon from "@mui/icons-material/Send";
import { useNavigate } from "react-router-dom";

export type TransferPayload = {
  recipientEmail: string;
  amount: number; 
  description?: string;
};

export type TransferPageProps = {
  onSubmit?: (payload: TransferPayload) => void; 
  onCancel?: () => void;

  onNavDashboard?: () => void;
  onNavTransfer?: () => void;
  onNavTransactions?: () => void;
  onLogout?: () => void;
};

type ApiErrorBody = | { success: false; error: string }
| { success: false; error: { code?: string; message?: string } };

function isValidEmail(email: string): boolean {
  return /^\S+@\S+\.\S+$/.test(email);
}

function formatApiErrorMessage(data: any): string {
  if (!data) return "Request failed";
  if (typeof data?.error === "string") return data.error;
  if (typeof data?.error?.message === "string") return data.error.message;
  return "Request failed";
}

export default function TransferPage(props: TransferPageProps) {
  const navigate = useNavigate();
  const {onSubmit,onCancel} = props;

  const [recipientEmail, setRecipientEmail] = useState<string>("");
  const [amountText, setAmountText] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [amountTooLarge, setAmountTooLarge] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [successText, setSuccessText] = useState<string>("");

  const emailError = useMemo((): boolean => {
    if (recipientEmail.trim() === "") return false;
    return !isValidEmail(recipientEmail.trim());
  }, [recipientEmail]);

  const amountNumber = useMemo((): number | null => {
    if (amountText.trim() === "") return null;
    const n = Number(amountText);
    if (!Number.isFinite(n)) return null;
    return n;
  }, [amountText]);

  const amountError = useMemo((): boolean => {
    if (amountText.trim() === "") return false;
    if (amountNumber === null) return true;
    return amountNumber <= 0;
  }, [amountText, amountNumber]);

  const canSubmit = useMemo((): boolean => {
    if (loading) return false;
    if (recipientEmail.trim() === "" || amountText.trim() === "") return false;
    if (emailError || amountError) return false;
    if (amountNumber === null) return false;
    return true;
  }, [loading, recipientEmail, amountText, emailError, amountError, amountNumber]);

  const handleAmountChange = (value: string): void => {
    if (!/^\d*\.?\d*$/.test(value)) return;
    if (Number(value) > 1_000_000) {
      setAmountTooLarge(true);
      return;
    }
    setAmountTooLarge(false);
    setAmountText(value);
  };

  async function postTransfer(payload: TransferPayload): Promise<void> {
    const url = "http://localhost:3000/api/v1/transactions";

    console.log("[Transfer] POST start", {
      url,
      recipientEmail: payload.recipientEmail,
      amount: payload.amount,
      hasDescription: Boolean(payload.description),
    });

    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("[Transfer] response meta", {
      ok: res.ok,
      status: res.status,
      statusText: res.statusText,
      type: res.type,
      url: res.url,
    });

    const text = await res.text();
    console.log("[Transfer] raw body:", text);

    const data = (text ? JSON.parse(text) : null) as ApiErrorBody | any;

    if (!res.ok) {
      const msg = formatApiErrorMessage(data);

      if (res.status === 401) throw Object.assign(new Error(msg || "Unauthorized"), { status: 401, data });

      throw Object.assign(new Error(msg), { status: res.status, data });
    }

    console.log("[Transfer] success", data);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (!canSubmit) return;
    if (amountNumber === null) return;

    setErrorText("");
    setSuccessText("");
    setLoading(true);

    const payload: TransferPayload = {
      recipientEmail: recipientEmail.trim(),
      amount: amountNumber,
      description: description.trim() ? description.trim() : undefined,
    };

    try {
      onSubmit?.(payload);

      await postTransfer(payload);

      setSuccessText("Transfer completed ✅");
      setRecipientEmail("");
      setAmountText("");
      setDescription("");
      
    } catch (err: any) {
      console.log("[Transfer] failed:", err?.status, err?.message, err);

     
      if (err?.status === 401) {
        setErrorText("Session expired / Unauthorized. Please login again.");
      } else {
        setErrorText(err?.message || "Transfer failed");
      }
    } finally {
      setLoading(false);
    }
  };

  
const onLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } finally {
      navigate("/", { replace: true });
    }
};

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fbf9ff" }}>
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
          <Typography sx={{ fontWeight: 800 }}>Atlas Bank</Typography>

          <Stack direction="row" spacing={1} sx={{ ml: 2 }} alignItems="center">
            <Button
              startIcon={<DashboardIcon />}
              onClick={() => navigate("/dashboard")}
              sx={{
                textTransform: "none",
                borderRadius: 999,
                px: 2,
                color: "text.secondary",
                fontWeight: 600,
              }}
            >
              Dashboard
            </Button>

            <Button
              startIcon={<SwapHorizIcon />}
              onClick={() => console.log("TF do u want?!")}
              sx={{
                textTransform: "none",
                borderRadius: 999,
                px: 2,
                bgcolor: "rgba(107,76,185,0.12)",
                color: "#6b4cb9",
                fontWeight: 700,
                "&:hover": { bgcolor: "rgba(107,76,185,0.18)" },
              }}
            >
              Transfer
            </Button>

            <Button
              startIcon={<ReceiptLongIcon />}
              onClick={() => navigate("/transactions")}
              sx={{
                textTransform: "none",
                borderRadius: 999,
                px: 2,
                color: "text.secondary",
                fontWeight: 600,
              }}
            >
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
              fontWeight: 700,
              "&:hover": { borderColor: "#6b4cb9" },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Stack spacing={1} alignItems="center" sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: -1 }}>
            Transfer Money
          </Typography>
          <Typography sx={{ color: "text.secondary" }}>
            Send money to another Atlas Bank account
          </Typography>
        </Stack>

        <Paper
          elevation={0}
          sx={{
            mx: "auto",
            width: "100%",
            maxWidth: 920,
            borderRadius: 6,
            border: "1px solid",
            borderColor: "divider",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            p: { xs: 3, sm: 4 },
            bgcolor: "white",
          }}
        >
          <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
            <Stack spacing={3}>
              <TextField
                label="Recipient Email"
                required
                fullWidth
                value={recipientEmail}
                onChange={(e): void => setRecipientEmail(e.target.value)}
                error={emailError}
                helperText={emailError ? "Please enter a valid email." : "Enter the email address of the recipient"}
                autoComplete="email"
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />

              <TextField
                label="Amount"
                required
                fullWidth
                value={amountText}
                onChange={(e): void => handleAmountChange(e.target.value)}
                error={amountTooLarge || amountError}
                helperText={
                  amountTooLarge
                    ? "Maximum transfer amount is $1,000,000"
                    : amountError
                      ? "Amount must be a valid positive number"
                      : "Enter the amount to transfer"
                }
                inputMode="decimal"
                InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />

              <TextField
                label="Description"
                fullWidth
                value={description}
                onChange={(e): void => setDescription(e.target.value)}
                helperText="Add a description for this transfer"
                multiline
                minRows={3}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
              />

              {errorText ? (
                <Typography sx={{ color: "error.main", fontWeight: 700 }}>{errorText}</Typography>
              ) : null}

              {successText ? (
                <Typography sx={{ color: "#2e7d32", fontWeight: 800 }}>{successText}</Typography>
              ) : null}

              <Divider sx={{ my: 1 }} />

              <Stack direction="row" spacing={2} alignItems="center">
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  size="large"
                  variant="contained"
                  startIcon={<SendIcon />}
                  sx={{
                    flexGrow: 1,
                    height: 56,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 800,
                    bgcolor: "#6b4cb9",
                    "&:hover": { bgcolor: "#5a3fa0" },
                  }}
                >
                  {loading ? "Sending..." : "Send"}
                </Button>

                <Button
                  type="button"
                  onClick={onCancel}
                  size="large"
                  variant="outlined"
                  sx={{
                    width: 140,
                    height: 56,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 800,
                    borderColor: "rgba(107,76,185,0.35)",
                    color: "#6b4cb9",
                    "&:hover": { borderColor: "#6b4cb9" },
                  }}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
