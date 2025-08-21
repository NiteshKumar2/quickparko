"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Stack,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Chip,
  Divider,
} from "@mui/material";
import {
  CheckCircle,
  VisibilityOff,
  Delete,
  Refresh,
} from "@mui/icons-material";

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // ✅ Fetch messages
  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get("/api/parkoowner/contact");
      setMessages(res.data.data || []);
    } catch (error) {
      toast.error("Failed to load messages ❌");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // ✅ Toggle seen/unseen
  const markSeen = async (id, seen) => {
    try {
      await axios.put(`/api/parkoowner/contact/${id}`, { seen: !seen });
      toast.success(`Marked as ${!seen ? "seen" : "unseen"} ✅`);
      fetchMessages();
    } catch (error) {
      toast.error("Failed to update ❌");
    }
  };

  // ✅ Delete message
  const deleteMessage = async (id) => {
    try {
      await axios.delete(`/api/parkoowner/contact/${id}`);
      toast.success("Message deleted ✅");
      setMessages((prev) => prev.filter((msg) => msg._id !== id)); // instant UI update
    } catch (error) {
      toast.error("Failed to delete ❌");
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 6, px: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight="bold">
          📬 Contact Messages
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => {
            setRefreshing(true);
            fetchMessages();
          }}
          disabled={refreshing}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        {messages.length === 0 ? (
          <Typography textAlign="center" color="text.secondary" sx={{ py: 5 }}>
            No messages found.
          </Typography>
        ) : (
          messages.map((msg) => (
            <Card
              key={msg._id}
              sx={{
                borderRadius: 3,
                boxShadow: 3,
                backgroundColor: msg.seen ? "#f9f9f9" : "#fff",
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
              }}
            >
              <CardHeader
                title={
                  <Typography fontWeight="bold">{msg.username}</Typography>
                }
                subheader={msg.email}
                action={
                  <Chip
                    label={msg.seen ? "Seen" : "New"}
                    color={msg.seen ? "success" : "warning"}
                    size="small"
                  />
                }
              />
              <CardContent>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {msg.message}
                </Typography>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="outlined"
                    color={msg.seen ? "warning" : "success"}
                    startIcon={msg.seen ? <VisibilityOff /> : <CheckCircle />}
                    onClick={() => markSeen(msg._id, msg.seen)}
                  >
                    {msg.seen ? "Mark Unseen" : "Mark Seen"}
                  </Button>

                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<Delete />}
                    onClick={() => deleteMessage(msg._id)}
                  >
                    Delete
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Stack>
    </Box>
  );
}
