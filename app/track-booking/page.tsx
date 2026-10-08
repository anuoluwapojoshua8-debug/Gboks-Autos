import { TrackBody } from "@/components/booking/TrackBody";
import { getServices } from "@/lib/services";

export const metadata = {
  title: "Track Booking",
  description: "Track, reschedule or cancel a GBOKS AUTOS booking with your reference number.",
};

// Step 4: ?ref=GBK-XXXXXX deep-links from the booking confirmation.
export default async function TrackBookingPage({
  searchParams,
}: {
  searchParams?: { ref?: string };
}) {
  const { services } = await getServices();
  return <TrackBody services={services} initialRef={searchParams?.ref} />;
}
