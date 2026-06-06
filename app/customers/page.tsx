import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import CustomerList from "./CustomerList";
import { MessageCircle, Sparkles, Users } from "lucide-react";

export default async function CustomersPage() {
  const { workspace, user } = await getCurrentWorkspace();

  if (!user) redirect("/login");
  if (!workspace) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();

  const { data: customers } = await supabase
    .from("customers")
    .select("id, name, phone, created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  const totalCustomers = customers?.length || 0;
  const whatsappReady = customers?.filter((c) => c.phone?.trim()).length || 0;

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
                  Customer list
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Keep your buyers organized, searchable, and ready for WhatsApp
                  follow-ups.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:w-[360px]">
                <HeaderStat
                  icon={Users}
                  label="Saved customers"
                  value={String(totalCustomers)}
                />
                <HeaderStat
                  icon={MessageCircle}
                  label="WhatsApp ready"
                  value={String(whatsappReady)}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-[#f7f8f4] px-6 py-4">
            <p className="text-sm text-slate-600">
              Tip: save customers immediately after serious WhatsApp chats so
              you don’t lose them later.
            </p>
          </div>
        </section>

        <CustomerList initialCustomers={customers || []} />
      </div>
    </AppShell>
  );
}

function HeaderStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
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