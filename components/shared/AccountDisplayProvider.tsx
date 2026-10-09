"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AccountDisplay = { initials: string; label: string };
const AccountDisplayContext = createContext<AccountDisplay | null>(null);

function accountInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.length > 1
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : (parts[0] || "U").slice(0, 2).toUpperCase();
}

export function AccountDisplayProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<AccountDisplay | null>(null);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    let userId: string | null = null;
    let request: AbortController | null = null;
    let active = true;

    async function load(id: string, controller: AbortController) {
      try {
        // The endpoint verifies the current user. These details are display-only.
        const response = await fetch("/api/profile", { cache: "no-store", signal: controller.signal });
        if (!response.ok) return;
        const payload = await response.json();
        if (!active || controller.signal.aborted || payload?.auth?.id !== id) return;
        const profileName = typeof payload?.profile?.full_name === "string" ? payload.profile.full_name.trim() : "";
        const isPlaceholder = ["Organisation Administrator", "Facilities Administrator", "Centre Manager", "New User"].includes(profileName);
        const email = typeof payload?.auth?.email === "string" ? payload.auth.email : "";
        const displayName = profileName && !isPlaceholder ? profileName : (email.split("@")[0] || "User").replace(/[._-]+/g, " ");
        setAccount({ initials: accountInitials(displayName), label: displayName });
      } catch {
        // A cancelled request must never restore the previous user's details.
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!active) return;
      const nextId = session?.user.id ?? null;
      if (event === "SIGNED_OUT" || !nextId) {
        request?.abort();
        userId = null;
        setAccount(null);
        return;
      }
      // Repeated sign-in / refresh events retain the already loaded indicator.
      if (nextId === userId && event !== "USER_UPDATED") return;
      request?.abort();
      if (nextId !== userId) setAccount(null);
      userId = nextId;
      const controller = new AbortController();
      request = controller;
      queueMicrotask(() => { if (active && !controller.signal.aborted) void load(nextId, controller); });
    });

    return () => {
      active = false;
      request?.abort();
      subscription.unsubscribe();
    };
  }, []);

  return <AccountDisplayContext.Provider value={account}>{children}</AccountDisplayContext.Provider>;
}

export function useAccountDisplay() {
  return useContext(AccountDisplayContext);
}
