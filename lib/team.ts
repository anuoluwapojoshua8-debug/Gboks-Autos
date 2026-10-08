import { TEAM } from "./demo-data";
import { supabase } from "./supabase";

export type TeamMember = {
  id?: string;
  name: string;
  role: string;
  detail: string;
  initials: string;
  tint: string;
};

export const TEAM_TINTS = [
  "bg-[#E1F3FE] text-[#1F6C9F]",
  "bg-[#EDF3EC] text-[#346538]",
  "bg-[#FBF3DB] text-[#956400]",
  "bg-[#FDEBEC] text-[#9F2F2D]",
];

// Public read: live roster when configured, demo fallback otherwise.
export async function getTeam(): Promise<TeamMember[]> {
  if (!supabase) return TEAM;
  try {
    const { data, error } = await supabase
      .from("team_members")
      .select("id,name,role,detail,initials,tint")
      .eq("active", true)
      .order("sort_order", { ascending: true });
    if (error || !data || data.length === 0) return TEAM;
    return data as TeamMember[];
  } catch {
    return TEAM;
  }
}
