"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

type Settings = {
  phone_number_id?: string | null;
  business_account_id?: string | null;
  webhook_verify_token?: string | null;
  is_connected?: boolean | null;
};

export default function WhatsAppSettingsForm({
  settings,
}: {
  settings: Settings | null;
}) {
  const router = useRouter();

  const [phoneNumberId, setPhoneNumberId] = useState(
    settings?.phone_number_id || ""
  );
  const [businessAccountId, setBusinessAccountId] = useState(
    settings?.business_account_id || ""
  );
  const [accessToken, setAccessToken] = useState("");
  const [webhookVerifyToken, setWebhookVerifyToken] = useState(
    settings?.webhook_verify_token || ""
  );

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/whatsapp/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumberId,
          businessAccountId,
          accessToken,
          webhookVerifyToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save WhatsApp settings");
      }

      setAccessToken("");
      setMessage("WhatsApp settings saved.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong");
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
          Cloud API credentials
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Save your Meta WhatsApp Cloud API details here.
        </p>
      </div>

      {message && (
        <div className="mb-4 rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm font-semibold text-slate-700">
          {message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          label="Phone Number ID"
          value={phoneNumberId}
          onChange={setPhoneNumberId}
          placeholder="123456789..."
        />

        <Input
          label="WhatsApp Business Account ID"
          value={businessAccountId}
          onChange={setBusinessAccountId}
          placeholder="123456789..."
        />

        <Input
          label="Access Token"
          value={accessToken}
          onChange={setAccessToken}
          placeholder="Paste token here"
          type="password"
        />

        <Input
          label="Webhook Verify Token"
          value={webhookVerifyToken}
          onChange={setWebhookVerifyToken}
          placeholder="my-secret-verify-token"
        />
      </div>

      <button
        disabled={loading}
        className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-3 text-sm font-bold text-white hover:bg-[#0b6230] disabled:opacity-60"
      >
        {loading ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
        {loading ? "Saving..." : "Save WhatsApp settings"}
      </button>
    </form>
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
        required
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#0f7a3b] focus:ring-4 focus:ring-emerald-700/10"
      />
    </div>
  );
}