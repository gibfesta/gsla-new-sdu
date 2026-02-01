import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * GET /api/profile
 * Returns auth user + profile (if exists)
 */
export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = data.user.id;

    const profile = await prisma.profiles.findUnique({
      where: { id: userId },
    });

    return NextResponse.json({
      ok: true,
      auth: {
        id: userId,
        email: data.user.email,
      },
      profile,
    });
  } catch (err) {
    console.error("GET /api/profile failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * POST /api/profile
 * Creates the profile for the logged-in user (only once)
 */
export async function POST() {
  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.auth.getUser();

    if (error || !data.user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const userId = data.user.id;

    // Prevent duplicates
    const existing = await prisma.profiles.findUnique({
      where: { id: userId },
    });

    if (existing) {
      return NextResponse.json({ ok: true, profile: existing });
    }

    const created = await prisma.profiles.create({
      data: {
        id: userId,
        full_name: "New User",
        preferred_name: null,
        date_of_birth: null,
        email: data.user.email ?? "",
        email_verified: !!data.user.email_confirmed_at,
        phone: null,
        address_text: null,
        status: "Active",
      },
    });

    return NextResponse.json(
      { ok: true, profile: created },
      { status: 201 }
    );
  } catch (err) {
    console.error("POST /api/profile failed:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
