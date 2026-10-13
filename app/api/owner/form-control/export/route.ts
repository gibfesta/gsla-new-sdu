import { NextResponse } from "next/server";
import { requireOperationalOwner, ownerResponseHeaders } from "@/lib/server/owner-access";
import { loadFormRegister } from "@/lib/form-control/register.server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
function csv(value: string) {
  const safe = /^[=+\-@\t\r]/.test(value) ? "'" + value : value;
  return '"' + safe.replace(/"/g,'""') + '"';
}
export async function GET() {
  const denied = await requireOperationalOwner();
  if (denied) return denied;
  try {
    const forms = loadFormRegister().forms;
    const lines = [["formId","displayName","area","kind","operationalStatus","connectionStatus","routes"].map(csv).join(","),
      ...forms.map(form => [form.formId,form.displayName,form.area,form.kind,form.operationalStatus,
        form.connectionStatus,form.locations.map(loc=>loc.route).join(" | ")].map(csv).join(","))];
    return new NextResponse(lines.join("\r\n"),{
      headers:{...ownerResponseHeaders,"Content-Type":"text/csv; charset=utf-8",
        "Content-Disposition":'attachment; filename="form-control-metadata.csv"'}
    });
  } catch {
    return NextResponse.json({error:"Register unavailable"},{status:503,headers:ownerResponseHeaders});
  }
}
