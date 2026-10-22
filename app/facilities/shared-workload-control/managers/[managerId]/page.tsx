import { notFound } from "next/navigation";
import SharedWorkloadControl from "@/components/facilities/workload/SharedWorkloadControl";
import { MANAGERS, workloadMonth } from "@/lib/sharedWorkload";
export default async function Page({ params, searchParams }: { params: Promise<{ managerId: string }>; searchParams: Promise<{ month?: string | string[] }> }) {
 const { managerId } = await params;
 if (!MANAGERS.some(manager => manager.id === managerId)) notFound();
 return <SharedWorkloadControl key={managerId} managerId={managerId} initialMonth={workloadMonth((await searchParams).month)}/>;
}
