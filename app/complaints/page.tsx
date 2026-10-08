import { FeedbackBody } from "@/components/feedback/FeedbackBody";
import { getReviews } from "@/lib/feedback";

export const metadata = {
  title: "Complaints & Feedback",
  description: "File a GBOKS AUTOS complaint with a ticket number, track the reply, or leave a review.",
};

// Step 5: server supplies approved reviews, island handles forms + lookup.
export default async function ComplaintsPage() {
  const { reviews } = await getReviews();
  return <FeedbackBody initialReviews={reviews} />;
}
