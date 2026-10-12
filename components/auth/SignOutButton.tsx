"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SignOutButtonProps = {
  tone?: "dark" | "light";
  compact?: boolean;
  className?: string;
};

export default function SignOutButton({
  tone = "dark",
  compact = false,
  className = "",
}: SignOutButtonProps) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function signOut() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      router.replace("/sign-in");
      router.refresh();
    } catch {
      setError("Unable to sign out. Please try again.");
      setBusy(false);
    }
  }

  const toneClasses = tone === "light"
    ? "border-[#c7d9ee] bg-white text-[#0C2F57] hover:bg-[#eaf2fc] focus-visible:outline-[#0C2F57]"
    : "border-white/25 bg-white/10 text-white hover:bg-white/20 focus-visible:outline-white";

  return (
    <div className={className}>
      <button
        type="button"
        onClick={signOut}
        disabled={busy}
        className={`inline-flex items-center justify-center gap-2 rounded-lg border font-semibold transition disabled:cursor-wait disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 ${compact ? "min-h-8 px-2.5 text-xs" : "min-h-10 px-4 text-sm"} ${toneClasses}`}
      >
        <LogOut size={compact ? 14 : 16} aria-hidden="true" />
        {busy ? "Signing out…" : "Sign out"}
      </button>
      {error && <p role="alert" className={`mt-2 text-xs ${tone === "light" ? "text-rose-700" : "text-rose-100"}`}>{error}</p>}
    </div>
  );
}
