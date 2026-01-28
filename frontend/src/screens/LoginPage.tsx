import { useMemo, useState } from "react";
import { Box, Paper, Typography, TextField, Button, Stack, Link} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useNavigate } from "react-router-dom";

export type LoginPageProps = {
  onSignupClick?: () => void;
  loading?: boolean;
  errorText?: string;
};

export default function LoginPage(props: LoginPageProps) {
  const {onSignupClick, loading = false} = props;
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");

  const emailError = useMemo(() => {
    if (email.trim() === "") return false;
    return !/^\S+@\S+\.\S+$/.test(email);
  }, [email]);

  const canSubmit = useMemo(() => {
    if (loading) return false;
    if (email.trim() === "" || password.trim() === "") return false;
    if (emailError) return false;
    return true;
  }, [loading, email, password, emailError]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // for cookies
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json().catch(() => null);
      console.log("data:", data);
  
      if (!res.ok) {setErrorText(data?.error?.message || "Login failed");return;}
  
      console.log("JWT:", data.data.token);
      navigate("/dashboard");
  
    } catch (err) {setErrorText("Network error. Please try again.");}
  };
  

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f3fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
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
          px: { xs: 3, sm: 5 },
          py: { xs: 4, sm: 5 },
          textAlign: "center",
          bgcolor: "#fff",
        }}
      >
        <Stack spacing={2.5} alignItems="center">
          <AccountBalanceIcon sx={{ color: "#6b4cb9", fontSize: 34 }} />

          <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: -0.8 }}>
            Welcome Back
          </Typography>

          <Typography variant="h6" sx={{ color: "text.secondary" }}>
            Sign in to your Atlas Bank account
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{width: "100%", maxWidth: 620, pt: 2,}}>
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
                sx={{"& .MuiOutlinedInput-root": {borderRadius: 3,},}}
              />

              <TextField
                label="Password"
                required
                fullWidth
                type="password"
                value={password}
                onChange={(e): void => setPassword(e.target.value)}
                autoComplete="current-password"
                sx={{"& .MuiOutlinedInput-root": {borderRadius: 3,},}}
              />

              {errorText ? (<Typography sx={{ color: "error.main", textAlign: "left" }}>{errorText}</Typography>) : null}

              <Button
                type="submit"
                disabled={!canSubmit}
                size="large"
                variant="contained"
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
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Typography sx={{ color: "text.secondary" }}>
                Don&apos;t have an account?{" "}
                <Link
                  component="button"
                  type="button"
                  onClick={onSignupClick}
                  underline="always"
                  sx={{ fontWeight: 600, color: "#6b4cb9" }}
                >
                  Sign up
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
