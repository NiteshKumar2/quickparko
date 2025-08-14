"use client";
import React from "react";
import { Box, Typography, Stack, Paper } from "@mui/material";
import { styled } from "@mui/material/styles";

const StepCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  borderRadius: 16,
  flex: 1,
  backgroundColor: "#ffffff",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  minWidth: 280,
}));

export default function ProcessSection() {
  return (
    <Box
      sx={{
        py: 10,
        px: { xs: 2, md: 6 },
        bgcolor: "#f9f9f9",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h4"
        align="center"
        fontWeight={700}
        gutterBottom
        sx={{ mb: 5 }}
      >
        🚗 How It Works
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 8 }} // balanced spacing
          sx={{ width: "100%", maxWidth: 1200, margin: "auto" }}
        >
          {/* Parking Owner Section */}
          <StepCard>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              🅿 Parking Owner
            </Typography>
            <Typography variant="body1" gutterBottom>
              1️⃣ Sign up for your parking account.
            </Typography>
            <Typography variant="body1" gutterBottom>
              2️⃣ Update your profile with parking details.
            </Typography>
            <Typography variant="body1" gutterBottom>
              3️⃣ For vehicle entry/exit — scan or enter vehicle number & token.
            </Typography>
            <Typography variant="body1" gutterBottom>
              4️⃣ All activity is saved in your record book 📒.
            </Typography>
          </StepCard>

          {/* Vehicle Owner Section */}
          <StepCard>
            <Typography
              variant="h5"
              fontWeight="bold"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              🚗 Vehicle Owner
            </Typography>
            <Typography variant="body1" gutterBottom>
              1️⃣ Enter your vehicle number 📝.
            </Typography>
            <Typography variant="body1" gutterBottom>
              2️⃣ Instantly find parking status & details 📍.
            </Typography>
            <Typography variant="body1" gutterBottom>
              3️⃣ Quick & hassle-free process ⏱️.
            </Typography>
          </StepCard>
        </Stack>
      </Box>
    </Box>
  );
}
