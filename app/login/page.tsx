import { LoginBody } from "@/components/login/LoginBody";

export const metadata = {
  title: "Customer Login",
  description: "Passwordless sign-in for GBOKS AUTOS customers. Bookings track by reference without an account.",
};

// Step 8: magic-link auth when Supabase is wired, graceful notice otherwise.
export default function LoginPage() {
  return <LoginBody />;
}
