"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Loader2,
  ShieldCheck,
  ShoppingBag,
  Users,
  CheckCircle2,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    const { data, error } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
    });

    if (error) {
      setLoading(false);
      setErrorMessage(error.message);
      return;
    }

    const userId = data.user?.id;

    if (!userId) {
      setLoading(false);
      setErrorMessage("Signup failed. Please try again.");
      return;
    }

    if (!data.session) {
      setLoading(false);
      setErrorMessage(
        "Signup successful. Please check your email to confirm your account before logging in."
      );
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#f7f8f4] text-slate-950">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0f7a3b] text-white">
            <MessageCircle size={21} />
          </div>

          <div>
            <p className="text-sm font-bold leading-none">Merchant CRM</p>
            <p className="mt-1 text-xs text-slate-500">For WhatsApp sellers</p>
          </div>
        </Link>

        <Link
          href="/login"
          className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Login
        </Link>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-88px)] max-w-6xl items-center gap-12 px-6 pb-16 lg:grid-cols-[1fr_440px]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="hidden lg:block"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Start your WhatsApp sales workspace
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-[-0.04em] text-slate-950">
            Bring order to your daily WhatsApp sales.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Create an account, set up your business workspace, and start
            tracking customers, orders, payments, and follow-ups without
            changing how you chat.
          </p>

          <div className="mt-8 grid max-w-xl gap-3">
            <InfoItem
              icon={Users}
              title="Keep customer records"
              text="Save customer names, phone numbers, tags, and buying history."
            />

            <InfoItem
              icon={ShoppingBag}
              title="Track orders from one place"
              text="Know who has paid, what is pending, and what has been delivered."
            />

            <InfoItem
              icon={ShieldCheck}
              title="Private business workspace"
              text="Your customers and orders stay inside your own protected workspace."
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08, duration: 0.45 }}
          className="relative"
        >
          <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-3xl bg-emerald-200 lg:block" />
          <div className="absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-3xl bg-yellow-100 lg:block" />

          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-8 shadow-xl">
            <div className="mb-8">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0f7a3b] text-white">
                <MessageCircle size={26} />
              </div>

              <h1 className="text-2xl font-bold tracking-tight">
                Create your account
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Start with your login, then create your business workspace.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleSignup} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Email address
                </label>

                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f7a3b] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  type="password"
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#fafbf7] px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0f7a3b] focus:bg-white focus:ring-4 focus:ring-emerald-700/10"
                />
              </div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-4 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#0b6230] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && <Loader2 size={18} className="animate-spin" />}
                {loading ? "Creating account..." : "Create account"}
              </motion.button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-bold text-[#0f7a3b] hover:text-[#0b6230]"
              >
                Login
              </Link>
            </p>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-500">
            <CheckCircle2 size={15} className="text-emerald-700" />
            Private workspace for every seller
          </div>
        </motion.div>
      </section>
    </main>
  );
}

function InfoItem({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof MessageCircle;
  title: string;
  text: string;
}) {
  return (
    <div className="flex gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon size={21} />
      </div>

      <div>
        <h3 className="font-bold text-slate-950">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </div>
  );
}