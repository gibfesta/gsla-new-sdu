// Illustrative records only. Replace with one authorised event data source when connected.
export const eventExamples = [
  { id: "evt-101", name: "Friday Night Stand-Up Showcase", date: "16 Jan 2026", status: "Submitted", venueId: "fac-001", venue: "Europa Sports Complex", category: "Stand-up", organiser: "Community Arts Collective", impact: "Main Hall · 10h 30m blocked" },
  { id: "evt-102", name: "Community Winter Concert", date: "24 Jan 2026", status: "Approved", venueId: "fac-001", venue: "Europa Sports Complex", category: "Concert", organiser: "Gibraltar Music Group", impact: "Main Hall · 16h blocked" },
  { id: "evt-103", name: "Local Makers Market", date: "1 Feb 2026", status: "Draft", venueId: "fac-001", venue: "Europa Sports Complex", category: "Community", organiser: "Neighbourhood Partnership", impact: "Outdoor Area · 11h blocked" },
  { id: "evt-104", name: "Cultural Evening: Dance & Food", date: "6 Dec 2025", status: "Completed", venueId: "fac-001", venue: "Europa Sports Complex", category: "Cultural", organiser: "Cultural Exchange Network", impact: "Main Hall · 13h blocked" },
] as const;
