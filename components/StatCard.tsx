import { LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100">
        <Icon size={20} />
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className="mt-1 text-2xl font-bold text-slate-900">{value}</h2>
    </div>
  );
}