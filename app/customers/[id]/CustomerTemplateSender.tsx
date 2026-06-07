"use client";

import { useState } from "react";
import { MessageCircle, Send } from "lucide-react";

type Customer = {
  id: string;
  name: string;
  phone: string;
};

type Template = {
  id: string;
  title: string;
  body: string;
  category: string;
};

export default function CustomerTemplateSender({
  customer,
  templates,
}: {
  customer: Customer;
  templates: Template[];
}) {
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  const selectedTemplate = templates.find(
    (template) => template.id === selectedTemplateId
  );

  const message = selectedTemplate
    ? applyVariables(selectedTemplate.body, {
        name: customer.name,
        phone: customer.phone,
      })
    : "";

  const cleanPhone = customer.phone.replace(/[^0-9]/g, "");
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <MessageCircle size={21} />
        </div>

        <div>
          <h2 className="font-bold text-slate-950">Send WhatsApp template</h2>
          <p className="mt-1 text-sm text-slate-500">
            Pick a saved message and open it in WhatsApp.
          </p>
        </div>
      </div>

      {templates.length === 0 ? (
        <div className="rounded-2xl bg-[#fafbf7] p-4 text-sm text-slate-600">
          No templates yet. Create one from the Templates page.
        </div>
      ) : (
        <div className="space-y-4">
          <select
            title="s"
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
          >
            <option value="">Choose a template</option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.title}
              </option>
            ))}
          </select>

          {selectedTemplate && (
            <div className="rounded-2xl border border-slate-200 bg-[#fafbf7] p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                Preview
              </p>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {message}
              </p>
            </div>
          )}

          <a
            href={selectedTemplate ? whatsappUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold ${
              selectedTemplate
                ? "bg-[#0f7a3b] text-white hover:bg-[#0b6230]"
                : "cursor-not-allowed bg-slate-100 text-slate-400"
            }`}
          >
            <Send size={17} />
            Open in WhatsApp
          </a>
        </div>
      )}
    </div>
  );
}

function applyVariables(template: string, customer: { name: string; phone: string }) {
  if (!template) return "";
  return template
    .replaceAll("{{name}}", customer.name || "")
    .replaceAll("{{phone}}", customer.phone || "");
}