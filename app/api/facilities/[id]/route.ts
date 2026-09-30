import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { facilitiesVenues } from "@/components/facilities/venues";

async function findFacility(id: string) {
  const legacy = facilitiesVenues.find((venue) => venue.id === id);
  if (legacy) return prisma.facilities_Table.findFirst({ where: { name: legacy.name } });
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null;
  return prisma.facilities_Table.findFirst({ where: { id } });
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const facility = await findFacility((await params).id);
    return facility ? NextResponse.json(facility) : NextResponse.json({ error: "Facility not found" }, { status: 404 });
  } catch (error) {
    console.error("Failed to fetch facility", error);
    return NextResponse.json({ error: "Failed to fetch facility" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const facility = await findFacility((await params).id);
    if (!facility) return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return NextResponse.json({ error: "Invalid facility data" }, { status: 400 });
    const data: Record<string, string | string[] | Date> = { updated_at: new Date() };
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
    await prisma.facilities_Table.updateMany({ where: { id: facility.id }, data });
    return NextResponse.json(await findFacility(facility.id));
  } catch (error) {
    console.error("Failed to update facility", error);
    return NextResponse.json({ error: "Failed to update facility" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const facility = await findFacility((await params).id);
    if (!facility) return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    await prisma.facilities_Table.deleteMany({ where: { id: facility.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete facility", error);
    return NextResponse.json({ error: "Failed to delete facility" }, { status: 500 });
  }
}
