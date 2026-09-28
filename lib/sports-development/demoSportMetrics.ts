// Illustrative values shared by Participation Statistics and Sports Rankings.
// These are not verified GSLA records.

type SportKey = "All Sports" | "Football" | "Cricket" | "Athletics" | "Swimming" | "Gib Hockey";

export type SportHealthRow = {
  sport: Exclude<SportKey, "All Sports">;
  participants: number;
  yoyGrowthPct: number;
  new30d: number;
  churn30d: number;
  retentionPct: number;
  complianceFlags: number;
  activeTeams: number;
  fixturesThisMonth: number;
};

export const sportsRows: SportHealthRow[] = [
  {
    sport: "Football",
    participants: 520,
    yoyGrowthPct: 10.2,
    new30d: 210,
    churn30d: 40,
    retentionPct: 84,
    complianceFlags: 2,
    activeTeams: 34,
    fixturesThisMonth: 128,
  },
  {
    sport: "Cricket",
    participants: 240,
    yoyGrowthPct: 4.1,
    new30d: 82,
    churn30d: 26,
    retentionPct: 79,
    complianceFlags: 3,
    activeTeams: 18,
    fixturesThisMonth: 62,
  },
  {
    sport: "Athletics",
    participants: 190,
    yoyGrowthPct: -2.6,
    new30d: 58,
    churn30d: 32,
    retentionPct: 74,
    complianceFlags: 1,
    activeTeams: 12,
    fixturesThisMonth: 46,
  },
  {
    sport: "Swimming",
    participants: 110,
    yoyGrowthPct: 1.3,
    new30d: 14,
    churn30d: 12,
    retentionPct: 81,
    complianceFlags: 2,
    activeTeams: 9,
    fixturesThisMonth: 28,
  },
  {
    sport: "Gib Hockey",
    participants: 190,
    yoyGrowthPct: 7.9,
    new30d: 96,
    churn30d: 18,
    retentionPct: 86,
    complianceFlags: 0,
    activeTeams: 23,
    fixturesThisMonth: 48,
  },
];
