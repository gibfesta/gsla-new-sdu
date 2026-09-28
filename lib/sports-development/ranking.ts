import { sportsRows, type SportHealthRow } from "./demoSportMetrics";

// Illustrative policy weights and fixed reference ranges. These must be reviewed
// with the SDU before any score is used to inform a funding decision.
export const rankingCriteria = [
  { key: "participation", label: "Participation", weight: 5, measure: "Participants / 500, capped at 500" },
  { key: "growth", label: "Yearly growth", weight: 30, measure: "−5% to +15% growth" },
  { key: "retention", label: "Retention", weight: 20, measure: "60% to 95% retention" },
  { key: "newcomers", label: "New participation", weight: 15, measure: "New participants in 30 days / total participants, capped at 35%" },
  { key: "teams", label: "Team opportunities", weight: 10, measure: "Teams per 100 participants, capped at 12" },
  { key: "activity", label: "Competition activity", weight: 10, measure: "Fixtures per team this month, capped at 4" },
  { key: "compliance", label: "Compliance", weight: 10, measure: "10 points for no flags; 7 for one; 4 for two; 0 for three or more" },
] as const;

export type Criterion = (typeof rankingCriteria)[number]["key"];
export type RankingRow = { sport: SportHealthRow; total: number; scores: Record<Criterion, number> };

const capped = (value: number) => Math.max(0, Math.min(1, value));

export function scoreSport(sport: SportHealthRow): RankingRow {
  const scores: Record<Criterion, number> = {
    participation: 5 * capped(sport.participants / 500),
    growth: 30 * capped((sport.yoyGrowthPct + 5) / 20),
    retention: 20 * capped((sport.retentionPct - 60) / 35),
    newcomers: 15 * capped(sport.participants ? (sport.new30d / sport.participants) / 0.35 : 0),
    teams: 10 * capped(sport.participants ? (sport.activeTeams / sport.participants) * 100 / 12 : 0),
    activity: 10 * capped(sport.activeTeams ? (sport.fixturesThisMonth / sport.activeTeams) / 4 : 0),
    compliance: sport.complianceFlags === 0 ? 10 : sport.complianceFlags === 1 ? 7 : sport.complianceFlags === 2 ? 4 : 0,
  };
  return { sport, scores, total: Object.values(scores).reduce((sum, value) => sum + value, 0) };
}

export const demoRanking = sportsRows.map(scoreSport).sort((a, b) => b.total - a.total || a.sport.sport.localeCompare(b.sport.sport));
