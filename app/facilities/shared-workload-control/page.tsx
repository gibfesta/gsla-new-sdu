import type { Metadata } from "next";
import SharedWorkloadControl from "@/components/facilities/workload/SharedWorkloadControl";
import { workloadMonth } from "@/lib/sharedWorkload";
export const metadata: Metadata = { title: "Shared Workload Control | GSLA" };
export default async function Page({ searchParams }: { searchParams: Promise<{ month?: string | string[] }> }) {
 return <SharedWorkloadControl initialMonth={workloadMonth((await searchParams).month)}/>;
}
