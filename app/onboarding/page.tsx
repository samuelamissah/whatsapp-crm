"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase-browser";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [businessName, setBusinessName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleCreateWorkspace(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);
      setErrorMessage("Authentication failed. Please login again.");
      return;
    }

    const slug = businessName
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const { error: workspaceError } = await supabase
  .from("workspaces")
  .insert({
    name: businessName,
    slug,
    owner_id: user.id,
  });

if (workspaceError) {
  setLoading(false);
  setErrorMessage(workspaceError.message);
  return;
}

router.push("/dashboard");
router.refresh();

    

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <div className="mb-8 flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-green-600 text-white">
            <Store size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Set up your store</h1>
            <p className="text-sm text-slate-500">Create a workspace to get started.</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700">Business name</label>
            <input
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              required
              placeholder="Ama Beauty Salon"
              className="mt-1 w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600"
            />
          </div>

          <button
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-green-700 disabled:opacity-60"
          >
            {loading && <Loader2 size={17} className="animate-spin" />}
            Create Workspace
          </button>
        </form>
      </div>
    </main>
  );
}