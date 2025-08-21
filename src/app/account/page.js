import ContactPage from "@/components/accountpage/contactus";
import InOutButtons from "@/components/accountpage/inout";

export default function Account() {
  return (
    <div
      style={{
        margin: -20,
      }}
    >
      <InOutButtons />
      <ContactPage />
    </div>
  );
}
