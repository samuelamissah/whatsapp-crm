"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MessageCircle,
  X,
  Loader2,
  UserRound,
  Phone,
  Users,
  CalendarDays,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Customer = {
  id: string;
  name: string;
  phone: string;
  created_at?: string;
};

export default function CustomerList({
  initialCustomers,
}: {
  initialCustomers: Customer[];
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return initialCustomers;

    return initialCustomers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.phone.toLowerCase().includes(query)
    );
  }, [initialCustomers, search]);

  async function handleAddCustomer(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add customer");
      }

      setIsModalOpen(false);
      setName("");
      setPhone("");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Customers</h2>
            <p className="mt-1 text-sm text-slate-500">
              Search, save and message your buyers from one place.
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b6230]"
          >
            <Plus size={17} />
            Add Customer
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 shadow-sm focus-within:border-[#0f7a3b] focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-700/10">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search by customer name or WhatsApp number..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 shadow-sm">
            Showing {filteredCustomers.length} of {initialCustomers.length}
          </div>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <EmptyState
          hasCustomers={initialCustomers.length > 0}
          onAdd={() => setIsModalOpen(true)}
        />
      ) : (
        <>
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-[#fafbf7] text-xs uppercase tracking-wide text-slate-500">
                  <th className="w-16 px-6 py-4 font-bold">#</th>
                  <th className="px-6 py-4 font-bold">Customer</th>
                  <th className="px-6 py-4 font-bold">WhatsApp Number</th>
                  <th className="px-6 py-4 font-bold">Date Added</th>
                  <th className="px-6 py-4 text-right font-bold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer, index) => (
                  <CustomerTableRow
                    key={customer.id}
                    customer={customer}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-slate-100 lg:hidden">
            {filteredCustomers.map((customer, index) => (
              <CustomerMobileCard
                key={customer.id}
                customer={customer}
                index={index}
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
                <h2 className="text-xl font-bold text-slate-950">
                  Add customer
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save their details before the WhatsApp chat gets buried.
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

            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Customer name
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 focus-within:border-[#0f7a3b] focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-700/10">
                  <UserRound size={18} className="text-slate-400" />
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ama Mensah"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  WhatsApp number
                </label>

                <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 focus-within:border-[#0f7a3b] focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-700/10">
                  <Phone size={18} className="text-slate-400" />
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    placeholder="233241234567"
                    className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-slate-500">
                  Use international format without +, example: 233241234567
                </p>
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
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b6230] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <Loader2 size={16} className="animate-spin" />}
                  Save customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function CustomerTableRow({
  customer,
  index,
}: {
  customer: Customer;
  index: number;
}) {
  const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
  const initials = getInitials(customer.name);

  return (
    <tr className="transition hover:bg-[#fafbf7]">
      <td className="px-6 py-5 text-sm font-semibold text-slate-400">
        {index + 1}
      </td>

      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-700">
            {initials}
          </div>

          <div>
            <p className="font-bold text-slate-950">{customer.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">Saved customer</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
          <Phone size={14} className="text-slate-400" />
          {customer.phone}
        </div>
      </td>

      <td className="px-6 py-5 text-sm text-slate-500">
        <div className="inline-flex items-center gap-2">
          <CalendarDays size={15} className="text-slate-400" />
          {formatDate(customer.created_at)}
        </div>
      </td>

      <td className="px-6 py-5">
        <div className="flex justify-end">
          <a
            rel="noopener noreferrer"
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hi ${customer.name}, thank you for buying from us.`
            )}`}
            target="_blank"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#0b6230]"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        </div>
      </td>
    </tr>
  );
}

function CustomerMobileCard({
  customer,
  index,
}: {
  customer: Customer;
  index: number;
}) {
  const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
  const initials = getInitials(customer.name);

  return (
    <div className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-bold text-emerald-700">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-bold text-slate-950">{customer.name}</p>
              <p className="mt-1 text-xs text-slate-500">
                Customer #{index + 1}
              </p>
            </div>

            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
              Saved
            </span>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Phone size={15} className="text-slate-400" />
              {customer.phone}
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays size={15} className="text-slate-400" />
              {formatDate(customer.created_at)}
            </div>
          </div>

          <a
            rel="noopener noreferrer"
            href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
              `Hi ${customer.name}, thank you for buying from us.`
            )}`}
            target="_blank"
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b6230]"
          >
            <MessageCircle size={16} />
            Open WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  hasCustomers,
  onAdd,
}: {
  hasCustomers: boolean;
  onAdd: () => void;
}) {
  return (
    <div className="p-10 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Users size={25} />
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-950">
        {hasCustomers ? "No matching customer found" : "No customers yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
        {hasCustomers
          ? "Try searching with another name or phone number."
          : "Start by saving your first buyer. Once added, you can find them quickly and open WhatsApp from here."}
      </p>

      {!hasCustomers && (
        <button
          onClick={onAdd}
          className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b6230]"
        >
          <Plus size={17} />
          Add first customer
        </button>
      )}
    </div>
  );
}

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);

  if (parts.length === 0) return "C";

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

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