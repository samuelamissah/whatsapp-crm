import Link from "next/link";
import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import {
  Users,
  Clock,
  CheckCircle2,
  Banknote,
  MessageCircle,
  ArrowRight,
  ShoppingBag,
  Plus,
  AlertCircle,
} from "lucide-react";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const { workspace, user } = await getCurrentWorkspace();

  if (!user) redirect("/login");

  const superadminEmail = process.env.SUPERADMIN_EMAIL || "superadmin@crm.com";
  if (user.email === superadminEmail) {
    redirect("/superadmin/dashboard");
  }

  if (!workspace) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();

  const [{ count: customersCount }, { data: orders }] = await Promise.all([
    supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .eq("workspace_id", workspace.id),

    supabase
      .from("orders")
      .select("status, amount, created_at")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false }),
  ]);

  const pendingOrdersCount =
    orders?.filter((order) => order.status === "pending").length || 0;

  const paidOrdersCount =
    orders?.filter((order) => order.status === "paid").length || 0;

  const deliveredOrdersCount =
    orders?.filter((order) => order.status === "delivered").length || 0;

  const revenue =
    orders
      ?.filter(
        (order) => order.status === "paid" || order.status === "delivered"
      )
      .reduce((sum, order) => sum + (Number(order.amount) || 0), 0) || 0;

  const totalOrders = orders?.length || 0;

  return (
    <AppShell workspaceName={workspace.name}>
      <div className="space-y-7">
        <section className="rounded-[2rem] border border-slate-200 bg-[#f7f8f4] p-6 transition-shadow hover:shadow-md">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-sm font-semibold text-emerald-700">
                {workspace.name}
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Good to see you back.
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                A simple view of your customers, orders, payments, and the
                follow-ups that need attention.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/customers"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-[#0b6230] hover:shadow-md hover:shadow-[#0f7a3b]/20 active:scale-95"
              >
                <Plus size={17} />
                Customer
              </Link>

              <Link
                href="/orders"
                className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-slate-800 hover:shadow-md active:scale-95"
              >
                <Plus size={17} />
                Order
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            icon={Users}
            title="Customers"
            value={String(customersCount || 0)}
            note="People saved in your shop"
            href="/customers"
          />

          <DashboardCard
            icon={Clock}
            title="Pending"
            value={String(pendingOrdersCount)}
            note={
              pendingOrdersCount > 0
                ? "Need payment follow-up"
                : "No pending payments"
            }
            href="/orders"
            attention={pendingOrdersCount > 0}
          />

          <DashboardCard
            icon={CheckCircle2}
            title="Completed"
            value={String(paidOrdersCount + deliveredOrdersCount)}
            note="Paid or delivered orders"
            href="/orders"
          />

          <DashboardCard
            icon={Banknote}
            title="Revenue"
            value={`GHS ${revenue.toLocaleString()}`}
            note="From paid and delivered orders"
            href="/orders"
          />
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  What needs attention?
                </h2>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Start with the simple things that keep sales moving.
                </p>
              </div>

              {pendingOrdersCount > 0 && (
                <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                  {pendingOrdersCount} pending
                </span>
              )}
            </div>

            <div className="space-y-3">
              <ActionCard
                icon={Users}
                title="Add a customer after every chat"
                text="Save their name and WhatsApp number before the conversation disappears in your inbox."
                href="/customers"
                buttonText="Open customers"
              />

              <ActionCard
                icon={ShoppingBag}
                title="Record each order immediately"
                text="Capture the item, amount, and status so you always know what is happening."
                href="/orders"
                buttonText="Open orders"
              />

              <ActionCard
                icon={AlertCircle}
                title={
                  pendingOrdersCount > 0
                    ? "Follow up pending payments"
                    : "No urgent payment follow-up"
                }
                text={
                  pendingOrdersCount > 0
                    ? `${pendingOrdersCount} order(s) are still waiting for payment.`
                    : "You are clear for now. New pending orders will show here."
                }
                href="/orders"
                buttonText="Check orders"
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <MessageCircle size={22} />
            </div>

            <h2 className="text-lg font-bold">
              WhatsApp is still where you talk.
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-300">
              This dashboard is where you remember what happened. Customers,
              orders, payment status, and follow-ups stay organized here.
            </p>

            <div className="mt-6 rounded-2xl bg-white/10 p-4">
              <p className="text-sm font-semibold text-white">Today summary</p>

              <div className="mt-4 space-y-3 text-sm">
                <SummaryRow label="Total orders" value={String(totalOrders)} />
                <SummaryRow
                  label="Pending payment"
                  value={String(pendingOrdersCount)}
                />
                <SummaryRow
                  label="Completed"
                  value={String(paidOrdersCount + deliveredOrdersCount)}
                />
              </div>
            </div>

            <Link
              href="/customers"
              className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-slate-100"
            >
              Open customer list
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function DashboardCard({
  icon: Icon,
  title,
  value,
  note,
  href,
  attention = false,
}: {
  icon: typeof Users;
  title: string;
  value: string;
  note: string;
  href: string;
  attention?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group rounded-[1.5rem] border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${
        attention ? "border-amber-200" : "border-slate-200"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${
            attention
              ? "bg-amber-50 text-amber-700"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          <Icon size={21} />
        </div>

        <ArrowRight
          size={17}
          className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-700"
        />
      </div>

      <p className="mt-5 text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
        {value}
      </h3>
      <p className="mt-2 text-sm leading-5 text-slate-500">{note}</p>
    </Link>
  );
}

function ActionCard({
  icon: Icon,
  title,
  text,
  href,
  buttonText,
}: {
  icon: typeof Users;
  title: string;
  text: string;
  href: string;
  buttonText: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-[#fafbf7] p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700">
            <Icon size={21} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-950">{title}</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">{text}</p>
          </div>
        </div>

        <Link
          href={href}
          className="shrink-0 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-center text-sm font-bold text-slate-800 hover:bg-slate-50"
        >
          {buttonText}
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <span className="text-slate-300">{label}</span>
      <span className="font-bold text-white">{value}</span>
    </div>
  );
}