import { useMemo, useState } from "react";
import {Box, Paper, Typography, TextField, Button, Stack, Link, CircularProgress} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useNavigate } from "react-router-dom";
import { signup } from "../api/auth";

export type SignupPageProps = {
  onSubmit?: (data: { email: string; password: string }) => void;
  onLoginClick?: () => void;
};

export default function SignupPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const emailError = useMemo(() => {
    if (email.trim() === "") return false;
    return !/^\S+@\S+\.\S+$/.test(email);
  }, [email]);

  const confirmError = useMemo(() => {
    if (confirmPassword.trim() === "") return false;
    return confirmPassword !== password;
  }, [password, confirmPassword]);

  const canSubmit = useMemo(() => {
    if (isLoading) return false;
    if (email.trim() === "" || password.trim() === "" || confirmPassword.trim() === "") return false;
    if (emailError || confirmError) return false; 
    return true;
  }, [isLoading, email, password, confirmPassword, emailError, confirmError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!canSubmit || isLoading) return;
  
    setIsLoading(true);
    setServerError(null);
  
    try {
      await signup(email, password);
      setSubmitted(true);
    } catch (err: any) {
      setServerError(err?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };
  const onLoginClick = () => navigate("/");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f3fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1,
        py: 1,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 460,
          borderRadius: 6,
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 10px 30px rgba(0,0,0,0.10)",
          px: { xs: 3, sm: 7 },
          py: { xs: 4, sm: 4 },
          textAlign: "center",
          bgcolor: "#fff",
        }}
      >
        <Stack spacing={2.5} alignItems="center">
          <AccountBalanceIcon sx={{ color: "#6b4cb9", fontSize: 34 }} />

          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -0.8 }}>
            Create Account
          </Typography>

          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Join Atlas Bank today
          </Typography>

          {submitted ? (
            /* ===== SUCCESS STATE ===== */
            <Stack spacing={3} alignItems="center" sx={{ pt: 3 }}>
              <AccountBalanceIcon sx={{ color: "#4caf50", fontSize: 48 }} />

              <Typography variant="h4" sx={{ fontWeight: 800 }}>
                Check your email
              </Typography>

              <Typography sx={{ color: "text.secondary", maxWidth: 360 }}>
                We’ve sent a verification link to <b>{email}</b>.
                <br />
                Please check your inbox to activate your account.
              </Typography>

              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                Didn’t get the email? Check your spam folder.
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  borderRadius: 999,
                  px: 4,
                  textTransform: "none",
                  fontWeight: 600,
                }}
                onClick={onLoginClick}
              >
                Back to login
              </Button>
            </Stack>
          ) : (
            /* ===== FORM STATE ===== */
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                width: "100%",
                maxWidth: 460,
                pt: 2,
                mx: "auto",
              }}
            >
              <Stack spacing={3}>
                <TextField
                  label="Email"
                  required
                  fullWidth
                  value={email}
                  onChange={(e): void => setEmail(e.target.value)}
                  error={emailError}
                  helperText={emailError ? "Please enter a valid email." : " "}
                  autoComplete="email"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <TextField
                  label="Password"
                  required
                  fullWidth
                  type="password"
                  value={password}
                  onChange={(e): void => setPassword(e.target.value)}
                  autoComplete="new-password"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                <TextField
                  label="Confirm Password"
                  required
                  fullWidth
                  type="password"
                  value={confirmPassword}
                  onChange={(e): void => setConfirmPassword(e.target.value)}
                  error={confirmError}
                  helperText={confirmError ? "Passwords do not match." : " "}
                  autoComplete="new-password"
                  sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                />

                {serverError ? (<Typography sx={{ color: "error.main", textAlign: "left" }}>{serverError}</Typography>) : null}

                <Button
                  type="submit"
                  disabled={!canSubmit}
                  size="large"
                  variant="contained"
                  startIcon={isLoading ? (<CircularProgress size={18} color="inherit" />) : null}
                  sx={{
                    mt: 1,
                    height: 56,
                    borderRadius: 999,
                    textTransform: "none",
                    fontWeight: 700,
                    bgcolor: "#6b4cb9",
                    "&:hover": { bgcolor: "#5a3fa0" },
                  }}
                >
                  {isLoading ? "Creating..." : "Create account"}
                </Button>

                <Typography sx={{ color: "text.secondary" }}>
                  Already have an account?{" "}
                  <Link
                    component="button"
                    type="button"
                    onClick={onLoginClick}
                    underline="always"
                    sx={{ fontWeight: 600, color: "#6b4cb9" }}
                  >
                    Login
                  </Link>
                </Typography>
              </Stack>
            </Box>
          )}
        </Stack>
      </Paper>
    </Box>
  );
}
