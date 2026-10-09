"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function accountInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0] || "U").slice(0, 2).toUpperCase();
}

export default function BannerAccount({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [account, setAccount] = useState({ initials: "—", label: "My Profile" });

  useEffect(() => {
    let active = true;
    const supabase = createSupabaseBrowserClient();
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!active || !user) return;
      // User-editable profile metadata is for display only, never permissions.
      const response = await fetch("/api/profile", { cache: "no-store" }).catch(() => null);
      const payload = response?.ok ? await response.json().catch(() => null) : null;
      if (!active) return;
      const profileName = typeof payload?.profile?.full_name === "string" ? payload.profile.full_name.trim() : "";
      const isPlaceholder = ["Organisation Administrator", "Facilities Administrator", "Centre Manager", "New User"].includes(profileName);
      const displayName = profileName && !isPlaceholder ? profileName : (user.email?.split("@")[0] || "User").replace(/[._-]+/g, " ");
      setAccount({ initials: accountInitials(displayName), label: displayName });
    };
    void load();
    return () => { active = false; };
  }, []);

  return (
    <Link href="/profile" aria-label={`Open your profile: ${account.label}`} className={`absolute right-5 top-4 z-10 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-8 ${tone === "light" ? "text-[#0C2F57] hover:bg-[#eaf2fc] focus-visible:outline-[#0C2F57]" : "text-white hover:bg-white/10 focus-visible:outline-white"}`}>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${tone === "light" ? "bg-[#0C2F57] text-white" : "bg-white/20"}`}>{account.initials}</span>
      <span className="max-w-44 truncate">{account.label}</span>
    </Link>
  );
}
