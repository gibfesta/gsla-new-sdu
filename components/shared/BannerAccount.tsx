"use client";

import Link from "next/link";
import { useAccountDisplay } from "./AccountDisplayProvider";

export default function BannerAccount({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const account = useAccountDisplay();

  return (
    <Link href="/profile" aria-label={account ? `Open your profile: ${account.label}` : "Open your profile"} aria-busy={!account} className={`absolute right-5 top-4 z-10 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-8 ${tone === "light" ? "text-[#0C2F57] hover:bg-[#eaf2fc] focus-visible:outline-[#0C2F57]" : "text-white hover:bg-white/10 focus-visible:outline-white"}`}>
      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${tone === "light" ? "bg-[#0C2F57] text-white" : "bg-white/20"}`}>{account?.initials ?? <span aria-hidden="true" className="h-3 w-3 animate-pulse rounded-full bg-current opacity-30" />}</span>
      <span className="max-w-44 truncate">{account?.label ?? <span aria-hidden="true" className="block h-3 w-24 animate-pulse rounded bg-current opacity-20" />}</span>
    </Link>
  );
}
