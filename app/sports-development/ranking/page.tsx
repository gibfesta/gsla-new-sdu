import Link from "next/link";
import { ArrowRight, BarChart3, Info, Scale, ShieldAlert } from "lucide-react";
import { demoRanking, rankingCriteria } from "@/lib/sports-development/ranking";

const display = (value: number) => value.toFixed(1);

export default function SportsRankingPage() {
  return (
    <div className="space-y-4 text-[#112d56]">
      <section className="flex items-start gap-3 rounded-xl border border-[#b9d6f5] bg-[#eef6ff] px-5 py-4 text-sm leading-6 text-[#35557f]">
        <Info size={21} className="mt-0.5 shrink-0 text-[#155ca7]" aria-hidden="true" />
        <div><strong>Demonstration ranking.</strong> These five sports and their figures are the example records in Participation Statistics. They are not verified current GSLA data. The weights below illustrate a possible method; this page does not recommend or calculate funding allocations.</div>
      </section>

      <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm sm:p-6" aria-labelledby="ranking-heading">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div><h2 id="ranking-heading" className="flex items-center gap-2 text-2xl font-bold"><BarChart3 size={23} className="text-[#155ca7]" aria-hidden="true" />Development ranking preview</h2><p className="mt-1 text-sm text-[#60799f]">Scores compare development indicators out of 100. Each row can be opened to see the calculation.</p></div>
          <Link href="/sports-development/reports" className="inline-flex items-center gap-2 text-sm font-semibold text-[#155ca7] hover:underline">View source figures <ArrowRight size={17} aria-hidden="true" /></Link>
        </div>
        <div className="mt-5 space-y-3">
          {demoRanking.map((row, index) => (
            <details key={row.sport.sport} className="group rounded-xl border border-[#d5e4f6] bg-[#fbfdff] open:bg-white">
              <summary className="grid cursor-pointer list-none items-center gap-3 p-4 marker:hidden sm:grid-cols-[2.5rem_minmax(10rem,1fr)_minmax(8rem,1.5fr)_5rem] sm:gap-5 [&::-webkit-details-marker]:hidden">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eaf2fc] text-sm font-bold text-[#174a84]">{index + 1}</span>
                <span className="font-bold">{row.sport.sport}<span className="block text-xs font-normal text-[#60799f]">{row.sport.participants.toLocaleString()} participants · {row.sport.yoyGrowthPct > 0 ? "+" : ""}{row.sport.yoyGrowthPct}% yearly growth</span></span>
                <span className="hidden h-2 overflow-hidden rounded-full bg-[#e5effb] sm:block"><span className="block h-full rounded-full bg-[#1773c6]" style={{ width: `${row.total}%` }} /></span>
                <span className="text-right text-xl font-bold text-[#12457c]">{display(row.total)}<span className="block text-xs font-normal text-[#60799f]">/ 100</span></span>
              </summary>
              <div className="border-t border-[#e5edf8] px-4 py-4 sm:px-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {rankingCriteria.map((criterion) => <div key={criterion.key} className="flex justify-between gap-3 rounded-lg bg-[#f4f8fd] px-3 py-2 text-sm"><span>{criterion.label}</span><strong>{display(row.scores[criterion.key])} / {criterion.weight}</strong></div>)}
                </div>
                <p className="mt-3 text-xs text-[#60799f]">{row.sport.retentionPct}% retention · {row.sport.new30d} new participants in 30 days · {row.sport.activeTeams} teams · {row.sport.fixturesThisMonth} fixtures this month · {row.sport.complianceFlags} compliance flags</p>
              </div>
            </details>
          ))}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-[#d5e4f6] bg-white p-5 shadow-sm sm:p-6" aria-labelledby="method-heading">
          <h2 id="method-heading" className="flex items-center gap-2 text-xl font-bold"><Scale size={22} className="text-[#155ca7]" aria-hidden="true" />How the score works</h2>
          <p className="mt-2 text-sm leading-6 text-[#60799f]">Each indicator earns points within a fixed range. Scores outside the range stop at zero or the maximum, so the same figures always produce the same score. The seven parts add to 100. Established size receives only 5 points; measurable progress carries more weight.</p>
          <div className="mt-4 overflow-x-auto"><table className="w-full min-w-[480px] text-left text-sm"><thead><tr className="border-b border-[#d5e4f6] text-[#35557f]"><th className="py-2">Indicator</th><th className="py-2">Maximum</th><th className="py-2">Scoring reference</th></tr></thead><tbody>{rankingCriteria.map((criterion) => <tr key={criterion.key} className="border-b border-[#edf2f9]"><th scope="row" className="py-2 font-medium">{criterion.label}</th><td className="py-2">{criterion.weight} points</td><td className="py-2 text-[#60799f]">{criterion.measure}</td></tr>)}</tbody></table></div>
        </section>
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:p-6" aria-labelledby="funding-heading">
          <h2 id="funding-heading" className="flex items-center gap-2 text-xl font-bold text-amber-950"><ShieldAlert size={22} aria-hidden="true" />Proposed allocation principle</h2>
          <p className="mt-3 text-sm leading-6 text-amber-950">Additional funding and facility time should be earned through evidenced development, effective use and delivery against agreed objectives. A historic allocation is a starting point for review, not an automatic entitlement. This is a proposed policy for discussion, not an approved GSLA rule.</p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-amber-950">
            <li>Growing sports can earn more through verified participation growth, retention, programme delivery and use of allocated space.</li>
            <li>Emerging sports should have a realistic starter allocation, clear targets and a review date, so they have a fair chance to prove demand.</li>
            <li>Compare actual facility use, waiting lists, cost, outcomes, safeguarding and access barriers before changing money or time slots.</li>
            <li>Unused allocations can be reviewed and reassigned with a recorded reason, notice and an opportunity to improve.</li>
            <li>Agree the criteria, weights, minimum access and appeal process with decision makers before making this an official policy.</li>
          </ul>
          <p className="mt-4 border-t border-amber-200 pt-3 text-xs leading-5 text-amber-900">The sample score does not contain verified facility utilisation, costs, programme quality or competitive results. It must not be converted directly into funding amounts or booking hours.</p>
        </section>
      </div>
    </div>
  );
}
