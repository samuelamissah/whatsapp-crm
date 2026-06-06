"use client";

import { useState } from "react";
import { Plus, PackageCheck, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
/* eslint-disable @typescript-eslint/no-explicit-any */

type Customer = { id: string; name: string };
type Order = {
  id: string;
  item: string;
  amount: number;
  status: string;
  customer_id: string;
  customers: { name: string };
};

export default function OrderList({
  initialOrders,
  customers,
}: {
  initialOrders: Order[];
  customers: Customer[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customerId, setCustomerId] = useState("");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleAddOrder(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId, item, amount: Number(amount), status }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add order");
      }

      setIsModalOpen(false);
      setCustomerId("");
      setItem("");
      setAmount("");
      setStatus("pending");
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
          <h1 className="text-3xl font-bold text-slate-900">Orders</h1>
          <p className="mt-1 text-slate-500">Track pending, paid and delivered orders.</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800 sm:w-auto"
        >
          <Plus size={17} /> Add Order
        </button>
      </div>

      <div className="rounded-2xl border bg-white shadow-sm">
        {initialOrders.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">No orders found.</div>
        ) : (
          initialOrders.map((order) => (
            <div key={order.id} className="grid gap-4 border-b p-5 last:border-b-0 md:grid-cols-4">
              <div>
                <p className="text-sm text-slate-500">Customer</p>
                <h3 className="font-semibold">{order.customers?.name || "Unknown"}</h3>
              </div>

              <div>
                <p className="text-sm text-slate-500">Item</p>
                <h3 className="font-semibold">{order.item}</h3>
              </div>

              <div>
                <p className="text-sm text-slate-500">Price</p>
                <h3 className="font-semibold">GHS {order.amount}</h3>
              </div>

              <div className="flex items-center gap-2">
                <PackageCheck size={17} />
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                  order.status === "pending" ? "bg-amber-100 text-amber-700" :
                  order.status === "paid" ? "bg-blue-100 text-blue-700" :
                  order.status === "delivered" ? "bg-green-100 text-green-700" :
                  "bg-slate-100 text-slate-700"
                }`}>
                  {order.status}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Order</h2>
              <button
                type="button"
                title="Close"
                onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleAddOrder} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700">Customer</label>
                <select
                  title="Select customer"
                  required
                  value={customerId}
                  onChange={(e) => setCustomerId(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="" disabled>Select a customer</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Item</label>
                <input
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  required
                  placeholder="e.g. Shoes"
                  className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Amount (GHS)</label>
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  placeholder="250.00"
                  className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">Status</label>
                <select
                  title="Select status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="delivered">Delivered</option>
                </select>
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
                  disabled={loading || customers.length === 0}
                  className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-slate-800 disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}