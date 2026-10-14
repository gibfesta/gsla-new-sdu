import { NextResponse } from "next/server";
import { getAccess } from "@/lib/auth/access";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const permitted = (roles: string[]) =>
  roles.includes("organisation_admin") || roles.includes("facilities_admin");
type SubmissionRow = {
  id: string; facility_id: string; form_id: string; form_version: number;
  payload: unknown; submitted_at: Date; submitted_by: string;
};

// Do not grant Centre Managers broad facility-wide access here.
// Assigned-venue checks must be implemented before enabling their submissions.
export async function GET(request: Request) {
  const access = await getAccess();
  if (!access.user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!permitted(access.roles)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  const facilityId = new URL(request.url).searchParams.get("facilityId");
  if (!facilityId || !uuid.test(facilityId)) return NextResponse.json({ error: "Valid facilityId is required" }, { status: 400 });
  try {
    const records = await prisma.$queryRaw<SubmissionRow[]>`
      SELECT id, facility_id, form_id, form_version, payload, submitted_by, submitted_at
      FROM public.facility_form_submissions
      WHERE facility_id = ${facilityId}::uuid
      ORDER BY submitted_at DESC LIMIT 100
    `;
    return NextResponse.json(records, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Form submission storage is not available" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const access = await getAccess();
  if (!access.user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  if (!permitted(access.roles)) return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
  let input: unknown;
  try { input = await request.json(); }
  catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!input || typeof input !== "object" || Array.isArray(input))
    return NextResponse.json({ error: "Invalid submission" }, { status: 400 });
  const data = input as Record<string, unknown>;
  if (typeof data.facilityId !== "string" || !uuid.test(data.facilityId) ||
      typeof data.formId !== "string" || !/^[a-zA-Z0-9_-]{1,120}$/.test(data.formId) ||
      !Number.isInteger(data.formVersion) || (data.formVersion as number) < 1 ||
      !data.payload || typeof data.payload !== "object" || Array.isArray(data.payload)) {
    return NextResponse.json({ error: "Invalid facility, form or payload" }, { status: 400 });
  }
  const payload = JSON.stringify(data.payload);
  if (payload.length > 60000) return NextResponse.json({ error: "Submission too large" }, { status: 413 });
  try {
    const existing = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM public."Facilities Table" WHERE id = ${data.facilityId}::uuid LIMIT 1
    `;
    if (!existing.length) return NextResponse.json({ error: "Facility not found" }, { status: 404 });
    const inserted = await prisma.$queryRaw<SubmissionRow[]>`
      INSERT INTO public.facility_form_submissions
        (facility_id, form_id, form_version, payload, submitted_by)
      VALUES
        (${data.facilityId}::uuid, ${data.formId}, ${data.formVersion}::integer,
         ${payload}::jsonb, ${access.user.id}::uuid)
      RETURNING id, facility_id, form_id, form_version, payload, submitted_by, submitted_at
    `;
    return NextResponse.json(inserted[0], { status: 201, headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ error: "Form submission storage is not available" }, { status: 503 });
  }
}
