"use client";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ParkingBanner() {
  const [vehicleNumber, setVehicleNumber] = useState("");

  const handleSearch = () => {
    if (!vehicleNumber.trim()) {
      alert("Please enter your vehicle number!");
      return;
    }
    // Add API call or logic to fetch car status
    alert(`Searching status for: ${vehicleNumber}`);
  };

  return (
    <Box
      sx={{
        minHeight: "80vh",
        background: "linear-gradient(to bottom, #f0f8ff, #e6f7ff)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
      }}
    >
      <Container maxWidth="md" sx={{ textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
          >
            Welcome to QuickParko 🚗
          </Typography>
          <Typography variant="h6" sx={{ color: "#555", mb: 4 }}>
            Check your vehicle status instantly — anywhere, anytime.
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <TextField
              variant="outlined"
              placeholder="Enter Vehicle Number"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 2,
                width: { xs: "100%", sm: "300px" },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSearch}
              sx={{ px: 4, borderRadius: 2 }}
            >
              Find Status
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
