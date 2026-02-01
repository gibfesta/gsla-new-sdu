import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/facilities
 * Fetch all facilities
 */
export async function GET() {
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
  try {
    const body = await req.json();
    const now = new Date();

    const created = await prisma.facilities_Table.create({
      data: {
        name: body.name,
        type: body.type,
        status: body.status,
        address: body.address,
        contact_email: body.contact_email ?? null,
        contact_phone: body.contact_phone ?? null,
        notes: body.notes ?? null,

        // REQUIRED by your DB schema
        created__at: now,
        updated_at: now,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/facilities failed:", error);
    return NextResponse.json(
      { error: "Failed to create facility", detail: String(error) },
      { status: 500 }
    );
  }
}
