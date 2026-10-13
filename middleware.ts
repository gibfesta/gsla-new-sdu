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
  const isOwner = pathname === "/owner" || pathname.startsWith("/owner/") || pathname.startsWith("/api/owner/");
  // Validate deployment configuration before constructing the SSR client.
  // A Preview with missing Supabase settings must fail closed, not throw at
  // middleware startup. This is not an alternative authorisation path.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let configValid = false;
  try {
    const url = new URL(supabaseUrl ?? "");
    configValid = url.protocol === "https:" && !!url.hostname &&
      typeof supabaseKey === "string" && supabaseKey.trim().length > 0;
  } catch {
    configValid = false;
  }
  if (!configValid) {
    const unavailable = isApi
      ? NextResponse.json({ error: "Service unavailable" }, { status: 503 })
      : new NextResponse("Authentication service unavailable", {
          status: 503,
          headers: { "Content-Type": "text/plain; charset=utf-8" },
        });
    unavailable.headers.set("Cache-Control", isOwner ? "private, no-store" : "no-store");
    if (isOwner) unavailable.headers.set("Vary", "Cookie");
    return unavailable;
  }
  let response = NextResponse.next({ request });
  const supabase = createServerClient(
    supabaseUrl!,
    supabaseKey!,
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
  const protectOwnerResponse = <T extends NextResponse>(result: T): T => {
    if (isOwner) {
      result.headers.set("Cache-Control", "private, no-store");
      const vary = result.headers.get("Vary");
      result.headers.set("Vary", vary ? (vary.split(",").some(value => value.trim().toLowerCase() === "cookie") ? vary : `${vary}, Cookie`) : "Cookie");
    }
    return result;
  };
  if (!error && user) return protectOwnerResponse(response);
  if (isPublicPage) return protectOwnerResponse(response);
  if (isApi) return protectOwnerResponse(NextResponse.json({ error: "Authentication required" }, { status: 401 }));
  const url = request.nextUrl.clone();
  url.pathname = pathname.startsWith("/On-Hold-Pages/") ? "/On-Hold-Pages/login" : "/sign-in";
  url.search = "";
  return protectOwnerResponse(NextResponse.redirect(url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|txt|xml|webmanifest)$).*)"],
};
