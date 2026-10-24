import { getAccess, requireFacilityAccess } from "@/lib/auth/access";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseFacilitySchedule } from "@/lib/facilitySchedule";

/**
 * GET /api/facilities
 * Fetch all facilities
 */
export async function GET() {
  const denied = await requireFacilityAccess(false);
  if (denied) return NextResponse.json({ error: denied.error }, { status: denied.status });
  try {
    const facilities = await prisma.facilities_Table.findMany();
    return NextResponse.json(facilities);
  } catch (error) {
    console.error("GET /api/facilities failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch facilities" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/facilities
 * Create a new facility
 */
export async function POST(req: Request) {
  const access = await getAccess();
  if (!access.user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!access.roles.some(role => role === "organisation_admin" || role === "facilities_admin")) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || typeof body.name !== "string" || !body.name.trim() ||
        typeof body.address !== "string" || !body.address.trim()) {
      return NextResponse.json({ error: "Name and address are required" }, { status: 400 });
    }
    const optionalText = (value: unknown) => typeof value === "string" ? value.trim() : "";
    const supportedActivities = Array.isArray(body.supported_activities)
      ? body.supported_activities.filter((value: unknown): value is string => typeof value === "string").map((value: string) => value.trim()).filter(Boolean)
      : [];
    let schedule;
    try { schedule = parseFacilitySchedule(body.opening_schedule); }
    catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid opening schedule" }, { status: 400 }); }
    const now = new Date();

    // A newly saved facility is a proposal, not an approved operational venue.
    // Keep its first revision and audit entry atomic with the draft record.
    const commandId = crypto.randomUUID();
    const created = await prisma.$transaction(async tx => {
      const facility = await tx.facilities_Table.create({
        data: {
          name: body.name.trim(),
          type: optionalText(body.type) || "Grounds",
          status: optionalText(body.status) || "Operational",
          address: body.address.trim(),
          area: optionalText(body.area),
          description: optionalText(body.description),
          contact_email: optionalText(body.contact_email),
          contact_phone: optionalText(body.contact_phone),
          centre_manager_name: optionalText(body.centre_manager_name),
          centre_manager_title: optionalText(body.centre_manager_title),
          centre_manager_email: optionalText(body.centre_manager_email),
          centre_manager_phone: optionalText(body.centre_manager_phone),
          facilities_manager_name: optionalText(body.facilities_manager_name),
          facilities_manager_email: optionalText(body.facilities_manager_email),
          supported_activities: supportedActivities,
          notes: optionalText(body.notes),
          opening_schedule: schedule,
          created__at: now,
          updated_at: now,
          approval_state: "DRAFT",
          lifecycle_state: "ACTIVE",
        },
      });
      const snapshot = JSON.parse(JSON.stringify(facility));
      const revision = await tx.facility_revisions.create({
        data: {
          facility_id: facility.id,
          content_version: 1,
          information: snapshot,
          actor_id: access.user!.id,
          actor_role: access.roles.includes("organisation_admin") ? "organisation_admin" : "facilities_admin",
          command_id: commandId,
        },
      });
      await tx.facility_audit_events.create({
        data: {
          facility_id: facility.id,
          revision_id: revision.id,
          action: "CREATE_DRAFT",
          after_state: snapshot,
          record_version: 1,
          content_version: 1,
          actor_id: access.user!.id,
          actor_role: access.roles.includes("organisation_admin") ? "organisation_admin" : "facilities_admin",
          command_id: crypto.randomUUID(),
        },
      });
      return facility;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/facilities failed:", error);
    return NextResponse.json(
      { error: "Failed to create facility", detail: "Check the approved database migration and server configuration" },
      { status: 500 }
    );
  }
}
