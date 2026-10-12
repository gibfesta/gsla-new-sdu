import { requireFacilityAccess } from "@/lib/auth/access";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { type Prisma } from "@prisma/client";
import { parseFacilitySchedule } from "@/lib/facilitySchedule";

async function findFacility(id: string) {
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  return prisma.facilities_Table.findFirst({ where: { id } });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireFacilityAccess(false);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });
  try {
    const facility = await findFacility((await params).id);
    return facility ? NextResponse.json(facility) : NextResponse.json({ error: "Facility not found" }, { status: 404 });
  } catch (error) {
    console.error("Failed to fetch facility", error);
    return NextResponse.json({ error: "Failed to fetch facility" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireFacilityAccess(true);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });
  try {
    const facility = await findFacility((await params).id);
    if (!facility) return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid facility data" }, { status: 400 });
    const data: Record<string, string | string[] | Date | Prisma.InputJsonValue> = { updated_at: new Date() };
    const textFields = ["name", "type", "status", "address", "area", "description", "contact_email", "contact_phone", "centre_manager_name", "centre_manager_title", "centre_manager_email", "centre_manager_phone", "facilities_manager_name", "facilities_manager_email", "notes"];
    for (const field of textFields) {
      if (!(field in body)) continue;
      const required = ["name", "type", "status", "address", "area"].includes(field);
      if ((body[field] !== null && typeof body[field] !== "string") || (required && !body[field]?.trim())) return NextResponse.json({ error: `Invalid ${field}` }, { status: 400 });
      data[field] = body[field]?.trim() ?? "";
    }
    if ("supported_activities" in body) {
      if (!Array.isArray(body.supported_activities) || !body.supported_activities.every((value: unknown) => typeof value === "string")) return NextResponse.json({ error: "Supported activities must be a list of names" }, { status: 400 });
      data.supported_activities = [...new Set<string>(body.supported_activities.map((value: string) => value.trim()).filter(Boolean))];
    }
    if ("opening_schedule" in body) {
      try { data.opening_schedule = parseFacilitySchedule(body.opening_schedule); }
      catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid opening schedule" }, { status: 400 }); }
    }
    await prisma.facilities_Table.updateMany({ where: { id: facility.id }, data });
    return NextResponse.json(await findFacility(facility.id));
  } catch (error) {
    console.error("Failed to update facility", error);
    return NextResponse.json({ error: "Failed to update facility" }, { status: 500 });
  }
}

export async function DELETE() {
  // Hard deletion is disabled until the approved Organisation Administrator
  // archive-approval workflow has been implemented and tested.
  // Do not silently erase facility records or circumvent approval.
  const { getAccess } = await import("@/lib/auth/access");
  const access = await getAccess();
  if (!access.user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!access.roles.includes("organisation_admin")) {
    return NextResponse.json({ error: "Organisation Administrator approval is required to archive a facility" }, { status: 403 });
  }
  return NextResponse.json(
    { error: "Facility archival is not yet implemented. Permanent deletion has been disabled." },
    { status: 409 }
  );
}
