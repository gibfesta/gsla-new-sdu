import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const facility = await prisma.facilities_Table.findFirst({
      where: { id: params.id },
    });

    if (!facility) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(facility);
  } catch (error: any) {
    console.error("GET /api/facilities/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch facility", detail: String(error?.message ?? error) },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    // Only update fields that were sent (prevents accidental null overwrites)
    const data: Record<string, any> = { updated_at: new Date() };

    if ("name" in body) data.name = body.name;
    if ("type" in body) data.type = body.type;
    if ("status" in body) data.status = body.status;
    if ("address" in body) data.address = body.address;

    if ("contact_email" in body) data.contact_email = body.contact_email ?? null;
    if ("contact_phone" in body) data.contact_phone = body.contact_phone ?? null;
    if ("notes" in body) data.notes = body.notes ?? null;

    const result = await prisma.facilities_Table.updateMany({
      where: { id: params.id },
      data,
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const updated = await prisma.facilities_Table.findFirst({
      where: { id: params.id },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("PATCH /api/facilities/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to update facility", detail: String(error?.message ?? error) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const result = await prisma.facilities_Table.deleteMany({
      where: { id: params.id },
    });

    if (result.count === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE /api/facilities/[id] failed:", error);
    return NextResponse.json(
      { error: "Failed to delete facility", detail: String(error?.message ?? error) },
      { status: 500 }
    );
  }
}
