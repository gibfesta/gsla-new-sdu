import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type OwnerCheck = { allowed: true } | { allowed: false; status: 401 | 403 | 503 };

export function ownerConfigurationValid() {
  const raw = process.env.GSLA_OPERATIONAL_OWNER_SUBJECT_ID;
  return process.env.GSLA_OWNER_CONTROL_ENABLED === "true" &&
    process.env.GSLA_OWNER_ACCESS_MODE === "designated-account" &&
    typeof raw === "string" && UUID.test(raw) && raw !== "00000000-0000-0000-0000-000000000000";
}

export async function checkOperationalOwner(): Promise<OwnerCheck> {
  if (!ownerConfigurationValid()) return { allowed: false, status: 503 };
  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user || user.is_anonymous === true) return { allowed: false, status: 401 };
    if (user.id.toLowerCase() !== process.env.GSLA_OPERATIONAL_OWNER_SUBJECT_ID!.toLowerCase()) {
      return { allowed: false, status: 403 };
    }
    return { allowed: true };
  } catch {
    return { allowed: false, status: 401 };
  }
}

export async function requireOperationalOwner() {
  const check = await checkOperationalOwner();
  if (check.allowed) return null;
  const error = check.status === 503 ? "Service unavailable" :
    check.status === 401 ? "Authentication required" : "Access denied";
  return NextResponse.json({ error }, {
    status: check.status,
    headers: { "Cache-Control": "private, no-store", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" }
  });
}

export const ownerResponseHeaders = {
  "Cache-Control": "private, no-store",
  "Vary": "Cookie",
  "X-Content-Type-Options": "nosniff"
};
