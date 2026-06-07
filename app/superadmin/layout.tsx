import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

// Simple middleware-like layout to protect superadmin routes
export default async function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Set your superadmin email here or via environment variables
  const superadminEmail = process.env.SUPERADMIN_EMAIL || "superadmin@crm.com";

  if (user.email !== superadminEmail) {
    // If a normal user tries to access this URL, kick them back to their dashboard
    redirect("/dashboard");
  }

  return <>{children}</>;
}