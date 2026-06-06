import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import OrderList from "./OrderList";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function OrdersPage() {
  const { workspace, user, error } = await getCurrentWorkspace();

  if (!user) {
    redirect("/login");
  }

  if (!workspace) {
    redirect("/onboarding");
  }

  const supabase = await createSupabaseServerClient();
  
  const [{ data: orders }, { data: customers }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, item, amount, status, customer_id, customers(name)")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("customers")
      .select("id, name")
      .eq("workspace_id", workspace.id)
      .order("name", { ascending: true }),
  ]);

  return (
    <AppShell>
      <OrderList initialOrders={orders as any || []} customers={customers || []} />
    </AppShell>
  );
}