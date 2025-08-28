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
import dayjs from "dayjs";

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

  const vehicle = data.vehicleDetails;

  // ✅ consistent date formatting (no hydration issues)
  const formatDate = (date) => {
    if (!date) return "Not Available";
    try {
      return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
      // Example: 2025-09-04 05:30:00
    } catch {
      return date;
    }
  };

  // ✅ Detect whether it's Daily or Monthly
  const isMonthly = !!vehicle.planExpire;

  // ✅ For monthly -> get last in/out time
  let lastInTime = null;
  let lastOutTime = null;
  if (isMonthly && Array.isArray(vehicle.timing) && vehicle.timing.length > 0) {
    const lastTiming = vehicle.timing[vehicle.timing.length - 1];
    lastInTime = lastTiming.inTime;
    lastOutTime = lastTiming.outTime;
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={600} m={3} align="center">
        Vehicle Details
      </Typography>

      <Card
        sx={{ maxWidth: 600, mx: "auto", p: 2, boxShadow: 3, borderRadius: 3 }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6">🚗 Vehicle Information</Typography>
            <Divider />

            <DetailItem label="Vehicle Number" value={vehicle.vehicle} />
            <DetailItem label="Email" value={vehicle.email} />

            {isMonthly ? (
              <>
                <DetailItem
                  label="Plan Expire"
                  value={formatDate(vehicle.planExpire)}
                />
                <DetailItem
                  label="Last Check-in"
                  value={formatDate(lastInTime)}
                />
                <DetailItem
                  label="Last Check-out"
                  value={formatDate(lastOutTime)}
                />
              </>
            ) : (
              <>
                <DetailItem
                  label="Status"
                  value={vehicle.status || "Unknown"}
                />
                <DetailItem
                  label="Check-in Time"
                  value={formatDate(vehicle.createdAt)}
                />
                <DetailItem
                  label="Check-out Time"
                  value={formatDate(vehicle.updatedAt)}
                />
              </>
            )}
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
