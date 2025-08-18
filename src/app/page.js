import ParkingBanner from "@/components/frontpage/Banner";
import ParkingProcess from "@/components/frontpage/Procees";
import Testimonials from "@/components/frontpage/Testimonial";

export default function Home() {
  return (
    <div
      style={{
        margin: -20,
      }}
    >
      <ParkingBanner />
      <ParkingProcess />
      <Testimonials/>
    </div>
  );
}
