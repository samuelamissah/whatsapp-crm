"use client";

import { useState } from "react";
import { Plus, Search, MessageCircle, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */


type Customer = {
  id: string;
  name: string;
  phone: string;
};


export default function CustomerList({ initialCustomers }: { initialCustomers: Customer[] }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const filteredCustomers = initialCustomers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  async function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add customer");
      }

      setIsModalOpen(false);
      setName("");
      setPhone("");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Customers</h1>
          <p className="mt-1 text-slate-500">Your structured WhatsApp customer memory.</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-green-700 sm:w-auto"
        >
          <Plus size={17} /> Add Customer
        </button>
      </div>

      <div className="mb-5 flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
        <Search size={18} className="text-slate-400" />
        <input
          placeholder="Search customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
        />
      </div>

      <div className="rounded-2xl border bg-white shadow-sm">
        {filteredCustomers.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No customers found.</div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer.id} className="flex flex-col gap-4 border-b p-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{customer.name}</h3>
                <p className="text-sm text-slate-500">{customer.phone}</p>
              </div>

              <a
                rel="noopener"
                href={`https://wa.me/${customer.phone.replace(/[^0-9]/g, "")}?text=Hi,%20your%20order%20is%20ready`}
                target="_blank"
                className="flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors hover:bg-slate-50 hover:text-green-600 sm:w-auto"
              >
                <MessageCircle size={16} /> WhatsApp
              </a>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Customer</h2>
              <button
                type="button"
                title="dlm"
                onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Kofi Asare"
                  className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">WhatsApp Number</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  placeholder="233241234567"
                  className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}