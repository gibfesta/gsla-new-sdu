type FacilitiesDepartmentBannerProps = {
  title: string;
  description: string;
};

// Shared visual treatment for department pages. Venue workspaces retain their own headers.
export default function FacilitiesDepartmentBanner({ title, description }: FacilitiesDepartmentBannerProps) {
  return (
    <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(105deg,#12365f_0%,#12457c_65%,#0f4f8b_100%)] px-7 py-9 text-white shadow-sm sm:px-10 sm:py-10 sm:min-h-[238px]">
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 right-0 h-80 w-[70%] rounded-[50%] border-[32px] border-white/5 shadow-[0_0_0_42px_rgba(255,255,255,0.025),0_0_0_90px_rgba(255,255,255,0.015)]" />
      <div className="relative flex flex-wrap items-end justify-between gap-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-100">GSLA Facilities</p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-blue-50 sm:text-lg">{description}</p>
        </div>
        <p className="text-xs font-semibold uppercase leading-6 tracking-[0.16em] text-blue-100">Safe venues<br />Stronger communities</p>
      </div>
    </section>
  );
}
