"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, ShoppingBag, MessageCircle, Menu, X, UserCircle } from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => pathname?.startsWith(path);

  const getLinkClass = (path: string) => {
    return `flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
      isActive(path)
        ? "bg-green-50 text-green-700 font-semibold"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white p-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-green-600 text-white">
            <MessageCircle size={16} />
          </div>
          <h1 className="text-lg font-bold">Merchant CRM</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar - Desktop & Mobile */}
      <aside className={`fixed left-0 top-0 z-50 h-full w-64 flex-col border-r bg-white p-6 transition-transform duration-300 md:flex md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-10 flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-600 text-white">
            <MessageCircle size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold">Merchant CRM</h1>
            <p className="text-xs text-slate-500">WhatsApp Sales Control</p>
          </div>
        </div>

        {/* Mobile close button inside sidebar */}
        <button 
          title="Close menu"
          aria-label="Close menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute right-4 top-6 rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 md:hidden"
        >
          <X size={20} />
        </button>

        <nav className="flex-1 space-y-2 text-sm font-medium">
          <Link 
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClass("/dashboard")}
            href="/dashboard"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link 
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClass("/customers")}
            href="/customers"
          >
            <Users size={18} /> Customers
          </Link>
          <Link 
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClass("/orders")}
            href="/orders"
          >
            <ShoppingBag size={18} /> Orders
          </Link>
          <Link 
            onClick={() => setIsMobileMenuOpen(false)}
            className={getLinkClass("/profile")}
            href="/profile"
          >
            <UserCircle size={18} /> Profile
          </Link>
        </nav>
        
        <div className="mt-auto border-t pt-4">
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl p-4 md:p-6">{children}</div>
      </main>
    </div>
  );
}