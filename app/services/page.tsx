import { ServicesBody } from "@/components/services/ServicesBody";
import { getServices } from "@/lib/services";

export const metadata = {
  title: "Services & Prices",
  description:
    "GBOKS AUTOS services in Ikeja, Lagos: servicing, diagnostics, brakes, suspension, AC, electrical, tires, oil change and body work with upfront prices.",
};

// Step 3: Supabase-driven catalogue with demo fallback.
// Server component fetches, client island handles search + booking links.
export default async function ServicesPage() {
  const { services, live } = await getServices();
  return <ServicesBody services={services} live={live} />;
}
