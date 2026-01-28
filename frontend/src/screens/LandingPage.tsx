
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  Paper,
  Stack,
  Button,
} from "@mui/material";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import { useNavigate } from "react-router-dom";



export type LandingPageProps = {
  onLogin?: () => void;
  onSignup?: () => void;
};

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f7f3fb",
        display: "flex",
        flexDirection: "column",
      }}
    >
     
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: "white",
          color: "text.primary",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Toolbar sx={{ gap: 1.5 }}>
          <AccountBalanceIcon sx={{ color: "#6b4cb9" }} />
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Atlas Bank
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Button
            variant="text"
            onClick={handleLogin}
            sx={{ textTransform: "none", fontWeight: 700, color: "#6b4cb9" }}
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container
        maxWidth="sm"
        sx={{
          flexGrow: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 6,
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

            <Typography
              variant="h3"
              sx={{ fontWeight: 900, letterSpacing: -0.8 }}
            >
              Atlas Bank
            </Typography>

            <Typography variant="h6" sx={{ color: "text.secondary" }}>
              Modern banking for the digital age
            </Typography>

            <Stack spacing={2} sx={{ pt: 2, width: "100%", maxWidth: 360 }}>
              <Button
                fullWidth
                size="large"
                variant="contained"
                onClick={handleLogin}
                sx={{
                  height: 56,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 800,
                  bgcolor: "#6b4cb9",
                  "&:hover": { bgcolor: "#5a3fa0" },
                }}
              >
                Login
              </Button>

              <Button
                fullWidth
                size="large"
                variant="outlined"
                onClick={handleSignup}
                sx={{
                  height: 56,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 800,
                  borderColor: "rgba(107,76,185,0.35)",
                  color: "#6b4cb9",
                  "&:hover": { borderColor: "#6b4cb9" },
                }}
              >
                Sign up
              </Button>
            </Stack>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
}
