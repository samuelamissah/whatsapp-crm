import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CustomerList from "./CustomerList";

export default async function CustomersPage() {
  const { workspace, user, error } = await getCurrentWorkspace();

  if (!user) {
    redirect("/login");
  }

  if (!workspace) {
    redirect("/onboarding");
  }

  const supabase = await createSupabaseServerClient();
  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, phone")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <AppShell>
      <CustomerList initialCustomers={customers || []} />
    </AppShell>
  );
}