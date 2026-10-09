import { NextResponse } from "next/server";
import { getAccess } from "@/lib/auth/access";

export async function GET() {
  const { user, roles } = await getAccess();
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  return NextResponse.json({ canAccessOrganisation: roles.includes("organisation_admin") }, {
    headers: { "Cache-Control": "no-store" },
  });
}
