import { directoryAssociations } from "@/components/sports-development/associationsDirectory";

const ACTIVITY_LABELS: Record<string, string> = {
  "billiards-snooker": "Billiards & Snooker",
  "brazilian-jiu-jitsu": "Brazilian Jiu-Jitsu",
  "esports-video-gaming": "Esports & Video Gaming",
  "jet-ski": "Jet Skiing",
  "ju-jitsu": "Ju-Jitsu",
  "lifesaving": "Lifesaving Sport",
  "sub-aqua": "Sub-Aqua",
  "marocatlas-4x4": "4×4 Off-Road Driving",
  "paamoa": "Physical Activities for Older Adults (PAAMOA)",
};
export const ACTIVITY_OPTIONS = directoryAssociations
  .map(({ slug }) => ({
    id: slug,
    label: ACTIVITY_LABELS[slug] ?? slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export function normalizeActivity(value: string): string {
  const association = directoryAssociations.find((item) => item.name === value || item.slug === value);
  return association ? ACTIVITY_OPTIONS.find((item) => item.id === association.slug)!.label : value;
}
