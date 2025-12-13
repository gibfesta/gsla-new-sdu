"use client";

import { Bell, Search } from "lucide-react";

export default function HeaderBar() {
  return (
    <header className="sticky top-0 z-50 h-[72px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-extrabold tracking-wide text-[#0C2F57]">
            GSLA
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-600">
            <Search size={18} />
            <input
              className="w-64 bg-transparent text-sm outline-none"
              placeholder="Search sport, association, person..."
            />
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button
            className="relative rounded-xl p-2 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D81E27]" />
          </button>

          <button className="rounded-xl p-2 hover:bg-slate-100" aria-label="Profile">
            <div className="h-9 w-9 rounded-full bg-slate-200" />
          </button>
        </div>
      </div>
    </header>
  );
}
