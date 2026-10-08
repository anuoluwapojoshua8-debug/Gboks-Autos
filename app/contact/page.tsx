import { ContactBody } from "@/components/contact/ContactBody";

export const metadata = {
  title: "Contact Us",
  description: "Visit GBOKS AUTOS at 14 Allen Avenue, Ikeja, Lagos. Call, WhatsApp or send a message.",
};

// Step 7: static info + WhatsApp handoff form. No backend needed.
export default function ContactPage() {
  return <ContactBody />;
}
