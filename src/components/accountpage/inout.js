"use client";
import React, { useState, useRef } from "react";
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
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Tesseract from "tesseract.js";

export default function ParkingMain() {
  const [mode, setMode] = useState("Daily"); // Daily or Monthly
  const [openPopup, setOpenPopup] = useState(null); // "in", "out", or null
  const [vehicleNo, setVehicleNo] = useState("");
  const [tokenNo, setTokenNo] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false); // second popup for details
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ✅ Switch between Daily/Monthly
  const handleSwitchChange = (e) => {
    setMode(e.target.checked ? "Monthly" : "Daily");
  };

  // ✅ Open Vehicle IN
  const handleOpenIn = async () => {
    setTokenNo(`TKN-${Math.floor(Math.random() * 10000)}`);
    setVehicleNo(""); // reset
    setOpenPopup("in");
    await startCamera();
  };

  // ✅ Open Vehicle OUT
  const handleOpenOut = () => {
    setVehicleNo("");
    setOpenPopup("out");
  };

  const handleClose = () => {
    setOpenPopup(null);
    setCameraOpen(false);
    setFormOpen(false);
  };

  // ✅ Submit form
  const handleSubmit = () => {
    console.log({
      mode,
      action: openPopup,
      vehicleNo,
      tokenNo,
    });
    handleClose();
  };

  // ✅ Start camera
  const startCamera = async () => {
    setCameraOpen(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    }
  };

  // ✅ Capture + OCR
  const captureAndReadText = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const {
      data: { text },
    } = await Tesseract.recognize(canvas, "eng");

    // Clean text (only keep alphanumeric like plate numbers)
    const plate = text.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    setVehicleNo(plate || "");
    setCameraOpen(false);
    setFormOpen(true); // ✅ move to second popup
  };

  return (
    <Box sx={{ textAlign: "center", mt: 15 }}>
      {/* Switch */}
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

      {/* IN / OUT Buttons */}
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
          onClick={handleOpenIn}
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
          onClick={handleOpenOut}
        >
          VEHICLE OUT
        </Button>
      </Stack>

      {/* Camera Popup (Vehicle IN) */}
      <Dialog
        open={openPopup === "in" && cameraOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Scan Vehicle Number ({mode})
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ textAlign: "center" }}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{ width: "100%", borderRadius: 8 }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <Stack spacing={2} mt={2}>
              <Button
                variant="contained"
                onClick={captureAndReadText}
                sx={{ bgcolor: "#2e7d32", "&:hover": { bgcolor: "#1b5e20" } }}
              >
                Capture & Read Text
              </Button>
              <Button
                variant="outlined"
                startIcon={<CameraAltIcon />}
                onClick={() => {
                  setCameraOpen(false);
                  setFormOpen(true);
                }}
              >
                Enter Manually
              </Button>
            </Stack>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Second Popup (Form) */}
      <Dialog open={formOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Confirm Vehicle Details
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
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
        </DialogContent>
      </Dialog>

      {/* Vehicle OUT Popup */}
      <Dialog
        open={openPopup === "out"}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Vehicle OUT ({mode})
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
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
        </DialogContent>
      </Dialog>
    </Box>
  );
}
