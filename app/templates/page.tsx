import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import TemplateList from "./TemplateList";
import { MessageCircle, Sparkles, FileText } from "lucide-react";

export default async function TemplatesPage() {
  const { workspace, user } = await getCurrentWorkspace();

  if (!user) redirect("/login");
  if (!workspace) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();

  const { data: templates } = await supabase
    .from("whatsapp_templates")
    .select("id, title, body, category, created_at")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false });

  return (
    <AppShell workspaceName={workspace.name}>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                  <Sparkles size={14} />
                  {workspace.name}
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  WhatsApp Templates
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Save reusable messages for payment reminders, delivery
                  updates, customer follow-ups, and promotions.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                  <MessageCircle size={18} />
                </div>
                <p className="text-xs text-slate-300">Saved templates</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {templates?.length || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-[#f7f8f4] px-6 py-4">
            <p className="text-sm text-slate-600">
              Use variables like {"{{name}}"} and {"{{amount}}"} inside your
              message.
            </p>
          </div>
        </section>

        <TemplateList initialTemplates={templates || []} />
      </div>
    </AppShell>
  );
}