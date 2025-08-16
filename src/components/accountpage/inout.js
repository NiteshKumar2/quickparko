"use client";
import React, { useState } from "react";
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  IconButton,
  Typography,
  Switch,
  FormControlLabel,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";

export default function ParkingMain() {
  const [mode, setMode] = useState("Daily"); // Daily or Monthly
  const [openPopup, setOpenPopup] = useState(null); // "in", "out", or null
  const [vehicleNo, setVehicleNo] = useState("");
  const [tokenNo, setTokenNo] = useState("");

  const handleSwitchChange = (e) => {
    setMode(e.target.checked ? "Monthly" : "Daily");
  };

  const handleOpen = (type) => {
    setOpenPopup(type);
    if (type === "in") {
      // reset for fresh entry
      setTokenNo(`TKN-${Math.floor(Math.random() * 10000)}`);
    }
  };

  const handleClose = () => setOpenPopup(null);

  const handleSubmit = () => {
    console.log({
      mode,
      action: openPopup,
      vehicleNo,
      tokenNo,
    });
    handleClose();
  };

  return (
    <Box sx={{ textAlign: "center", mt: 15 }}>
      {/* Beautiful switch */}
      <FormControlLabel
        control={
          <Switch
            checked={mode === "Monthly"}
            onChange={handleSwitchChange}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": { color: "#2e7d32" },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: "#66bb6a",
              },
            }}
          />
        }
        label={
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            {mode} Mode
          </Typography>
        }
      />

      {/* Buttons */}
      <Stack
        direction="row"
        spacing={4}
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 5, mx: 2 }}
      >
        <Button
          variant="contained"
          startIcon={<LoginIcon sx={{ fontSize: 40 }} />}
          sx={{
            bgcolor: "#2e7d32",
            fontSize: "1.1rem",
            fontWeight: "bold",
            px: 6,
            py: 2,
            borderRadius: "16px",
            boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
            "&:hover": { bgcolor: "#1b5e20" },
          }}
          onClick={() => handleOpen("in")}
        >
          VEHICLE IN
        </Button>

        <Button
          variant="contained"
          startIcon={<LogoutIcon sx={{ fontSize: 40 }} />}
          sx={{
            bgcolor: "#c62828",
            fontSize: "1.1rem",
            fontWeight: "bold",
            px: 6,
            py: 2,
            borderRadius: "16px",
            boxShadow: "0px 6px 12px rgba(0,0,0,0.2)",
            "&:hover": { bgcolor: "#8e0000" },
          }}
          onClick={() => handleOpen("out")}
        >
          VEHICLE OUT
        </Button>
      </Stack>

      {/* Popup */}
      <Dialog
        open={Boolean(openPopup)}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {openPopup === "in" ? "Vehicle IN" : "Vehicle OUT"} ({mode})
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          {openPopup === "in" ? (
            <Stack spacing={3} mt={2}>
              <TextField
                label="Vehicle No."
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                fullWidth
              />
              <TextField
                label="Token No."
                value={tokenNo}
                onChange={(e) => setTokenNo(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}
              >
                Submit
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3} mt={2}>
              <TextField
                label="Search Vehicle No."
                value={vehicleNo}
                onChange={(e) => setVehicleNo(e.target.value)}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleSubmit}
                sx={{ bgcolor: "#c62828", "&:hover": { bgcolor: "#8e0000" } }}
              >
                Search & Exit
              </Button>
            </Stack>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
