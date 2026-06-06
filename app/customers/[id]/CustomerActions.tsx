"use client";

import { useState } from "react";
import { Banknote, Bell, Loader2, Plus, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CustomerActions({ customerId }: { customerId: string }) {
  const router = useRouter();

  const [activeModal, setActiveModal] = useState<"debt" | "followup" | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [debtDescription, setDebtDescription] = useState("");
  const [debtAmount, setDebtAmount] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [dueDate, setDueDate] = useState("");

  const [followTitle, setFollowTitle] = useState("");
  const [followNote, setFollowNote] = useState("");
  const [remindAt, setRemindAt] = useState("");

  async function handleAddDebt(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/debts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          description: debtDescription,
          amount: Number(debtAmount),
          amountPaid: Number(amountPaid || 0),
          dueDate: dueDate || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add debt");
      }

      setDebtDescription("");
      setDebtAmount("");
      setAmountPaid("");
      setDueDate("");
      setActiveModal(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddFollowUp(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/follow-ups", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          title: followTitle,
          note: followNote,
          remindAt,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add follow-up");
      }

      setFollowTitle("");
      setFollowNote("");
      setRemindAt("");
      setActiveModal(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-950">Quick actions</h2>
        <p className="mt-1 text-sm text-slate-500">
          Record debts and create follow-up reminders for this customer.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => {
              setError("");
              setActiveModal("debt");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700 hover:bg-red-100"
          >
            <Banknote size={17} />
            Add Debt
          </button>

          <button
            onClick={() => {
              setError("");
              setActiveModal("followup");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700 hover:bg-emerald-100"
          >
            <Bell size={17} />
            Add Follow-up
          </button>
        </div>
      </div>

      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  {activeModal === "debt" ? "Add Debt" : "Add Follow-up"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {activeModal === "debt"
                    ? "Track money this customer still owes."
                    : "Create a reminder to contact this customer later."}
                </p>
              </div>

              <button
                title="Close modal"
                type="button"
                onClick={() => setActiveModal(null)}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={19} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {activeModal === "debt" ? (
              <form onSubmit={handleAddDebt} className="space-y-4">
                <Input
                  label="Description"
                  value={debtDescription}
                  onChange={setDebtDescription}
                  placeholder="Dress balance"
                />

                <Input
                  label="Total amount (GHS)"
                  value={debtAmount}
                  onChange={setDebtAmount}
                  placeholder="300"
                  type="number"
                />

                <Input
                  label="Amount paid (GHS)"
                  value={amountPaid}
                  onChange={setAmountPaid}
                  placeholder="100"
                  type="number"
                />

                <Input
                  label="Due date"
                  value={dueDate}
                  onChange={setDueDate}
                  type="date"
                />

                <SubmitButton loading={loading} label="Save debt" />
              </form>
            ) : (
              <form onSubmit={handleAddFollowUp} className="space-y-4">
                <Input
                  label="Title"
                  value={followTitle}
                  onChange={setFollowTitle}
                  placeholder="Follow up payment"
                />

                <TextArea
                  label="Note"
                  value={followNote}
                  onChange={setFollowNote}
                  placeholder="Remind customer about balance..."
                />

                <Input
                  label="Reminder date and time"
                  value={remindAt}
                  onChange={setRemindAt}
                  type="datetime-local"
                />

                <SubmitButton loading={loading} label="Save follow-up" />
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={label !== "Amount paid (GHS)" && label !== "Due date"}
        placeholder={placeholder}
        type={type}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
      />
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
      />
    </div>
  );
}

function SubmitButton({
  loading,
  label,
}: {
  loading: boolean;
  label: string;
}) {
  return (
    <button
      disabled={loading}
      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-3 text-sm font-bold text-white hover:bg-[#0b6230] disabled:opacity-60"
    >
      {loading ? <Loader2 size={17} className="animate-spin" /> : <Plus size={17} />}
      {loading ? "Saving..." : label}
    </button>
  );
}
