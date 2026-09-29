import BannerAccount from "@/components/shared/BannerAccount";

type FacilitiesDepartmentBannerProps = {
  title: string;
  description: string;
  eyebrow?: string;
  details?: React.ReactNode;
  tone?: "dark" | "light";
};

// Shared visual treatment for department and venue pages.
export default function FacilitiesDepartmentBanner({ title, description, eyebrow, details, tone = "dark" }: FacilitiesDepartmentBannerProps) {
  const light = tone === "light";
  return (
    <section className={`relative overflow-hidden rounded-2xl px-7 pb-9 pt-16 shadow-sm sm:min-h-[238px] sm:px-10 sm:pb-10 sm:pt-14 ${light ? "border border-[#d5e4f6] bg-white text-[#0C2F57]" : "bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] text-white"}`}>
      <BannerAccount tone={tone} />
      <div aria-hidden="true" className={`pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] ${light ? "border-[#0C2F57]/5 shadow-[0_0_0_42px_rgba(12,47,87,0.025),0_0_0_90px_rgba(12,47,87,0.015)]" : "border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]"}`} />
      <div className="relative flex flex-wrap items-end justify-between gap-8">
        <div>
          {eyebrow && <p className={`mb-3 text-xs font-bold uppercase tracking-[0.16em] ${light ? "text-[#35557f]" : "text-blue-100"}`}>{eyebrow}</p>}
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          <p className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg ${light ? "text-[#35557f]" : "text-blue-50"}`}>{description}</p>
          {details && <div className={`mt-4 flex flex-wrap items-center gap-3 text-sm ${light ? "text-[#35557f]" : "text-blue-100"}`}>{details}</div>}
        </div>
        <p className={`text-xs font-semibold uppercase leading-6 tracking-[0.16em] ${light ? "text-[#35557f]" : "text-blue-100"}`}>Safe venues<br />Stronger communities</p>
      </div>
    </section>
  );
}
