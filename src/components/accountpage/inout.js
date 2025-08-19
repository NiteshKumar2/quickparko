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
  CircularProgress,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import Tesseract from "tesseract.js";
import axios from "axios";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export default function ParkingMain() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  const [mode, setMode] = useState("Daily");
  const [searchResults, setSearchResults] = useState([]);
  const [openPopup, setOpenPopup] = useState(null); // "in" | "out"
  const [vehicleNo, setVehicleNo] = useState("");
  const [tokenNo, setTokenNo] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // ✅ Switch Daily/Monthly
  const handleSwitchChange = (e) => {
    setMode(e.target.checked ? "Monthly" : "Daily");
  };

  // ✅ Vehicle IN
  const handleOpenIn = async () => {
    setTokenNo(`TKN-${Math.floor(Math.random() * 10000)}`);
    setVehicleNo("");
    setOpenPopup("in");
    await startCamera();
  };

  // ✅ Vehicle OUT
  const handleOpenOut = () => {
    setVehicleNo("");
    setOpenPopup("out");
  };

  // ✅ Close popups + stop camera
  const handleClose = () => {
    setOpenPopup(null);
    setCameraOpen(false);
    setFormOpen(false);

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  // ✅ Exit vehicle
  const handleExitVehicle = async (id) => {
    setLoading(true);
    try {
      const res = await axios.put("/api/dailyclient", { id, status: "out" });

      if (res.data.success) {
        toast.success("Vehicle marked OUT ✅");

        setSearchResults((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, status: "out", updatedAt: new Date() } : r
          )
        );

        setTimeout(handleClose, 800);
      } else {
        toast.error(res.data.error || "Failed to mark vehicle OUT ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Submit form / search
  const handleSubmit = async () => {
    if (!userEmail) {
      toast.error("Please login first");
      return;
    }

    setLoading(true);
    try {
      if (openPopup === "in") {
        await axios.post("/api/dailyclient", {
          email: userEmail,
          vehicle: vehicleNo,
          token: tokenNo,
          status: "in",
        });
        toast.success("Vehicle IN recorded ✅");
        handleClose();
      } else if (openPopup === "out") {
        const res = await axios.post("/api/dailyclient/exitsearch", {
          email: userEmail,
          y: vehicleNo,
        });

        if (res.data.success) {
          setSearchResults(res.data.data);
          toast.success(`${res.data.count} records found`);
        } else {
          setSearchResults([]);
          toast.error(res.data.message || "No record found ❌");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Camera
  const startCamera = async () => {
    setCameraOpen(true);
    if (navigator.mediaDevices?.getUserMedia) {
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

    const plate = text.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    setVehicleNo(plate || "");
    setCameraOpen(false);
    setFormOpen(true);
  };

  return (
    <Box sx={{ textAlign: "center", mt: 15, mx: 2 }}>
      {/* Mode Switch */}
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
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mt: 5 }}>
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
          }}
          onClick={handleOpenIn}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "VEHICLE IN"}
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
          }}
          onClick={handleOpenOut}
          disabled={loading}
        >
          VEHICLE OUT
        </Button>
      </Stack>

      {/* Camera Popup */}
      <Dialog
        open={openPopup === "in" && cameraOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Scan Vehicle Number ({mode})
          <IconButton
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
                sx={{ bgcolor: "#2e7d32" }}
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

      {/* Form Popup */}
      <Dialog open={formOpen} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          Confirm Vehicle Details
          <IconButton
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
              sx={{ bgcolor: "#2e7d32" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* OUT Popup */}
      <Dialog
        open={openPopup === "out"}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Vehicle OUT ({mode})
          <IconButton
            onClick={handleClose}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={3} mt={2}>
            {/* Search input */}
            <TextField
              label="Search Vehicle No."
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ bgcolor: "#c62828" }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>

            {/* Results */}
            {searchResults.length > 0 && (
              <Stack spacing={2} mt={3}>
                {searchResults.map((r) => (
                  <Box
                    key={r._id}
                    sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2 }}
                  >
                    <Typography>
                      <b>Vehicle:</b> {r.vehicle}
                    </Typography>
                    <Typography>
                      <b>Token:</b> {r.token}
                    </Typography>
                    <Typography>
                      <b>Status:</b> {r.status}
                    </Typography>
                    <Typography>
                      <b>In Time:</b> {new Date(r.createdAt).toLocaleString()}
                    </Typography>
                    {r.status === "out" && (
                      <Typography>
                        <b>Out Time:</b>{" "}
                        {new Date(r.updatedAt).toLocaleString()}
                      </Typography>
                    )}
                    {r.status === "in" && (
                      <Button
                        variant="contained"
                        sx={{ mt: 1, bgcolor: "#c62828" }}
                        onClick={() => handleExitVehicle(r._id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <CircularProgress size={20} />
                        ) : (
                          "Exit Vehicle"
                        )}
                      </Button>
                    )}
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
