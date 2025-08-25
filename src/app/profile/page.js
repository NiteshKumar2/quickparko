"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Stack,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import axios from "axios";

export default function UpdateOwnerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    phone: "",
    address: "",
    termCondition: "",
    dailyMonthly: [],
    price: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true); // ✅ loader for initial fetch

  // 🔹 Fetch owner data when session is ready
  useEffect(() => {
    const fetchOwner = async () => {
      if (status === "authenticated" && session?.user?.email) {
        try {
          const res = await axios.get(
            `/api/auth/updateowner?email=${session.user.email}`
          );
          if (res.data.success) {
            const owner = res.data.owner;

            setForm({
              username: owner.username || "",
              phone: owner.phone || "",
              address: owner.address || "",
              termCondition: owner.termCondition || "",
              dailyMonthly: owner.dailyMonthly || [],
              price: owner.price || "",
            });
          }
        } catch (err) {
          console.error("Error fetching owner:", err);
        } finally {
          setFetching(false);
        }
      }
    };

    fetchOwner();
  }, [status, session]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ handle checkbox toggle
  const handlePlanChange = (plan) => {
    setForm((prev) => {
      if (prev.dailyMonthly.includes(plan)) {
        return {
          ...prev,
          dailyMonthly: prev.dailyMonthly.filter((p) => p !== plan),
        };
      } else {
        return {
          ...prev,
          dailyMonthly: [...prev.dailyMonthly, plan],
        };
      }
    });
  };

  const handleSubmit = async () => {
    if (status !== "authenticated") {
      alert("You must be logged in to update details!");
      return;
    }

    if (!form.phone.trim()) {
      alert("Phone number is required!");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put("/api/auth/updateowner", {
        email: session.user.email, // ✅ taken from NextAuth
        isVerified: true,
        ...form,
      });

      if (res.data.success) {
        router.push("/account");
      } else {
        alert(res.data.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || fetching) {
    return (
      <Container maxWidth="sm" sx={{ py: 6, textAlign: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          color="primary"
          mb={3}
          textAlign="center"
        >
          Update Owner
        </Typography>

        <TextField
          fullWidth
          label="Username"
          name="username"
          value={form.username}
          onChange={handleChange}
          margin="normal"
        />
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
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Terms & Conditions"
          name="termCondition"
          value={form.termCondition}
          onChange={handleChange}
          margin="normal"
        />

        {/* ✅ Plan type checkboxes */}
        <Stack direction="row" spacing={2} mt={2}>
          <FormControlLabel
            control={
              <Checkbox
                checked={form.dailyMonthly.includes("daily")}
                onChange={() => handlePlanChange("daily")}
              />
            }
            label="Daily"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={form.dailyMonthly.includes("monthly")}
                onChange={() => handlePlanChange("monthly")}
              />
            }
            label="Monthly"
          />
        </Stack>

        <TextField
          fullWidth
          type="number"
          label="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          margin="normal"
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
          ) : (
            "Update Owner"
          )}
        </Button>
      </Box>
    </Container>
  );
}
