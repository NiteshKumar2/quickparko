// app/vehicledetails/page.js
import { Suspense } from "react";
import VehicleDetails from "./VehicleDetails";

export default function VehicleDetailsPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: "center", marginTop: 40 }}>⏳ Loading vehicle details...</div>}>
      <VehicleDetails />
    </Suspense>
  );
}
