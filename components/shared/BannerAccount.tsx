import Link from "next/link";

export default function BannerAccount() {
  return (
    <Link href="/profile" aria-label="Open your account" className="absolute right-5 top-4 z-10 inline-flex items-center gap-2 rounded-full px-2 py-1 text-xs font-medium text-white transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-8">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[10px] font-bold">GS</span>
      <span>Account</span>
    </Link>
  );
}
