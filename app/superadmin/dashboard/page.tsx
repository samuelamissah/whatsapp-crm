import { redirect } from "next/navigation";
import SuperAdminShell from "@/components/SuperAdminShell";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { Settings, Users, MessageCircle } from "lucide-react";
import Link from "next/link";

export default async function SuperAdminDashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <SuperAdminShell userEmail={user.email}>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-indigo-950 p-6 text-white">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-indigo-100">
                  System Administration
                </div>
                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  SuperAdmin Dashboard
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-indigo-200">
                  Manage global system settings, WhatsApp integrations, and overarching platform controls.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/superadmin/whatsapp" className="group rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 transition group-hover:scale-110">
              <MessageCircle size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-950">WhatsApp Integration</h2>
            <p className="mt-2 text-sm text-slate-500">Configure global WhatsApp webhook tokens and provider credentials.</p>
          </Link>
          
          {/* Add more superadmin modules here in the future */}
          <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6 shadow-sm opacity-60">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-600">
              <Users size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-950">User Management</h2>
            <p className="mt-2 text-sm text-slate-500">Coming soon. Manage all users across all workspaces.</p>
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}