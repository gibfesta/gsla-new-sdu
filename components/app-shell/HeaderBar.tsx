"use client";

import { Bell, Search, Inbox, Calendar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeaderBar() {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* Left side: logo */}
        <div className="flex items-center">
          <Image
            src="/gsla-transp-logo.png"
            alt="GSLA Logo"
            width={140}
            height={40}
            priority
          />
        </div>

        {/* Right side: search + icons */}
        <div className="flex items-center gap-5">
          {/* Search (right side) */}
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

          {/* Inbox */}
          <button
            type="button"
            className="relative rounded-xl p-2 hover:bg-slate-100"
            aria-label="Inbox"
          >
            <Inbox />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F2B705]" />
          </button>

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
