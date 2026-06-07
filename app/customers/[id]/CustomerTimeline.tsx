import {
  Banknote,
  Bell,
  CalendarDays,
  ShoppingBag,
  UserRound,
} from "lucide-react";

type TimelineItem = {
  id: string;
  type: string;
  title: string;
  description?: string | null;
  created_at: string;
};

export default function CustomerTimeline({
  items,
}: {
  items: TimelineItem[];
}) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-950">
          Customer timeline
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          A simple history of what happened with this customer.
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-slate-500">No timeline activity yet.</p>
      ) : (
        <div className="space-y-5">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <TimelineIcon type={item.type} />
              </div>

              <div className="min-w-0 flex-1 border-b border-slate-100 pb-5">
                <p className="font-bold text-slate-950">{item.title}</p>

                {item.description && (
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {item.description}
                  </p>
                )}

                <p className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <CalendarDays size={14} />
                  {formatDateTime(item.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function TimelineIcon({ type }: { type: string }) {
  if (type.includes("debt")) return <Banknote size={18} />;
  if (type.includes("follow")) return <Bell size={18} />;
  if (type.includes("order")) return <ShoppingBag size={18} />;
  return <UserRound size={18} />;
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