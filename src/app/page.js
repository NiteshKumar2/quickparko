import ParkingBanner from "@/components/frontpage/Banner";
import ParkingProcess from "@/components/frontpage/Procees";

export default function Home() {
  return (
    <div
      style={{
        margin: -20,
      }}
    >
      <ParkingBanner />
      <ParkingProcess />
    </div>
  );
}
