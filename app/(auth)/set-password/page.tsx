"use client";
import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import PasswordForm from "@/components/auth/PasswordForm";
import {createSupabaseBrowserClient} from "@/lib/supabase/client";
export default function SetPasswordPage(){
 const [ready,setReady]=useState(false);const [error,setError]=useState("");const init=useRef<Promise<void>|null>(null);
 useEffect(()=>{if(init.current)return;init.current=(async()=>{try{
 const url=new URL(window.location.href);const hash=new URLSearchParams(url.hash.slice(1));const params=url.searchParams;
 if(hash.get("error")||params.get("error")){setError("This account link has expired or is no longer valid.");return;}
 const code=params.get("code");if(code){window.location.replace("/callback?code="+encodeURIComponent(code)+"&next=/set-password");return;}
 const client=createSupabaseBrowserClient();
 const tokenHash=params.get("token_hash")||hash.get("token_hash");const type=params.get("type")||hash.get("type");
 if(tokenHash&&(type==="invite"||type==="recovery")){const {error}=await client.auth.verifyOtp({token_hash:tokenHash,type});if(error)throw error;}
 else if(hash.get("access_token")&&hash.get("refresh_token")){const {error}=await client.auth.setSession({access_token:hash.get("access_token")!,refresh_token:hash.get("refresh_token")!});if(error)throw error;}
 const {data:{user},error}=await client.auth.getUser();if(error||!user)throw new Error("No session");window.history.replaceState(null,"","/set-password");setReady(true);
 }catch{setError("This account link has expired or is no longer valid.");}})();},[]);
 return <AuthCard title="Set your password">{error?<><p role="alert" className="text-sm text-red-700">{error}</p><Link className="block text-center text-sm text-blue-700 underline" href="/forgot-password">Request a new password link</Link></>:ready?<PasswordForm/>:<p role="status" className="text-center text-sm text-slate-500">Checking your account link…</p>}<Link className="block text-center text-sm text-blue-700 underline" href="/sign-in">Back to sign in</Link></AuthCard>;
}
