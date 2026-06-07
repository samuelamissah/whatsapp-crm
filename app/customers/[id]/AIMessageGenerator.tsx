"use client";

import { useState } from "react";
import { Bot, Loader2, MessageCircle, Sparkles } from "lucide-react";

type Customer = {
  name: string;
  phone: string;
};

export default function AIMessageGenerator({
  customer,
}: {
  customer: Customer;
}) {
  const [messageType, setMessageType] = useState("payment_reminder");
  const [context, setContext] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cleanPhone = customer.phone.replace(/[^0-9]/g, "");

  async function generateMessage() {
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/ai/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: customer.name,
          messageType,
          context,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate message");
      }

      setMessage(data.message);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-50 text-purple-700">
          <Bot size={21} />
        </div>

        <div>
          <h2 className="font-bold text-slate-950">AI message generator</h2>
          <p className="mt-1 text-sm text-slate-500">
            Generate a WhatsApp message for this customer.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <select
          name="message_type"
          id="message_type"
          aria-label="Select message type"
          value={messageType}
          onChange={(e) => setMessageType(e.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
        >
          <option value="payment_reminder">Payment reminder</option>
          <option value="follow_up">Sales follow-up</option>
          <option value="delivery_update">Delivery update</option>
          <option value="thank_you">Thank you message</option>
          <option value="vip_offer">VIP offer</option>
          <option value="lost_customer">Win back inactive customer</option>
        </select>

        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={4}
          placeholder="Example: She owes GHS 150 for a dress and promised to pay today."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
        />

        <button
          onClick={generateMessage}
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-purple-700 px-4 py-3 text-sm font-bold text-white hover:bg-purple-800 disabled:opacity-60"
        >
          
          {loading ? "Generating..." : "Generate message"}
        </button>

        {message && (
          <div className="rounded-2xl border border-slate-200 bg-[#fafbf7] p-4">
            <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {message}
            </p>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-3 text-sm font-bold text-white hover:bg-[#0b6230]"
            >
              <MessageCircle size={17} />
              Open in WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}