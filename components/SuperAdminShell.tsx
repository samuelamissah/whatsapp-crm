"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, MessageCircle, Menu, X, UserCircle, Settings } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

// 15 minutes of inactivity before auto-logout
const INACTIVITY_TIMEOUT = 15 * 60 * 1000;

export default function SuperAdminShell({ children, userEmail }: { children: React.ReactNode, userEmail?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleLogout = useCallback(async () => {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }, [router, supabase.auth]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
      }, INACTIVITY_TIMEOUT);
    };

    resetTimer();

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    events.forEach(event => {
      window.addEventListener(event, resetTimer);
    });

    return () => {
      clearTimeout(timeoutId);
      events.forEach(event => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [handleLogout]);

  const isActive = (path: string) => pathname?.startsWith(path);

  const getLinkClass = (path: string) => {
    return `flex items-center gap-3 rounded-xl px-3 py-2 transition-colors ${
      isActive(path)
        ? "bg-indigo-50 text-indigo-700 font-semibold"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b bg-white p-4 md:hidden">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-indigo-600 text-white">
            <Settings size={16} />
          </div>
          <h1 className="text-lg text-black font-bold truncate max-w-[150px]">SuperAdmin</h1>
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
        <div className="mb-10 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
            <Settings size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-extrabold text-slate-900" title="SuperAdmin Portal">
              SuperAdmin
            </h1>
            <p className="truncate text-xs font-medium text-slate-500">System Control</p>
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
            className={getLinkClass("/superadmin/dashboard")}
            href="/superadmin/dashboard"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>

          <Link
            className={getLinkClass("/superadmin/whatsapp")}
            href="/superadmin/whatsapp"
          >
            <MessageCircle size={18} /> 
            WhatsApp Settings
          </Link>
          
          <Link 
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            href="/dashboard"
          >
            <UserCircle size={18} /> User Portal
          </Link>
        </nav>
        
        <div className="mt-auto border-t pt-4">
          <div className="mb-4 px-3">
            <p className="text-xs text-slate-500 truncate" title={userEmail}>{userEmail}</p>
          </div>
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