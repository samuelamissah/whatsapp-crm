"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Users,
  ShoppingBag,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
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

        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-white sm:block"
          >
            Login
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Create account
          </Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
            Built for small businesses selling on WhatsApp
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-[-0.04em] text-slate-950 md:text-6xl md:leading-[1.03]">
            Stop losing orders inside WhatsApp chats.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            Keep your customers, orders, payments, and follow-ups in one simple
            dashboard while you continue chatting normally on WhatsApp.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#0f7a3b] px-6 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-[#0b6230]"
            >
              Start free
              <ArrowRight size={17} />
            </Link>

            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-800 shadow-sm hover:bg-slate-50"
            >
              Login
            </Link>
          </div>

          <div className="mt-8 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
            <TrustItem text="No complex setup" />
            <TrustItem text="Made for daily sales" />
            <TrustItem text="Works with WhatsApp" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.55 }}
          className="relative"
        >
          <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-3xl bg-emerald-200 lg:block" />
          <div className="absolute -bottom-4 -left-4 hidden h-24 w-24 rounded-3xl bg-yellow-100 lg:block" />

          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-4 shadow-xl">
            <div className="rounded-[1.5rem] border border-slate-100 bg-[#fbfcf8] p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Today&apos;s Sales
                  </p>
                  <p className="text-xs text-slate-500">Ama Beauty Salon</p>
                </div>

                <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
                  Live
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <DashboardStat label="Customers" value="24" />
                <DashboardStat label="Pending orders" value="7" />
                <DashboardStat label="Paid orders" value="12" />
                <DashboardStat label="Revenue" value="GHS 1,840" />
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-bold">Recent orders</p>
                  <p className="text-xs font-medium text-emerald-700">
                    View all
                  </p>
                </div>

                <OrderRow name="Ama Mensah" item="Dress" amount="GHS 120" />
                <OrderRow name="Kofi Asare" item="Shoes" amount="GHS 300" />
                <OrderRow name="Efua Boateng" item="Bag" amount="GHS 180" />
              </div>

              <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
                <p className="text-sm font-bold">Follow-up reminder</p>
                <p className="mt-1 text-sm text-slate-300">
                  3 customers have pending payments today.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="grid gap-4 md:grid-cols-3">
          <Feature
            icon={Users}
            title="Customer memory"
            text="Save names, numbers, tags, and buying history so you never forget a buyer."
          />
          <Feature
            icon={ShoppingBag}
            title="Order tracking"
            text="Know what each customer ordered, who has paid, and what is still pending."
          />
          <Feature
            icon={Bell}
            title="Simple follow-ups"
            text="See who needs a reminder and continue the conversation on WhatsApp."
          />
        </div>
      </section>
    </main>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <CheckCircle2 size={17} className="text-emerald-700" />
      <span>{text}</span>
    </div>
  );
}

function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-bold text-slate-950">{value}</p>
    </div>
  );
}

function OrderRow({
  name,
  item,
  amount,
}: {
  name: string;
  item: string;
  amount: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-b-0">
      <div>
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        <p className="text-xs text-slate-500">{item}</p>
      </div>

      <p className="text-sm font-bold text-slate-900">{amount}</p>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  text,
}: {
  icon: typeof Users;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon size={21} />
      </div>

      <h3 className="text-base font-bold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}