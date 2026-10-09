import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

/**
 * Default-deny authentication boundary for GSLA internal routes.
 * Department and facility-specific authorization is enforced separately by
 * server layouts and API handlers; being signed in never grants global access.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isPublicPage = pathname === "/" || pathname === "/sign-in" ||
    ["/forgot-password", "/set-password", "/reset-password", "/On-Hold-Pages/login", "/On-Hold-Pages/signup"].includes(pathname) || pathname === "/access-denied" || pathname.startsWith("/auth/") ||
    pathname === "/callback";
  const isApi = pathname === "/api" || pathname.startsWith("/api/");
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (!error && user) return response;
  if (isPublicPage) return response;
  if (isApi) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  const url = request.nextUrl.clone();
  url.pathname = pathname.startsWith("/On-Hold-Pages/") ? "/On-Hold-Pages/login" : "/sign-in";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|txt|xml|webmanifest)$).*)"],
};
