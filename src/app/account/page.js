import ContactPage from "@/components/accountpage/contactus";
import InOutButtons from "@/components/accountpage/inout";
import Reports from "@/components/accountpage/Reports";

export default function Account() {
  return (
    <div
      style={{
        margin: -20,
      }}
    >
      <InOutButtons />
      <Reports />
      <ContactPage />
    </div>
  );
}
