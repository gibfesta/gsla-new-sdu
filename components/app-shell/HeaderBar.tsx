"use client";

/**
 * HeaderBar
 * ------------------------------------------------------------------
 * Purpose:
 * - Top-level persistent header for the admin app
 * - Contains branding, global search, quick-access icons, and profile entry
 *
 * Notes for future edits:
 * - Layout + spacing is handled entirely with Tailwind here
 * - Navigation actions (router.push) live directly on icon buttons
 * - Visual badges (notification dots) are purely presentational for now
 */

import { Bell, Search, Inbox, Calendar } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HeaderBar() {
  /**
   * Next.js router
   * --------------------------------------------------------------
   * Used for programmatic navigation from header icons
   * (e.g. Calendar button routing to /admin/calendar)
   */
  const router = useRouter();

  return (
    /**
     * Sticky header wrapper
     * --------------------------------------------------------------
     * - sticky + top-0 keeps the header fixed during page scroll
     * - z-50 ensures it stays above sidebars, modals, and content
     * - height is locked to keep layout consistent across pages
     */
    <header className="sticky top-0 z-50 h-[72px] border-b border-slate-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        {/* ------------------------------------------------------------------
            Left section: Branding / Logo
            ------------------------------------------------------------------
            - Static logo for now
            - If logo ever becomes clickable, wrap Image with a Link
            - Image size is controlled via width/height props (not CSS)
        */}
        <div className="flex items-center">
          <Image
            src="/gsla-transp-logo.png"
            alt="GSLA Logo"
            width={140}
            height={40}
            priority
          />
        </div>

        {/* ------------------------------------------------------------------
            Right section: Search, utilities, and profile
            ------------------------------------------------------------------
            - All global user actions live here
            - Items are visually grouped using flex + gap
        */}
        <div className="flex items-center gap-5">
          {/* --------------------------------------------------------------
              Global Search (desktop only)
              --------------------------------------------------------------
              - Hidden on small screens (md:flex)
              - Currently UI-only (no state / handlers wired yet)
              - Placeholder text defines intended search scope
          */}
          <div className="hidden md:flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-slate-600">
            <Search size={18} />
            <input
              className="w-64 bg-transparent text-sm outline-none"
              placeholder="Search sport, association, person..."
            />
          </div>

          {/* --------------------------------------------------------------
              Calendar shortcut
              --------------------------------------------------------------
              - Navigates directly to the admin calendar view
              - router.push keeps this client-side
          */}
          <button
            type="button"
            onClick={() => router.push("/admin/calendar")}
            className="relative rounded-xl p-2 hover:bg-slate-100"
            aria-label="Calendar"
          >
            <Calendar />
          </button>

          {/* --------------------------------------------------------------
              Inbox shortcut
              --------------------------------------------------------------
              - Yellow dot indicates unread messages
              - Dot is hardcoded for now (no state / data connection)
          */}
          <button
            type="button"
            className="relative rounded-xl p-2 hover:bg-slate-100"
            aria-label="Inbox"
          >
            <Inbox />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#F2B705]" />
          </button>

          {/* --------------------------------------------------------------
              Notifications shortcut
              --------------------------------------------------------------
              - Red dot implies high-priority alerts
              - Visual indicator only (no click handler yet)
          */}
          <button
            type="button"
            className="relative rounded-xl p-2 hover:bg-slate-100"
            aria-label="Notifications"
          >
            <Bell />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D81E27]" />
          </button>

          {/* --------------------------------------------------------------
              Profile entry point
              --------------------------------------------------------------
              - Placeholder avatar circle for now
              - Likely future dropdown trigger (profile, settings, logout)
          */}
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
