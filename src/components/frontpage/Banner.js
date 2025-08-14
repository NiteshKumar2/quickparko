"use client";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ParkingBanner() {
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSearch = async () => {
    if (!vehicleNumber.trim()) {
      alert("Please enter your vehicle number!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `/api/client/vehicle?vehicle=${vehicleNumber}`
      );
      const data = res.data;

      if (data.success) {
        // Redirect and send the data to the details page
        router.push(
          `/vehicledetails?data=${encodeURIComponent(JSON.stringify(data))}`
        );
      } else {
        alert(data.message || "Vehicle not found");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong while fetching data.");
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
              sx={{ px: 4, borderRadius: 2 }}
            >
              {loading ? "Searching..." : "Find Status"}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
