import {NextResponse} from "next/server";
import {createSupabaseServerClient} from "@/lib/supabase/server";
export async function GET(request:Request){
 const url=new URL(request.url);const code=url.searchParams.get("code");const requested=url.searchParams.get("next");
 const allowed=["/organisation/home","/facilities/home","/set-password","/On-Hold-Pages/profile"];
 const next=requested&&allowed.includes(requested)?requested:"/organisation/home";
 if(!code)return NextResponse.redirect(new URL(next==="/set-password"?"/set-password?error=invalid-link":"/sign-in",url.origin));
 const client=await createSupabaseServerClient();const {error}=await client.auth.exchangeCodeForSession(code);
 return NextResponse.redirect(new URL(error?(next==="/set-password"?"/set-password?error=invalid-link":"/sign-in"):next,url.origin));
}
