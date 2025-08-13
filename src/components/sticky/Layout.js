import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Box } from "@mui/material";

export default function Layout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "120vh", // full viewport height
      }}
    >
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
          px: 2,
          minHeight: "65vh", // ensures at least half the screen height for content
        }}
      >
        {children}
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
}
