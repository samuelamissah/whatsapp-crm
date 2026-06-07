import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import AnalyticsClient from "./AnalyticsClient";
import {
  Banknote,
  BarChart3,
  Clock,
  PackageCheck,
  ShoppingBag,
  Sparkles,
  Users,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */

export default async function AnalyticsPage() {
  const { workspace, user } = await getCurrentWorkspace();

  if (!user) redirect("/login");
  if (!workspace) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();

  const [{ data: orders }, { data: customers }, { data: debts }] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id, item, amount, status, customer_id, created_at, customers(name)")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("customers")
        .select("id, name, phone, created_at, loyalty_status")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: true }),

      supabase
        .from("customer_debts")
        .select("id, customer_id, amount, amount_paid, status, created_at")
        .eq("workspace_id", workspace.id),
    ]);

  const safeOrders = (orders as any[]) || [];
  const safeCustomers = customers || [];
  const safeDebts = debts || [];

  const totalRevenue = safeOrders
    .filter((order) => order.status === "paid" || order.status === "delivered")
    .reduce((sum, order) => sum + Number(order.amount || 0), 0);

  const pendingRevenue = safeOrders
    .filter((order) => order.status === "pending")
    .reduce((sum, order) => sum + Number(order.amount || 0), 0);

  const totalDebt = safeOrders
    .filter((order) => order.status === "pending")
    .reduce((sum, order) => sum + Number(order.amount || 0), 0);

  const paidOrders = safeOrders.filter(
    (order) => order.status === "paid" || order.status === "delivered"
  );

  const pendingOrders = safeOrders.filter((order) => order.status === "pending");

  return (
    <AppShell workspaceName={workspace.name}>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                
                  {workspace.name}
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Sales Analytics
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Understand revenue, orders, customers, debts, and sales
                  performance across your WhatsApp business.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[520px]">
                <HeaderStat
                  icon={Banknote}
                  label="Revenue"
                  value={`GHS ${totalRevenue.toLocaleString()}`}
                />
                <HeaderStat
                  icon={Clock}
                  label="Pending"
                  value={`GHS ${pendingRevenue.toLocaleString()}`}
                />
                <HeaderStat
                  icon={ShoppingBag}
                  label="Orders"
                  value={String(safeOrders.length)}
                />
                <HeaderStat
                  icon={Users}
                  label="Customers"
                  value={String(safeCustomers.length)}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-[#f7f8f4] px-6 py-4">
            <p className="text-sm text-slate-600">
              Tip: use this page weekly to see your best customers, best
              products, pending payments, and revenue trend.
            </p>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            icon={Banknote}
            label="Total revenue"
            value={`GHS ${totalRevenue.toLocaleString()}`}
            note="Paid and delivered orders"
          />
          <MetricCard
            icon={Clock}
            label="Pending revenue"
            value={`GHS ${pendingRevenue.toLocaleString()}`}
            note={`${pendingOrders.length} pending order(s)`}
            danger={pendingRevenue > 0}
          />
          <MetricCard
            icon={PackageCheck}
            label="Completed sales"
            value={String(paidOrders.length)}
            note="Paid or delivered"
          />
          <MetricCard
            icon={BarChart3}
            label="Outstanding debt"
            value={`GHS ${totalDebt.toLocaleString()}`}
            note="Customer balances"
            danger={totalDebt > 0}
          />
        </div>

        <AnalyticsClient
          orders={safeOrders}
          customers={safeCustomers}
          debts={safeDebts}
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
  icon: typeof Banknote;
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

function MetricCard({
  icon: Icon,
  label,
  value,
  note,
  danger = false,
}: {
  icon: typeof Banknote;
  label: string;
  value: string;
  note: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm">
      <div
        className={`mb-5 flex h-11 w-11 items-center justify-center rounded-2xl ${
          danger ? "bg-amber-50 text-amber-700" : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <Icon size={21} />
      </div>

      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </h3>
      <p className="mt-2 text-sm leading-5 text-slate-500">{note}</p>
    </div>
  );
}