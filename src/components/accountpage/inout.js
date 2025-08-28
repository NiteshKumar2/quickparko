"use client";
import React, { useState, useRef, useEffect } from "react";
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
import { useRouter } from "next/navigation";

export default function ParkingMain() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";
  const router = useRouter();

  const [mode, setMode] = useState("Daily");
  const [availableModes, setAvailableModes] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [openPopup, setOpenPopup] = useState(null); // "in" | "inm" | "outm" | "out"
  const [vehicleNo, setVehicleNo] = useState("");
  const [tokenNo, setTokenNo] = useState("");
  const [cameraOpen, setCameraOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Fetch available modes
  useEffect(() => {
    const fetchOwnerModes = async () => {
      if (!userEmail) return;
      try {
        const res = await axios.get(`/api/auth/updateowner?email=${userEmail}`);
        if (res.data.success) {
          const { dailyMonthly } = res.data.owner;
          setAvailableModes(dailyMonthly || []);
          if (dailyMonthly.includes("daily")) setMode("Daily");
          else if (dailyMonthly.includes("monthly")) setMode("Monthly");
        }
      } catch (err) {
        console.error("Error fetching modes:", err);
      }
    };
    fetchOwnerModes();
  }, [userEmail]);

  // Switch toggle
  const handleSwitchChange = (e) => {
    if (
      availableModes.includes("daily") &&
      availableModes.includes("monthly")
    ) {
      setMode(e.target.checked ? "Monthly" : "Daily");
    }
  };

  // Open handlers
  const handleOpenIn = async () => {
    const prefix = userEmail ? userEmail.slice(0, 3).toUpperCase() : "TKN";
    setTokenNo(`${prefix}-${Math.floor(100 + Math.random() * 90)}`);
    setVehicleNo("");
    setOpenPopup("in");
    await startCamera();
  };
  const handleOpenInM = async () => {
    setVehicleNo("");
    setOpenPopup("inm");
    await startCamera();
  };
  const handleOpenOutM = async () => {
    setVehicleNo("");
    setOpenPopup("outm");
    await startCamera();
  };
  const handleOpenOut = () => {
    setVehicleNo("");
    setOpenPopup("out");
  };

  // Close all
  const handleClose = () => {
    setOpenPopup(null);
    setCameraOpen(false);
    setFormOpen(false);
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  };

  // Submit
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
        toast.success("Daily IN recorded ✅");
        handleClose();
      } else if (openPopup === "inm") {
        await axios.put("/api/monthlyclient/timing", {
          email: userEmail,
          vehicle: vehicleNo,
          action: "in",
        });
        toast.success("Monthly IN recorded ✅");
        handleClose();
      } else if (openPopup === "outm") {
        await axios.put("/api/monthlyclient/timing", {
          email: userEmail,
          vehicle: vehicleNo,
          action: "out",
        });
        toast.success("Monthly OUT recorded ✅");
        handleClose();
      } else if (openPopup === "out") {
        const res = await axios.post("/api/dailyclient/exitsearch", {
          email: userEmail,
          y: vehicleNo,
        });
        if (res.data.success) {
          setSearchResults(res.data.data);
          toast.success(`${res.data.count} record(s) found`);
        } else {
          setSearchResults([]);
          toast.error(res.data.message || "No record found ❌");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Error ❌");
    } finally {
      setLoading(false);
    }
  };

  // Exit daily OUT
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
        toast.error(res.data.error || "Failed ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  // Camera
  const startCamera = async () => {
    setCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } },
      });
      videoRef.current.srcObject = stream;
    } catch {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
      } catch {
        toast.error("Unable to access camera ❌");
      }
    }
  };

  // OCR
  const captureAndReadText = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      const {
        data: { text },
      } = await Tesseract.recognize(canvas, "eng", {
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      });
      let plate = text.replace(/[^A-Z0-9]/gi, "").toUpperCase();
      if (plate.length >= 6) {
        setVehicleNo(plate);
        setCameraOpen(false);
        setFormOpen(true);
      } else {
        toast.error("Plate not clear ❌");
      }
    } catch {
      toast.error("OCR failed ❌");
    }
  };

  return (
    <Box sx={{ textAlign: "center", mt: 15, mx: 2 }}>
      {/* Mode Switch */}
      <FormControlLabel
        control={
          <Switch
            checked={mode === "Monthly"}
            onChange={handleSwitchChange}
            disabled={availableModes.length < 2}
          />
        }
        label={<Typography variant="h6">{mode} Mode</Typography>}
      />

      {mode === "Monthly" && (
        <Button variant="outlined" onClick={() => router.push("/monthlyplan")}>
          Add Vehicle
        </Button>
      )}

      {/* IN / OUT Buttons */}
      <Stack direction="row" spacing={4} justifyContent="center" sx={{ mt: 5 }}>
        {mode === "Daily" ? (
          <>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleOpenIn}
              disabled={loading}
              sx={{ bgcolor: "#2e7d32" }}
            >
              VEHICLE IN
            </Button>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleOpenOut}
              disabled={loading}
              sx={{ bgcolor: "#c62828" }}
            >
              VEHICLE OUT
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              startIcon={<LoginIcon />}
              onClick={handleOpenInM}
              disabled={loading}
              sx={{ bgcolor: "#2e7d32" }}
            >
              VEHICLE IN
            </Button>
            <Button
              variant="contained"
              startIcon={<LogoutIcon />}
              onClick={handleOpenOutM}
              disabled={loading}
              sx={{ bgcolor: "#c62828" }}
            >
              VEHICLE OUT
            </Button>
          </>
        )}
      </Stack>

      {/* ✅ Single Camera Popup */}
      <Dialog
        open={["in", "inm", "outm"].includes(openPopup) && cameraOpen}
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
              muted
              style={{ width: "100%" }}
            />
            <canvas ref={canvasRef} style={{ display: "none" }} />
            <Stack spacing={2} mt={2}>
              <Button variant="contained" onClick={captureAndReadText}>
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

      {/* ✅ Single Form Popup */}
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
          <Stack spacing={3}>
            <TextField
              label="Vehicle No."
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              fullWidth
            />
            {openPopup === "in" && (
              <TextField
                label="Token No."
                value={tokenNo}
                onChange={(e) => setTokenNo(e.target.value)}
                fullWidth
              />
            )}
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Submit"}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ✅ OUT Search Popup */}
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
          <Stack spacing={3}>
            <TextField
              label="Search Vehicle No."
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{ bgcolor: "#c62828" }}
            >
              {loading ? <CircularProgress size={24} /> : "Search"}
            </Button>
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
                    <b>Out Time:</b> {new Date(r.updatedAt).toLocaleString()}
                  </Typography>
                )}
                {r.status === "in" && (
                  <Button
                    variant="contained"
                    sx={{ mt: 1, bgcolor: "#c62828" }}
                    onClick={() => handleExitVehicle(r._id)}
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={20} /> : "Exit Vehicle"}
                  </Button>
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
