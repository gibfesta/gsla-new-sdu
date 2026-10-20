import { NextResponse } from "next/server";
import { requireFacilityAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store" };

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireFacilityAccess(false);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status, headers });
  const { id } = await params;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id))
    return NextResponse.json({ error: "Invalid Facility ID" }, { status: 400, headers });
  const rawPage = new URL(request.url).searchParams.get("page") ?? "1";
  const page = Number(rawPage);
  if (!/^\d+$/.test(rawPage) || !Number.isSafeInteger(page) || page < 1 || page > 10000)
    return NextResponse.json({ error: "Invalid history page" }, { status: 400, headers });
  try {
    const facility = await prisma.facilities_Table.findUnique({ where: { id }, select: { id: true } });
    if (!facility) return NextResponse.json({ error: "Facility not found" }, { status: 404, headers });
    // Use the append-only audit as a stable, bounded timeline. Linked snapshots
    // are projected explicitly; Auth subjects and internal command IDs stay private.
    const rows = await prisma.facility_audit_events.findMany({
      where: { facility_id: id },
      orderBy: [{ record_version: "desc" }, { id: "desc" }],
      skip: (page - 1) * 25, take: 26,
      select: {
        id: true, action: true, actor_role: true, occurred_at: true,
        record_version: true, content_version: true, reason: true,
        revision: { select: { content_version: true, information: true, recorded_at: true } },
        request: { select: {
          kind: true, state: true, submitted_content_version: true, snapshot: true,
          submitted_at: true, decided_at: true, submission_reason: true, decision_reason: true,
        } },
      },
    });
    return NextResponse.json({ events: rows.slice(0, 25), page, hasMore: rows.length > 25 }, { headers });
  } catch (error) {
    console.error("Facility history retrieval failed", error);
    return NextResponse.json({ error: "Could not retrieve Facility history" }, { status: 500, headers });
  }
}
