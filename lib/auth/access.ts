import { createSupabaseServerClient } from "@/lib/supabase/server";

export type GslaRole = "organisation_admin" | "facilities_admin" | "centre_manager";
const validRoles: readonly string[] = ["organisation_admin", "facilities_admin", "centre_manager"];

export async function getAccess() {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return { user: null, roles: [] as GslaRole[] };
  try {
    // Roles are fetched using this user's verified Supabase session.
    // Database RLS permits each account to read only its own assignments.
    const { data, error: roleError } = await supabase
      .from("user_roles")
      .select("role_name")
      .eq("user_id", user.id);
    if (roleError) throw roleError;
    const roles = (data ?? [])
      .map(row => row.role_name)
      .filter((r): r is GslaRole => validRoles.includes(r));
    return { user, roles };
  } catch (error) {
    console.error("GSLA role verification failed", error);
    return { user, roles: [] as GslaRole[] };
  }
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
