import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CustomerProfileEditor from "./CustomerProfileEditor";
import CustomerActions from "./CustomerActions";
import {
  ArrowLeft,
  Banknote,
  Bell,
  CalendarDays,
  MessageCircle,
  NotebookText,
  Phone,
  ShoppingBag,
  Star,
  Tags,
  UserRound,
} from "lucide-react";

export default async function CustomerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { workspace, user } = await getCurrentWorkspace();

  if (!user) redirect("/login");
  if (!workspace) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();

  const [{ data: customer }, { data: orders }, { data: debts }, { data: followUps }] =
    await Promise.all([
      supabase
        .from("customers")
        .select("id, name, phone, notes, tags, loyalty_status, created_at")
        .eq("id", id)
        .eq("workspace_id", workspace.id)
        .single(),

      supabase
        .from("orders")
        .select("id, item, amount, status, created_at")
        .eq("customer_id", id)
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("customer_debts")
        .select("id, description, amount, amount_paid, status, due_date, created_at")
        .eq("customer_id", id)
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false }),

      supabase
        .from("follow_ups")
        .select("id, title, note, remind_at, status, created_at")
        .eq("customer_id", id)
        .eq("workspace_id", workspace.id)
        .order("remind_at", { ascending: true }),
    ]);

  if (!customer) notFound();

  const cleanPhone = customer.phone.replace(/[^0-9]/g, "");

  const totalSpent =
    orders
      ?.filter((order) => order.status === "paid" || order.status === "delivered")
      .reduce((sum, order) => sum + Number(order.amount || 0), 0) || 0;

  const pendingDebt =
    debts
      ?.filter((debt) => debt.status !== "paid" && debt.status !== "cancelled")
      .reduce(
        (sum, debt) =>
          sum + (Number(debt.amount || 0) - Number(debt.amount_paid || 0)),
        0
      ) || 0;

  const pendingFollowUps =
    followUps?.filter((followUp) => followUp.status === "pending").length || 0;

  return (
    <AppShell>
      <div className="space-y-6">
        <Link
          href="/customers"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-[#0f7a3b]"
        >
          <ArrowLeft size={17} />
          Back to customers
        </Link>

        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div className="flex gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.4rem] bg-white/10 text-xl font-bold text-emerald-200">
                  {getInitials(customer.name)}
                </div>

                <div>
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold capitalize text-emerald-100">
                    <Star size={14} />
                    {customer.loyalty_status || "regular"} customer
                  </div>

                  <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                    {customer.name}
                  </h1>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <Phone size={15} />
                    {customer.phone}
                  </p>
                </div>
              </div>

              <a
                href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                  `Hi ${customer.name}, hope you are doing well.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-5 py-3 text-sm font-bold text-white hover:bg-[#0b6230]"
              >
                <MessageCircle size={17} />
                Message on WhatsApp
              </a>
            </div>
          </div>

          <div className="grid gap-4 bg-[#f7f8f4] p-5 md:grid-cols-4">
            <ProfileStat
              icon={ShoppingBag}
              label="Orders"
              value={String(orders?.length || 0)}
            />
            <ProfileStat
              icon={Banknote}
              label="Total spent"
              value={`GHS ${totalSpent.toLocaleString()}`}
            />
            <ProfileStat
              icon={Banknote}
              label="Debt"
              value={`GHS ${pendingDebt.toLocaleString()}`}
              danger={pendingDebt > 0}
            />
            <ProfileStat
              icon={Bell}
              label="Follow-ups"
              value={String(pendingFollowUps)}
              danger={pendingFollowUps > 0}
            />
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <CustomerProfileEditor customer={customer} />
            <CustomerActions customerId={customer.id} />
            <Card
              icon={NotebookText}
              title="Notes"
              subtitle="Things to remember about this customer."
            >
              <p className="text-sm leading-6 text-slate-600">
                {customer.notes || "No notes yet."}
              </p>
            </Card>

            <Card icon={Tags} title="Tags" subtitle="Customer labels.">
              {customer.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {customer.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No tags yet.</p>
              )}
            </Card>

            <Card
              icon={Bell}
              title="Follow-ups"
              subtitle="Reminders linked to this customer."
            >
              {!followUps?.length ? (
                <p className="text-sm text-slate-500">No follow-ups yet.</p>
              ) : (
                <div className="space-y-3">
                  {followUps.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-slate-200 bg-[#fafbf7] p-4"
                    >
                      <p className="font-bold text-slate-950">{item.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {item.note || "No note"}
                      </p>
                      <p className="mt-2 text-xs font-semibold text-slate-400">
                        {formatDateTime(item.remind_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card
              icon={ShoppingBag}
              title="Orders"
              subtitle="Purchase history for this customer."
            >
              {!orders?.length ? (
                <p className="text-sm text-slate-500">No orders yet.</p>
              ) : (
                <div className="space-y-3">
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-[#fafbf7] p-4"
                    >
                      <div>
                        <p className="font-bold text-slate-950">{order.item}</p>
                        <p className="mt-1 text-sm text-slate-500">
                          {formatDate(order.created_at)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-slate-950">
                          GHS {Number(order.amount || 0).toLocaleString()}
                        </p>
                        <StatusBadge status={order.status} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            <Card
              icon={Banknote}
              title="Debt tracking"
              subtitle="Outstanding payments for this customer."
            >
              {!debts?.length ? (
                <p className="text-sm text-slate-500">No debts recorded.</p>
              ) : (
                <div className="space-y-3">
                  {debts.map((debt) => {
                    const balance =
                      Number(debt.amount || 0) - Number(debt.amount_paid || 0);

                    return (
                      <div
                        key={debt.id}
                        className="rounded-2xl border border-slate-200 bg-[#fafbf7] p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-bold text-slate-950">
                              {debt.description}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              Due: {debt.due_date || "No due date"}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-red-600">
                              GHS {balance.toLocaleString()}
                            </p>
                            <p className="mt-1 text-xs capitalize text-slate-500">
                              {debt.status}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function ProfileStat({
  icon: Icon,
  label,
  value,
  danger = false,
}: {
  icon: typeof ShoppingBag;
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div
        className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl ${
          danger ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
        }`}
      >
        <Icon size={18} />
      </div>

      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-bold text-slate-950">{value}</p>
    </div>
  );
}

function Card({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: typeof ShoppingBag;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={21} />
        </div>

        <div>
          <h2 className="font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-amber-50 text-amber-700",
    paid: "bg-blue-50 text-blue-700",
    delivered: "bg-emerald-50 text-emerald-700",
    cancelled: "bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold capitalize ${
        styles[status] || styles.pending
      }`}
    >
      {status}
    </span>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "C";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatDate(date?: string) {
  if (!date) return "Recently";

  return new Intl.DateTimeFormat("en-GH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

function formatDateTime(date?: string) {
  if (!date) return "Recently";

  return new Intl.DateTimeFormat("en-GH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}