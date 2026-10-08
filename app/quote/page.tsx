import { QuoteBody } from "@/components/quote/QuoteBody";
import { getServices } from "@/lib/services";

export const metadata = {
  title: "Get a Quote",
  description: "Request a free GBOKS AUTOS price estimate. Written range on WhatsApp within one working day.",
};

// Step 8: service list feeds the selector; requests persist when configured.
export default async function QuotePage() {
  const { services } = await getServices();
  return <QuoteBody services={services} />;
}
