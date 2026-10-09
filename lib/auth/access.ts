import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type GslaRole = "organisation_admin" | "facilities_admin" | "centre_manager";
const validRoles: readonly string[] = ["organisation_admin", "facilities_admin", "centre_manager"];

export async function getAccess() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null, roles: [] as GslaRole[] };
  const assignments = await prisma.user_roles.findMany({ where: { user_id: user.id }, select: { role_name: true } });
  const roles = assignments.map(a => a.role_name).filter((r): r is GslaRole => validRoles.includes(r));
  return { user, roles };
}

export async function requireFacilityAccess(write = false) {
  const access = await getAccess();
  if (!access.user) return { status: 401, error: "Sign in required" };
  const allowed = write
    ? access.roles.some(r => r === "organisation_admin" || r === "facilities_admin")
    : access.roles.some(r => r === "organisation_admin" || r === "facilities_admin");
  if (!allowed) return { status: 403, error: "Insufficient permissions" };
  return null;
}
