import "server-only";
import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { checkOperationalOwner } from "@/lib/server/owner-access";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const headers = {
  "Cache-Control": "private, no-store",
  "Vary": "Cookie, X-GSLA-Test-Admission",
  "X-Content-Type-Options": "nosniff",
};
const roleNames = new Set(["organisation_admin", "facilities_admin", "centre_manager"]);
function reply(status: number) {
  // No identifiers, token echoes, or role details in denial responses.
  return NextResponse.json({ error: "Attestation unavailable" }, { status, headers });
}
function admitted(request: NextRequest): boolean {
  // Both switches must be explicitly enabled. Never serve from a production
  // deployment, regardless of its server environment variables.
  if (process.env.VERCEL_ENV !== "preview" ||
      process.env.GSLA_TEST_ATTESTATION_ENABLED !== "true") return false;
  const expected = process.env.GSLA_TEST_ATTESTATION_SECRET;
  const received = request.headers.get("x-gsla-test-admission");
  if (!expected || expected.length < 32 || !received) return false;
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(received, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(request: NextRequest) {
  if (!admitted(request)) return reply(404);
  try {
    const supabase = await createSupabaseServerClient();
    // getUser performs server-side verification with Supabase Auth.
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user || user.is_anonymous === true) return reply(401);

    // Operational Owner is NOT a GSLA role; its independent gate is authoritative.
    const owner = await checkOperationalOwner();
    if (owner.allowed) {
      return NextResponse.json({
        schemaVersion: 1, authority: "gsla-server-verified",
        authenticated: true, sessionValid: true, role: "operational_owner",
      }, { headers });
    }

    const { data, error: rolesError } = await supabase.from("user_roles")
      .select("role_name").eq("user_id", user.id);
    if (rolesError) return reply(403);
    const assigned = [...new Set((data ?? [])
      .map(row => row.role_name)
      .filter((name): name is string => typeof name === "string" && roleNames.has(name)))];
    // Ambiguous or absent role assignments may not produce an attested PASS.
    if (assigned.length !== 1) return reply(403);

    return NextResponse.json({
      schemaVersion: 1, authority: "gsla-server-verified",
      authenticated: true, sessionValid: true, role: assigned[0],
    }, { headers });
  } catch {
    return reply(401);
  }
}
