import { AdminBody } from "@/components/admin/AdminBody";

export const metadata = { title: "Admin Dashboard", robots: { index: false, follow: false } };

// Step 9: role-gated staff dashboard. The gate runs client-side against
// Supabase Auth + profiles; lock down tables with RLS for production.
export default function AdminPage() {
  return <AdminBody />;
}
