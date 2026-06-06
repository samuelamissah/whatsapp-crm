"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  phone: string;
  notes?: string | null;
  tags?: string[];
  loyalty_status?: string;
};

export default function CustomerProfileEditor({
  customer,
}: {
  customer: Customer;
}) {
  const router = useRouter();

  const [name, setName] = useState(customer.name || "");
  const [phone, setPhone] = useState(customer.phone || "");
  const [notes, setNotes] = useState(customer.notes || "");
  const [tagsText, setTagsText] = useState((customer.tags || []).join(", "));
  const [loyaltyStatus, setLoyaltyStatus] = useState(
    customer.loyalty_status || "regular"
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage("");

    const tags = tagsText
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    try {
      const res = await fetch(`/api/customers/${customer.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          notes,
          tags,
          loyalty_status: loyaltyStatus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update customer");
      }

      setMessage("Customer updated successfully.");
      router.refresh();
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-lg font-bold text-slate-950">
          Edit customer profile
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Add useful notes, tags, and loyalty status.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm font-semibold text-slate-700">
          {message}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Customer name
          </label>
          <input
            type="text"
            placeholder="Ama Mensah"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full text-black rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm outline-none focus:border-[#0f7a3b] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            WhatsApp number
          </label>
          <input
            type="text"
            placeholder="05551234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 w-full text-black rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm outline-none focus:border-[#0f7a3b] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Example: Likes red dresses, prefers delivery, pays after 2 days..."
            className="mt-2 w-full text-black resize-none rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm outline-none focus:border-[#0f7a3b] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Tags
          </label>
          <input
            value={tagsText}
            onChange={(e) => setTagsText(e.target.value)}
            placeholder="VIP, Regular, Slow payer"
            className="mt-2 w-full text-black rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm outline-none focus:border-[#0f7a3b] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
          />
          <p className="mt-2 text-xs text-slate-500">
            Separate tags with commas.
          </p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">
            Loyalty status
          </label>
          <select
            id="loyalty-status"
            name="loyalty-status"
            aria-label="Loyalty status"
            value={loyaltyStatus}
            onChange={(e) => setLoyaltyStatus(e.target.value)}
            className="mt-2 w-full rounded-2xl border text-black border-slate-200 bg-[#] px-4 py-3 text-sm outline-none focus:border-[#0f7a3b] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
          >
            <option value="new">New</option>
            <option value="regular">Regular</option>
            <option value="vip">VIP</option>
            <option value="wholesale">Wholesale</option>
            <option value="slow_payer">Slow payer</option>
          </select>
        </div>
      </div>

      <button
        disabled={loading}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-3 text-sm font-bold text-white hover:bg-[#0b6230] disabled:opacity-60"
      >
        {loading ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
        {loading ? "Saving..." : "Save customer profile"}
      </button>
    </form>
  );
}