"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  PackageCheck,
  X,
  Loader2,
  Search,
  UserRound,
  ShoppingBag,
  Banknote,
  Clock,
  CalendarDays,
  AlertCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

/* eslint-disable @typescript-eslint/no-explicit-any */

type Customer = {
  id: string;
  name: string;
};

type Order = {
  id: string;
  item: string;
  amount: number;
  status: "pending" | "paid" | "delivered" | "cancelled";
  customer_id: string;
  created_at?: string;
  customers?: {
    name: string;
    phone?: string;
  };
};

export default function OrderList({
  initialOrders,
  customers,
}: {
  initialOrders: Order[];
  customers: Customer[];
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [customerId, setCustomerId] = useState("");
  const [item, setItem] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<Order["status"]>("pending");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return initialOrders;

    return initialOrders.filter((order) => {
      const customerName = order.customers?.name || "";

      return (
        customerName.toLowerCase().includes(query) ||
        order.item.toLowerCase().includes(query) ||
        order.status.toLowerCase().includes(query)
      );
    });
  }, [initialOrders, search]);

  async function handleAddOrder(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          item: item.trim(),
          amount: Number(amount),
          status,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add order");
      }

      setIsModalOpen(false);
      setCustomerId("");
      setItem("");
      setAmount("");
      setStatus("pending");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStatus(orderId: string, newStatus: Order["status"]) {
    if (updatingId) return;
    
    setUpdatingId(orderId);
    
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: orderId,
          status: newStatus,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update status");
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Could not update order status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Order records</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, track, and update the sales you create from WhatsApp.
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={customers.length === 0}
            title={
              customers.length === 0
                ? "Add a customer before creating an order"
                : "Add order"
            }
          >
            <Plus size={17} />
            Add Order
          </button>
        </div>

        {customers.length === 0 && (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            Add at least one customer before creating an order.
          </div>
        )}

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 shadow-sm focus-within:border-slate-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-950/10">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search by customer, item or status..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
            Showing {filteredOrders.length} of {initialOrders.length}
          </div>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-slate-50 text-slate-400">
            <PackageCheck size={24} />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No orders yet</h3>
          <p className="mt-1 text-sm text-slate-500">Create your first order to start tracking revenue.</p>
        </div>
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbf7] text-xs uppercase tracking-wide text-slate-500">
                  <th className="w-16 px-6 py-4 font-bold">#</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">Item</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((order, index) => (
                  <OrderTableRow 
                    key={order.id} 
                    order={order} 
                    index={index} 
                    onUpdateStatus={handleUpdateStatus}
                    isUpdating={updatingId === order.id}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredOrders.map((order, index) => (
              <OrderMobileCard 
                key={order.id} 
                order={order} 
                index={index} 
                onUpdateStatus={handleUpdateStatus}
                isUpdating={updatingId === order.id}
              />
            ))}
          </div>
        </>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">Add order</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Record the item, amount, and current payment status.
                </p>
              </div>

              <button
                type="button"
                title="Close"
                onClick={() => setIsModalOpen(false)}
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

            <form onSubmit={handleAddOrder} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Customer
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 focus-within:border-slate-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-950/10">
                  <UserRound size={18} className="text-slate-400" />
                  <select
                    title="Select customer"
                    aria-label="Select customer"
                    required
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  >
                    <option value="" disabled>
                      Select customer
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Item
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 focus-within:border-slate-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-950/10">
                  <ShoppingBag size={18} className="text-slate-400" />
                  <input
                    value={item}
                    onChange={(e) => setItem(e.target.value)}
                    required
                    placeholder="e.g. Shoes"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Amount (GHS)
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 focus-within:border-slate-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-950/10">
                  <Banknote size={18} className="text-slate-400" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    placeholder="250.00"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Status
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 focus-within:border-slate-950 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-950/10">
                  <PackageCheck size={18} className="text-slate-400" />
                  <select
                    title="Select status"
                    aria-label="Select status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Order["status"])}
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-2xl px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading || customers.length === 0}
                  className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function OrderTableRow({ 
  order, 
  index,
  onUpdateStatus,
  isUpdating
}: { 
  order: Order; 
  index: number;
  onUpdateStatus: (id: string, status: Order["status"]) => void;
  isUpdating: boolean;
}) {
  const customerPhone = order.customers?.phone || "";
  const reminderMessage = `Hi ${order.customers?.name || "there"}, just a reminder about your pending payment of GHS ${order.amount} for the ${order.item}. Let me know if you need any help!`;
  const whatsappUrl = `https://wa.me/${customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(reminderMessage)}`;

  return (
    <tr className="transition hover:bg-[#fafbf7]">
      <td className="px-6 py-5 text-sm font-semibold text-slate-400">
        {index + 1}
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-sm font-bold text-slate-700">
            {getInitials(order.customers?.name || "Unknown")}
          </div>

          <div>
            <p className="font-bold text-slate-950">
              {order.customers?.name || "Unknown customer"}
            </p>
            <p className="mt-0.5 text-xs text-slate-500">Customer</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <p className="font-semibold text-slate-900">{order.item}</p>
      </td>

      <td className="px-6 py-5">
        <p className="font-bold text-slate-950">
          GHS {Number(order.amount || 0).toLocaleString()}
        </p>
      </td>

      <td className="px-6 py-5">
        <StatusBadge status={order.status} />
      </td>

      <td className="px-6 py-5 text-sm text-slate-500">
        <div className="inline-flex items-center gap-2">
          <CalendarDays size={15} className="text-slate-400" />
          {formatDate(order.created_at)}
        </div>
      </td>

      <td className="px-6 py-5 text-right">
        <div className="flex items-center justify-end gap-2">
          {order.status === "pending" && (
            <>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-[#0f7a3b]/10 px-3 py-1.5 text-xs font-bold text-[#0f7a3b] transition hover:bg-[#0f7a3b]/20"
                title="Send WhatsApp Reminder"
              >
                Remind
              </a>
              <button
                onClick={() => onUpdateStatus(order.id, "paid")}
                disabled={isUpdating}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {isUpdating ? <Loader2 size={14} className="animate-spin" /> : "Mark Paid"}
              </button>
            </>
          )}
          {order.status === "paid" && (
            <button
              onClick={() => onUpdateStatus(order.id, "delivered")}
              disabled={isUpdating}
              className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 size={14} className="animate-spin" /> : "Mark Delivered"}
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function OrderMobileCard({ 
  order, 
  index,
  onUpdateStatus,
  isUpdating
}: { 
  order: Order; 
  index: number;
  onUpdateStatus: (id: string, status: Order["status"]) => void;
  isUpdating: boolean;
}) {
  const customerPhone = order.customers?.phone || "";
  const reminderMessage = `Hi ${order.customers?.name || "there"}, just a reminder about your pending payment of GHS ${order.amount} for the ${order.item}. Let me know if you need any help!`;
  const whatsappUrl = `https://wa.me/${customerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(reminderMessage)}`;

  return (
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-bold text-slate-950">
            {order.customers?.name || "Unknown customer"}
          </p>
          <p className="mt-1 text-xs text-slate-500">Order #{index + 1}</p>
        </div>

        <StatusBadge status={order.status} />
      </div>

      <div className="mt-4 rounded-2xl bg-[#fafbf7] p-4">
        <div className="grid gap-3 text-sm">
          <InfoRow label="Item" value={order.item} />
          <InfoRow
            label="Amount"
            value={`GHS ${Number(order.amount || 0).toLocaleString()}`}
          />
          <InfoRow label="Date" value={formatDate(order.created_at)} />
        </div>
        
        <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-200 pt-4">
          {order.status === "pending" && (
            <>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center rounded-xl bg-[#0f7a3b]/10 px-3 py-2 text-sm font-bold text-[#0f7a3b] transition hover:bg-[#0f7a3b]/20"
              >
                Remind on WhatsApp
              </a>
              <button
                onClick={() => onUpdateStatus(order.id, "paid")}
                disabled={isUpdating}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-800 disabled:opacity-50"
              >
                {isUpdating && <Loader2 size={14} className="animate-spin" />}
                Mark as Paid
              </button>
            </>
          )}
          {order.status === "paid" && (
            <button
              onClick={() => onUpdateStatus(order.id, "delivered")}
              disabled={isUpdating}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-slate-200 px-3 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-300 disabled:opacity-50"
            >
              {isUpdating && <Loader2 size={14} className="animate-spin" />}
              Mark as Delivered
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Order["status"] }) {
  const styles: Record<Order["status"], string> = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    paid: "bg-blue-50 text-blue-700 border-blue-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function EmptyState({
  hasOrders,
  canCreate,
  onAdd,
}: {
  hasOrders: boolean;
  canCreate: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
        {canCreate ? <ShoppingBag size={25} /> : <AlertCircle size={25} />}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">
        {hasOrders ? "No matching order found" : "No orders yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {canCreate
          ? "Create your first order so you can track payment and delivery."
          : "Add a customer first, then you can create orders for that customer."}
      </p>

      {canCreate && !hasOrders && (
        <button
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-slate-800"
        >
          <Plus size={17} />
          Add first order
        </button>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-bold text-slate-950">{value}</span>
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "U";

  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

function formatDate(date?: string) {
  if (!date) return "Recently";

  return new Intl.DateTimeFormat("en-GH", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}