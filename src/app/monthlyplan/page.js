"use client";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function UpdateMonthlyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    vehicle: "",
    phone: "",
    planExpire: "", // yyyy-mm-dd
  });

  const [loading, setLoading] = useState(false);
  const [isNew, setIsNew] = useState(false);
  const [searching, setSearching] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 📌 Fetch existing record by vehicle
  const handleSearch = async () => {
    if (!form.vehicle.trim()) {
      alert("Enter vehicle number to search");
      return;
    }
    setSearching(true);
    try {
      const res = await axios.get("/api/monthlyclient", {
        params: { email: session?.user?.email, vehicle: form.vehicle },
      });

      if (res.data.success) {
        setForm({
          vehicle: res.data.data.vehicle,
          phone: res.data.data.phone,
          planExpire: res.data.data.planExpire.split("T")[0], // trim ISO date
        });
        alert("Record found ✅");
      } else {
        alert(res.data.error || "No record found ❌");
      }
    } catch (error) {
      console.error("Error fetching:", error);
      alert(error.response?.data?.error || "Something went wrong ❌");
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async () => {
    if (!form.vehicle.trim() || !form.phone.trim() || !form.planExpire.trim()) {
      alert("All fields are required!");
      return;
    }

    setLoading(true);

    try {
      const endpoint = "/api/monthlyclient";
      const method = isNew ? "post" : "put";

      const res = await axios[method](endpoint, {
        email: session?.user?.email,
        vehicle: form.vehicle,
        phone: form.phone,
        planExpire: form.planExpire,
      });

      if (res.data.success) {
        alert(isNew ? "Monthly record created!" : "Monthly record updated!");
        router.push("/account");
      } else {
        alert(res.data.error || "Operation failed");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box
        sx={{ p: 4, borderRadius: 3, boxShadow: 3, backgroundColor: "white" }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          mb={3}
          textAlign="center"
        >
          {isNew ? "Create Monthly Plan" : "Update Monthly Plan"}
        </Typography>

        <TextField
          fullWidth
          label="Vehicle Number"
          name="vehicle"
          value={form.vehicle}
          onChange={handleChange}
          margin="normal"
          required
        />

        {/* Search button (only when updating) */}
        {!isNew && (
          <Button
            fullWidth
            variant="outlined"
            color="secondary"
            onClick={handleSearch}
            disabled={searching}
            sx={{ mt: 1, mb: 2 }}
          >
            {searching ? <CircularProgress size={20} /> : "Search Record"}
          </Button>
        )}

        <TextField
          fullWidth
          label="Phone Number"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="date"
          label="Plan Expiry Date"
          name="planExpire"
          value={form.planExpire}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ mt: 3, py: 1.2, borderRadius: 2 }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : isNew ? (
            "Create Plan"
          ) : (
            "Update Plan"
          )}
        </Button>

        {/* Toggle Create/Update */}
        <Button
          fullWidth
          variant="text"
          color="secondary"
          onClick={() => setIsNew(!isNew)}
          sx={{ mt: 2 }}
        >
          {isNew
            ? "Want to update instead? Switch to Update"
            : "No record? Switch to Create"}
        </Button>
      </Box>
    </Container>
  );
}
