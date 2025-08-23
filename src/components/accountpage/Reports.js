"use client";
import { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
  Divider,
} from "@mui/material";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";

// ✅ Reusable card for displaying results
const ResultCard = ({ title, data }) => (
  <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2 }}>
    {Object.entries(data).map(([key, value]) => (
      <Typography key={key}>
        <b>{title ? title[key] || key : key}:</b>{" "}
        {value instanceof Date ? value.toLocaleString() : value}
      </Typography>
    ))}
  </Box>
);

export default function Reports() {
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  // States
  const [hours, setHours] = useState("");
  const [day, setDay] = useState("");

  const [dailyResults, setDailyResults] = useState([]);
  const [todayEntries, setTodayEntries] = useState(null);
  const [monthlyResults, setMonthlyResults] = useState([]);
  const [activeClients, setActiveClients] = useState(null);

  const [loadingDaily, setLoadingDaily] = useState(false);
  const [loadingMonthly, setLoadingMonthly] = useState(false);

  // ✅ Fetch daily expiry
  const fetchDailyExpiry = async () => {
    if (!userEmail || !hours) return toast.error("Enter valid hours");
    setLoadingDaily(true);
    try {
      const res = await axios.get(
        `/api/dailyclient/planexpire?email=${userEmail}&hours=${hours}`
      );
      if (res.data?.success) {
        setDailyResults(res.data.data);
        toast.success(
          `${res.data.count || res.data.data.length} records found ✅`
        );
      } else {
        setDailyResults([]);
        toast.error(res.data?.message || "No records found ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching daily expiry ❌");
    } finally {
      setLoadingDaily(false);
    }
  };

  // ✅ Fetch today entries
  const fetchTodayEntries = async () => {
    if (!userEmail) return toast.error("⚠️ Email not found");
    try {
      const res = await axios.get(
        `/api/dailyclient/todayentery?email=${encodeURIComponent(userEmail)}`
      );
      setTodayEntries(res.data?.success ? res.data.totalEntries : 0);
      if (!res.data?.success)
        toast.error(res.data?.message || "No entries found ❌");
    } catch (err) {
      console.error(err);
      toast.error("Error fetching today&apos;s entries ❌");
    }
  };

  // ✅ Fetch active monthly clients
  const fetchActiveClients = async () => {
    if (!userEmail) return toast.error("⚠️ Email not found");
    try {
      const res = await axios.get(
        `/api/monthlyclient/activeuser?email=${encodeURIComponent(userEmail)}`
      );
      setActiveClients(res.data?.success ? res.data.activeClients : 0);
      toast[res.data?.success ? "success" : "error"](
        res.data?.success ? `Active plan found ✅` : "No active plan ❌"
      );
    } catch (err) {
      console.error(err);
      toast.error("Error fetching active users ❌");
    }
  };

  // ✅ Fetch monthly expiry
  const fetchMonthlyExpiry = async () => {
    if (!userEmail?.trim() || !day)
      return toast.error("Please enter valid days");
    setLoadingMonthly(true);
    try {
      const res = await axios.get(
        `/api/monthlyclient/planexpire?email=${encodeURIComponent(
          userEmail
        )}&day=${day}`
      );
      if (res.data?.success && Array.isArray(res.data.data)) {
        setMonthlyResults(res.data.data);
        toast.success(`${res.data.data.length} record(s) found ✅`);
      } else {
        setMonthlyResults([]);
        toast.error(res.data?.message || "No records found ❌");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching monthly expiry ❌");
    } finally {
      setLoadingMonthly(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      {/* DAILY SECTION */}
      <Paper sx={{ p: 4, mb: 5, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Daily Mode Reports
        </Typography>

        {/* Input */}
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Hours"
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={fetchDailyExpiry}
            disabled={loadingDaily}
          >
            {loadingDaily ? <CircularProgress size={20} /> : "Search"}
          </Button>
        </Stack>

        {/* Results */}
        {dailyResults.length > 0 ? (
          <Stack spacing={2} mt={2}>
            {dailyResults.map((item) => (
              <ResultCard
                key={item._id}
                data={{
                  Vehicle: item.vehicle,
                  Token: item.token,
                  "In Time": new Date(item.createdAt).toLocaleString(),
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" mt={2}>
            No daily records found
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Button variant="outlined" onClick={fetchTodayEntries}>
          Get Today&apos;s Entries
        </Button>
        {todayEntries !== null && (
          <Typography mt={2} fontWeight="bold">
            Today Total Entries: {todayEntries}
          </Typography>
        )}
      </Paper>

      {/* MONTHLY SECTION */}
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Subscription Mode Reports
        </Typography>

        {/* Input */}
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Days"
            type="number"
            value={day}
            onChange={(e) => setDay(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={fetchMonthlyExpiry}
            disabled={loadingMonthly}
          >
            {loadingMonthly ? <CircularProgress size={20} /> : "Search"}
          </Button>
        </Stack>

        {/* Results */}
        {monthlyResults.length > 0 ? (
          <Stack spacing={2} mt={2}>
            {monthlyResults.map((item) => (
              <ResultCard
                key={item._id}
                data={{
                  Vehicle: item.vehicle,
                  Phone: item.phone,
                  "Plan Expire": new Date(item.planExpire).toLocaleDateString(),
                }}
              />
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" mt={2}>
            No subscription records found
          </Typography>
        )}

        <Divider sx={{ my: 3 }} />

        <Button variant="outlined" onClick={fetchActiveClients}>
          Get Active Clients
        </Button>
        {activeClients !== null && (
          <Typography mt={2} fontWeight="bold">
            Total Active Clients: {activeClients}
          </Typography>
        )}
      </Paper>
    </Container>
  );
}
