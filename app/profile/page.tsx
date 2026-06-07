import { redirect } from "next/navigation";
import AppShell from "@/components/AppShell";
import { getCurrentWorkspace } from "@/lib/workspace";
import {
  UserCircle,
  Mail,
  Building2,
  Crown,
  ShieldCheck,
  Store,
  BadgeCheck,
} from "lucide-react";

export default async function ProfilePage() {
  const { workspace, user, role } = await getCurrentWorkspace();

  if (!user) redirect("/login");
  if (!workspace) redirect("/onboarding");

  const initials = getInitials(user.email || "Seller");
  const roleLabel = role || "member";

  return (
    <AppShell workspaceName={workspace.name}>
      <div className="space-y-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-950 p-6 text-white">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-semibold text-emerald-100">
                  <ShieldCheck size={14} />
                  Secure account
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Profile
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  View your account details and the business workspace connected
                  to your WhatsApp selling dashboard.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-xs text-slate-300">Active workspace</p>
                <p className="mt-1 text-xl font-bold text-white">
                  {workspace.name}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 bg-[#f7f8f4] px-6 py-4">
            <p className="text-sm text-slate-600">
              Your workspace controls which customers and orders you can access.
            </p>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] bg-emerald-50 text-2xl font-bold text-emerald-700">
                {initials}
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                Seller Account
              </h2>

              <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                This is the login account connected to your merchant workspace.
              </p>

              <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 text-sm font-bold capitalize text-emerald-700">
                <BadgeCheck size={16} />
                {roleLabel}
              </div>
            </div>

            <div className="mt-6 rounded-3xl bg-[#fafbf7] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Account email
              </p>
              <div className="mt-3 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900">
                <Mail size={17} className="text-slate-400" />
                <span className="min-w-0 truncate">{user.email}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <InfoCard
              icon={Store}
              title="Business workspace"
              subtitle="The shop account you are currently managing."
              rows={[
                {
                  label: "Business name",
                  value: workspace.name,
                },
              ]}
            />

            <div className="grid gap-6 md:grid-cols-2">
              <SmallCard
            
                title="Your role"
                value={roleLabel}
              />

              <SmallCard
        
                title="Current plan"
                value={workspace.plan || "free"}
              
              />
            </div>

            
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function InfoCard({
  icon: Icon,
  title,
  subtitle,
  rows,
}: {
  icon: typeof Store;
  title: string;
  subtitle: string;
  rows: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon size={22} />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>

      <div className="grid gap-4">
        {rows.map((row) => (
          <div
            key={row.label}
            className="rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3"
          >
            <p className="text-xs font-medium text-slate-500">{row.label}</p>
            <p className="mt-1 break-words font-bold text-slate-950">
              {row.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SmallCard({
  title,
  value,
}: {
  title: string;
  value: string;

}) {
 

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
     

      <p className="text-sm font-medium text-slate-500">{title}</p>
      <h3 className="mt-1 text-2xl font-bold capitalize text-slate-950">
        {value}
      </h3>
    </div>
  );
}

function getInitials(value: string) {
  const name = value.split("@")[0] || value;
  const parts = name.split(/[._-\s]+/).filter(Boolean);

  if (parts.length === 0) return "U";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}