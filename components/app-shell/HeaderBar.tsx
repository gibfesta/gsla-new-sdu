"use client";

/**
 * HeaderBar
 * ------------------------------------------------------------------
 * Purpose:
 * - Persistent header for the admin app
 * - Global search + quick-access icons + profile entry
 *
 * MAIL / INBOX (Demo wiring)
 * - Unread count is read from localStorage key: "gsla_admin_mail_unread"
 * - /admin/mail is responsible for updating that value (seed/demo today)
 * - Later: replace localStorage with API/DB unread count
 */

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, Inbox, Calendar } from "lucide-react";
import { useEffect, useState } from "react";

export default function HeaderBar() {
  const router = useRouter();

  // ---------------------------------------------------------------------------
  // Unread count (demo)
  // - /admin/mail writes to localStorage and dispatches a custom event
  // - Header listens and updates badge immediately
  // ---------------------------------------------------------------------------
  const [mailUnread, setMailUnread] = useState<number>(0);

  useEffect(() => {
    const read = () => {
      const raw = window.localStorage.getItem("gsla_admin_mail_unread");
      const n = raw ? Number(raw) : 0;
      setMailUnread(Number.isFinite(n) ? n : 0);
    };

    // initial read
    read();

    // storage event (other tabs) + custom event (same tab)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "gsla_admin_mail_unread") read();
    };
    const onCustom = () => read();

    window.addEventListener("storage", onStorage);
    window.addEventListener("gsla:mail-unread-updated", onCustom as any);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("gsla:mail-unread-updated", onCustom as any);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Image
            src="/gsla-transp-logo.png"
            alt="GSLA Logo"
            width={140}
            height={40}
            priority
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          {/* Global Search */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-600">
            <Search size={18} />
            <input
              className="w-64 bg-transparent text-sm outline-none"
              placeholder="Search sport, association, person..."
            />
          </div>

          {/* Calendar */}
          <button
            type="button"
            onClick={() => router.push("/admin/calendar")}
            className="relative rounded-xl p-2 hover:bg-slate-100"
            aria-label="Calendar"
          >
            <Calendar />
          </button>

          {/* Inbox (ONLY access to /admin/mail) */}
          <Link href="/admin/mail" aria-label="Inbox">
            <button
              type="button"
              className="relative rounded-xl p-2 hover:bg-slate-100"
            >
              <Inbox />

              {/* Unread badge (replaces the dot) */}
              {mailUnread > 0 && (
                <span className="absolute -right-1 -top-1 min-w-[18px] rounded-full bg-[#F2B705] px-1.5 py-0.5 text-[11px] font-bold leading-none text-[#0C2F57] text-center">
                  {mailUnread > 99 ? "99+" : mailUnread}
                </span>
              )}
            </button>
          </Link>

          {/* Notifications */}
          <button
            type="button"
            className="relative rounded-xl p-2 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D81E27]" />
          </button>

          {/* Profile */}
          <button
            type="button"
            className="rounded-xl p-2 hover:bg-slate-100"
            aria-label="Profile"
          >
            <div className="h-9 w-9 rounded-full bg-slate-200" />
          </button>
        </div>
      </div>
    </header>
  );
}
