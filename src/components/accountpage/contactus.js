"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import { useSession } from "next-auth/react";

export default function ContactPage() {
  const { data: session } = useSession();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  // Prefill from NextAuth session
  useEffect(() => {
    if (session?.user) {
      setFormData((prev) => ({
        ...prev,
        username: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/parkoowner/contact", formData);
      toast.success("Message sent ✅");
      setFormData({
        username: session?.user?.name || "",
        email: session?.user?.email || "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", my: 10, px: 2 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom fontWeight="bold">
          Contact Us 📩
        </Typography>
        <Typography
          variant="body1"
          align="center"
          color="text.secondary"
          mb={3}
        >
          We'd love to hear from you! Please fill out the form below.
        </Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Your Name"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              fullWidth
              disabled={!!session?.user?.name} // lock if auto-filled
            />
            <TextField
              label="Your Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
              disabled={!!session?.user?.email} // lock if auto-filled
            />
            <TextField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
              placeholder="Write your message here..."
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ borderRadius: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
}
