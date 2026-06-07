"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  X,
  Loader2,
  MessageCircle,
  Search,
  FileText,
  Copy,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Template = {
  id: string;
  title: string;
  body: string;
  category: string;
  created_at?: string;
};

export default function TemplateList({
  initialTemplates,
}: {
  initialTemplates: Template[];
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredTemplates = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return initialTemplates;

    return initialTemplates.filter(
      (template) =>
        template.title.toLowerCase().includes(query) ||
        template.body.toLowerCase().includes(query) ||
        template.category.toLowerCase().includes(query)
    );
  }, [initialTemplates, search]);

  async function handleCreateTemplate(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          body,
          category,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create template");
      }

      setTitle("");
      setBody("");
      setCategory("general");
      setIsModalOpen(false);
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
            <h2 className="text-xl font-bold text-slate-950">
              Message templates
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Create messages once and reuse them for customers.
            </p>
          </div>

          <button
            onClick={() => {
              setError("");
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0b6230]"
          >
            <Plus size={17} />
            Add Template
          </button>
        </div>

        <div className="mt-5 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 focus-within:border-[#0f7a3b] focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-700/10">
            <Search size={18} className="text-slate-400" />
            <input
              placeholder="Search templates..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">
            Showing {filteredTemplates.length} of {initialTemplates.length}
          </div>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="p-10 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
            <FileText size={25} />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-950">
            No templates yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Add your first message template for reminders, deliveries, or
            promotions.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 p-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="rounded-3xl border border-slate-200 bg-[#fafbf7] p-5"
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-emerald-700">
                    {template.category}
                  </span>

                  <h3 className="mt-3 font-bold text-slate-950">
                    {template.title}
                  </h3>
                </div>

                <MessageCircle size={20} className="text-emerald-700" />
              </div>

              <p className="line-clamp-5 text-sm leading-6 text-slate-600">
                {template.body}
              </p>

              <button
                onClick={() => navigator.clipboard.writeText(template.body)}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                <Copy size={15} />
                Copy
              </button>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-950">
                  Add Template
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Save a reusable WhatsApp message.
                </p>
              </div>

              <button
                title="Close modal"
                type="button"
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

            <form onSubmit={handleCreateTemplate} className="space-y-4">
              <Input
                label="Template title"
                value={title}
                onChange={setTitle}
                placeholder="Payment reminder"
              />

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Category
                </label>
                <select
                  title="Select category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
                >
                  <option value="general">General</option>
                  <option value="payment">Payment</option>
                  <option value="delivery">Delivery</option>
                  <option value="promotion">Promotion</option>
                  <option value="thank_you">Thank you</option>
                </select>
              </div>

              <TextArea
                label="Message body"
                value={body}
                onChange={setBody}
                placeholder="Hi {{name}}, this is a reminder that your payment of GHS {{amount}} is still pending."
              />

              <div className="rounded-2xl bg-[#fafbf7] p-4 text-xs leading-5 text-slate-500">
                You can use variables like {"{{name}}"}, {"{{amount}}"} and{" "}
                {"{{item}}"}.
              </div>

              <button
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-3 text-sm font-bold text-white hover:bg-[#0b6230] disabled:opacity-60"
              >
                {loading ? (
                  <Loader2 size={17} className="animate-spin" />
                ) : (
                  <Plus size={17} />
                )}
                {loading ? "Saving..." : "Save template"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

function Input({
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
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        placeholder={placeholder}
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
        required
        rows={5}
        placeholder={placeholder}
        className="mt-2 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
      />
    </div>
  );
}