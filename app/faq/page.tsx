import { FaqBody } from "@/components/faq/FaqBody";

export const metadata = {
  title: "FAQ",
  description: "GBOKS AUTOS answers: booking, pricing, parts, hours, warranty and emergency help in Lagos.",
};

// Step 8: static answered questions with search + accordion.
export default function FaqPage() {
  return <FaqBody />;
}
