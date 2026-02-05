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
  import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
  import { useNavigate } from "react-router-dom";
  
  export default function VerifyFailedPage(): React.JSX.Element {
    const navigate = useNavigate();
  
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
              <ErrorOutlineIcon sx={{ color: "#d32f2f", fontSize: 56 }} />
  
              <Typography variant="h4" sx={{ fontWeight: 900 }}>
                Verification failed
              </Typography>
  
              <Typography sx={{ color: "text.secondary" }}>
                The verification link is invalid or has expired.  
                Please try signing up again.
              </Typography>
  
              <Button
                size="large"
                variant="contained"
                onClick={() => navigate("/", { replace: true })}
                sx={{
                  mt: 2,
                  height: 56,
                  borderRadius: 999,
                  textTransform: "none",
                  fontWeight: 800,
                  bgcolor: "#6b4cb9",
                  "&:hover": { bgcolor: "#5a3fa0" },
                }}
              >
                Back to Home
              </Button>
            </Stack>
          </Paper>
        </Container>
      </Box>
    );
  }
  