import { NextRequest, NextResponse } from "next/server";
import { requireOperationalOwner, ownerResponseHeaders } from "@/lib/server/owner-access";
import { loadFormRegister } from "@/lib/form-control/register.server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export async function GET(req: NextRequest) {
  const denied = await requireOperationalOwner();
  if (denied) return denied;
  try {
    const params = req.nextUrl.searchParams;
    const page = Number(params.get("page") ?? "1");
    const limit = Number(params.get("limit") ?? "50");
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: "Invalid pagination" }, { status: 400, headers: ownerResponseHeaders });
    }
    const query = (params.get("q") ?? "").trim().toLowerCase();
    const area = params.get("area") ?? "";
    if (query.length > 120 || area.length > 120) return NextResponse.json({error:"Invalid filter"}, {status:400,headers:ownerResponseHeaders});
    const register = loadFormRegister();
    const forms = register.forms.filter(x => (!area || x.area === area) &&
      (!query || (x.displayName + " " + x.formId + " " + x.locations.map(l => l.route).join(" ")).toLowerCase().includes(query)));
    const offset = (page - 1) * limit;
    return NextResponse.json({schemaVersion:register.schemaVersion,sourceCommit:register.sourceCommit,coverageNote:register.coverageNote,total:forms.length,page,limit,forms:forms.slice(offset,offset+limit)}, { headers: ownerResponseHeaders });
  } catch {
    return NextResponse.json({error:"Register unavailable"}, {status:503,headers:ownerResponseHeaders});
  }
}
