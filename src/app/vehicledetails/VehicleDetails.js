"use client";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Divider,
  Stack,
} from "@mui/material";

export default function VehicleDetails() {
  const searchParams = useSearchParams();
  const dataParam = searchParams.get("data");
  const data = dataParam ? JSON.parse(decodeURIComponent(dataParam)) : null;

  if (!data) {
    return (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="error">
          🚫 No vehicle data found
        </Typography>
      </Box>
    );
  }

  // ✅ format dates nicely
  const formatDate = (date) => {
    if (!date) return "Not Available";
    try {
      return new Date(date).toLocaleString();
    } catch {
      return date;
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={600} mb={3} align="center">
        Vehicle Details
      </Typography>

      <Card
        sx={{ maxWidth: 600, mx: "auto", p: 2, boxShadow: 3, borderRadius: 3 }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">🚗 Vehicle Information</Typography>
            <Divider />

            <DetailItem
              label="Vehicle Number"
              value={data.vehicleDetails?.vehicle}
            />
            <DetailItem label="Email" value={data.vehicleDetails?.email} />
            <DetailItem
              label="Status"
              value={data.vehicleDetails?.status || "Unknown"}
            />
            <DetailItem
              label="Check-in Time"
              value={formatDate(data.vehicleDetails?.createdAt)}
            />
            <DetailItem
              label="Check-out Time"
              value={formatDate(data.vehicleDetails?.updatedAt)}
            />
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function DetailItem({ label, value }) {
  return (
    <Box>
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="body1" fontWeight={500}>
        {value || "—"}
      </Typography>
    </Box>
  );
}
