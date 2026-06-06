"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  Users,
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
    <main className="relative min-h-screen overflow-hidden bg-slate-950 px-4 text-white">
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-[-120px] top-[-120px] h-80 w-80 rounded-full bg-green-500/20 blur-3xl"
      />

      <motion.div
        animate={{ x: [0, -50, 0], y: [0, -40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-[-140px] right-[-120px] h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl"
      />

      <motion.div
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/10 blur-3xl"
      />

      <section className="relative z-10 mx-auto grid min-h-screen max-w-6xl items-center gap-10 py-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block"
        >
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-emerald-100 backdrop-blur"
          >
            Start your WhatsApp sales control center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.8 }}
            className="max-w-xl text-5xl font-bold leading-tight tracking-tight"
          >
            Turn WhatsApp selling into an organized business.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="mt-5 max-w-lg text-base leading-7 text-slate-300"
          >
            Create your account, set up your business workspace, and start
            tracking customers, orders, payments, and follow-ups in minutes.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="mt-8 grid max-w-lg gap-4"
          >
            <Feature
              icon={Users}
              title="Customer memory"
              text="Save customer names, numbers, tags, and buying history."
            />
            <Feature
              icon={ShoppingBag}
              title="Order tracking"
              text="Track pending, paid, delivered, and cancelled orders easily."
            />
            <Feature
              icon={ShieldCheck}
              title="Workspace isolation"
              text="Every seller gets a private business workspace with protected data."
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto w-full max-w-md"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur-xl">
            <div className="rounded-[1.6rem] bg-white p-8 text-slate-900 shadow-xl">
              <div className="mb-8">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/30"
                >
                  <MessageCircle size={26} />
                </motion.div>

                <h1 className="text-2xl font-bold tracking-tight">
                  Create your account
                </h1>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Start managing WhatsApp customers, orders, and payments from
                  one dashboard.
                </p>
              </div>

              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {errorMessage}
                </motion.div>
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
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10"
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
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-green-600 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && <Loader2 size={18} className="animate-spin" />}
                  {loading ? "Creating account..." : "Create account"}
                </motion.button>
              </form>

              <p className="mt-7 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold text-green-700 hover:text-green-800"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            Secure signup for WhatsApp merchant workspaces.
          </p>
        </motion.div>
      </section>
    </main>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof MessageCircle;
  title: string;
  text: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="flex gap-4 rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-500/20 text-green-300">
        <Icon size={20} />
      </div>

      <div>
        <h3 className="font-semibold text-white">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-slate-300">{text}</p>
      </div>
    </motion.div>
  );
}