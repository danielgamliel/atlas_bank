import * as React from "react";
import { Box, Container } from "@mui/material";
import AppTopBar from "./AppTopBar";

export default function AppLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fbf9ff" }}>
      <AppTopBar />
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {children}
      </Container>
    </Box>
  );
}
