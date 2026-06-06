import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import StatCard from "@/components/StatCard";
import { Users, Clock, CheckCircle2, Banknote } from "lucide-react";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const { workspace, user, error } = await getCurrentWorkspace();

  if (!user) {
    redirect("/login");
  }

  if (!workspace) {
    redirect("/onboarding");
  }

  const supabase = await createSupabaseServerClient();

  const [{ count: customersCount }, { data: orders }] = await Promise.all([
    supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id),
    supabase
      .from("orders")
      .select("status, amount")
      .eq("workspace_id", workspace.id),
  ]);

  const pendingOrdersCount = orders?.filter((o) => o.status === "pending").length || 0;
  const paidOrdersCount = orders?.filter((o) => o.status === "paid").length || 0;
  
  // Calculate revenue from paid and delivered orders
  const revenue = orders
    ?.filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, order) => sum + (Number(order.amount) || 0), 0) || 0;

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="mt-1 text-slate-500">
          Track customers, orders and WhatsApp follow-ups for {workspace.name}.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Customers" value={String(customersCount || 0)} icon={Users} />
        <StatCard title="Pending Orders" value={String(pendingOrdersCount)} icon={Clock} />
        <StatCard title="Paid Orders" value={String(paidOrdersCount)} icon={CheckCircle2} />
        <StatCard title="Revenue" value={`GHS ${revenue.toLocaleString()}`} icon={Banknote} />
      </div>

      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Today&apos;s Workflow</h2>
        <p className="mt-2 text-sm text-slate-500">
          Add customers, create orders, and continue conversations on WhatsApp.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/customers" className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700">
            Add Customer
          </Link>
          <Link href="/orders" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800">
            Add Order
          </Link>
        </div>
      </div>
    </AppShell>
  );
}