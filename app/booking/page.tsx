import { BookingBody } from "@/components/booking/BookingBody";
import { getServices } from "@/lib/services";

export const metadata = {
  title: "Book an Appointment",
  description:
    "Book a GBOKS AUTOS visit in Ikeja, Lagos: pick a service, date and time window, get an instant reference number. Pay on pickup.",
};

// Step 4: ?service=slug preselects the service from catalogue cards.
export default async function BookingPage({
  searchParams,
}: {
  searchParams?: { service?: string };
}) {
  const { services } = await getServices();
  return <BookingBody services={services} preselected={searchParams?.service} />;
}
