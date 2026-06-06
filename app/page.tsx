import { MessageCircle, Users, ShoppingBag, Bell } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-green-500">
          <MessageCircle size={30} />
        </div>

        <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
          Run your WhatsApp business like a real shop.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-300">
          Organize customers, track orders, follow up payments and continue chats on WhatsApp.
        </p>

        <Link
          href="/signup"
          className="mt-8 rounded-xl bg-green-500 px-6 py-3 text-sm font-bold text-slate-950"
        >
          Create Account
        </Link>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          <Feature icon={Users} title="Customer Memory" text="Never lose buyer details again." />
          <Feature icon={ShoppingBag} title="Order Tracking" text="Know who paid, who is pending and what was delivered." />
          <Feature icon={Bell} title="Follow-ups" text="Remind customers directly through WhatsApp." />
        </div>
      </section>
    </main>
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
      <Icon className="mb-4 text-green-400" />
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  );
}