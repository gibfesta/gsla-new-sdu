import Link from "next/link";

export default function BannerAccount({ tone = "dark" }: { tone?: "dark" | "light" }) {
  return (
    <Link href="/On-Hold-Pages/profile" aria-label="Open your account" className={`absolute right-5 top-4 z-10 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 sm:right-8 ${tone === "light" ? "text-[#0C2F57] hover:bg-[#eaf2fc] focus-visible:outline-[#0C2F57]" : "text-white hover:bg-white/10 focus-visible:outline-white"}`}>
      <span className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold ${tone === "light" ? "bg-[#0C2F57] text-white" : "bg-white/20"}`}>GS</span>
      <span>Account</span>
    </Link>
  );
}
