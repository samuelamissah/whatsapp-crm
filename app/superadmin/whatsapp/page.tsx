import { redirect } from "next/navigation";
import SuperAdminShell from "@/components/SuperAdminShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import WhatsAppSettingsForm from "./WhatsappSettingsForm";
import { MessageCircle, ShieldCheck } from "lucide-react";

export default async function WhatsAppPage() {
  const { workspace, user } = await getCurrentWorkspace();

  if (!user) redirect("/login");
  if (!workspace) redirect("/onboarding");

  const supabase = await createSupabaseServerClient();

  const { data: settings } = await supabase
    .from("whatsapp_settings")
    .select(
      "phone_number_id, business_account_id, webhook_verify_token, is_connected"
    )
    .eq("workspace_id", workspace.id)
    .maybeSingle();

  return (
    <SuperAdminShell userEmail={user.email}>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                  <MessageCircle size={14} />
                  WhatsApp connection
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  WhatsApp API Setup
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Start with free smart links now. Later, connect the official
                  WhatsApp Cloud API for webhooks and automated messaging.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-emerald-200">
                  <ShieldCheck size={18} />
                </div>
                <p className="text-xs text-slate-300">Status</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {settings?.is_connected ? "Connected" : "Not connected"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-[#f7f8f4] px-6 py-4">
            <p className="text-sm text-slate-600">
              Free mode uses WhatsApp links. Cloud API mode requires Meta
              developer credentials.
            </p>
          </div>
        </section>

        <WhatsAppSettingsForm settings={settings} />
      </div>
    </SuperAdminShell>
  );
}