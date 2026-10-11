import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const origin = request.nextUrl.origin;
  const requested = request.nextUrl.searchParams.get("next");
  const passwordRecovery = requested === "/set-password" || requested === "/reset-password";
  const errorUrl = new URL(passwordRecovery ? "/set-password?error=invalid-link" : "/sign-in", origin);
  if (!code) return NextResponse.redirect(errorUrl);

  const destination = new URL(passwordRecovery ? "/set-password" : "/auth/continue", origin);
  let response = NextResponse.redirect(destination);
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookies) {
          cookies.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.redirect(destination);
          cookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return NextResponse.redirect(errorUrl);
  return response;
}
