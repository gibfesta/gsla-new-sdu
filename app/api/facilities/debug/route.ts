import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check DB identity + user
    const ident = await prisma.$queryRaw<
      Array<{ db: string; user: string; schema: string }>
    >`select current_database() as db, current_user as "user", current_schema() as schema`;

    // Check row count (quoted table name because it has a space)
    const count = await prisma.$queryRaw<Array<{ n: bigint }>>`
      select count(*)::bigint as n from "Facilities Table"
    `;

    // Also fetch the first row to prove data
    const sample = await prisma.$queryRaw<any[]>`
      select * from "Facilities Table" order by 1 desc limit 5
    `;

    return NextResponse.json({
      ident: ident[0],
      rowCount: Number(count[0]?.n ?? 0),
      sample,
    });
  } catch (err: any) {
    console.error("facilities debug failed:", err);
    return NextResponse.json(
      {
        error: "Debug query failed",
        message: String(err?.message ?? err),
      },
      { status: 500 }
    );
  }
}
