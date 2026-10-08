import { AboutBody } from "@/components/about/AboutBody";
import { getTeam } from "@/lib/team";

export const metadata = {
  title: "About Us",
  description:
    "The GBOKS AUTOS story: mission, vision, values, our CEO, technicians and 11+ years servicing cars in Lagos, Nigeria.",
};

// Roster reads live from team_members with demo fallback.
export default async function AboutPage() {
  const team = await getTeam();
  return <AboutBody team={team} />;
}
