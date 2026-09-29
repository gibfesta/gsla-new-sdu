import BannerAccount from "@/components/shared/BannerAccount";

export default function VenueBanner({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#0C2F57] to-[#174A84] text-white shadow-sm ${className}`}>
    <BannerAccount />
    {children}
  </section>;
}
