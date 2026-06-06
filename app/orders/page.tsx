import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import OrderList from "./OrderList";
import {
  Banknote,
  Clock,
  PackageCheck,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function OrdersPage() {
  const { workspace, user } = await getCurrentWorkspace();

  if (!user) redirect("/login");
  if (!workspace) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();

  const [{ data: orders }, { data: customers }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, item, amount, status, customer_id, created_at, customers(name)")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false }),

    supabase
      .from("customers")
      .select("id, name")
      .eq("workspace_id", workspace.id)
      .order("name", { ascending: true }),
  ]);

  const safeOrders = (orders as any[]) || [];
  const totalOrders = safeOrders.length;

  const pendingOrders =
    safeOrders.filter((order) => order.status === "pending").length || 0;

  const completedOrders =
    safeOrders.filter(
      (order) => order.status === "paid" || order.status === "delivered"
    ).length || 0;

  const revenue =
    safeOrders
      .filter((order) => order.status === "paid" || order.status === "delivered")
      .reduce((sum, order) => sum + (Number(order.amount) || 0), 0) || 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                 
                  {workspace.name}
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Orders
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Track what customers ordered, what has been paid, and what is
                  still waiting for follow-up.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[520px]">
                <HeaderStat
                  icon={ShoppingBag}
                  label="Total orders"
                  value={String(totalOrders)}
                />
                <HeaderStat
                  icon={Clock}
                  label="Pending"
                  value={String(pendingOrders)}
                />
                <HeaderStat
                  icon={PackageCheck}
                  label="Completed"
                  value={String(completedOrders)}
                />
                <HeaderStat
                  icon={Banknote}
                  label="Revenue"
                  value={`GHS ${revenue.toLocaleString()}`}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-[#f7f8f4] px-6 py-4">
            <p className="text-sm text-slate-600">
              Tip: record every order immediately, even before payment. That is
              how you avoid forgotten sales.
            </p>
          </div>
        </section>

        <OrderList
          initialOrders={safeOrders as any}
          customers={customers || []}
        />
      </div>
    </AppShell>
  );
}

function HeaderStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
        <Icon size={18} />
      </div>
      <p className="text-xs text-slate-300">{label}</p>
      <p className="mt-1 text-xl font-bold text-white">{value}</p>
    </div>
  );
}