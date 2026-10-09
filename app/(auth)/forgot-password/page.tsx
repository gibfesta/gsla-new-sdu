"use client";
import {useState,type FormEvent} from "react";
import Link from "next/link";
import AuthCard,{inputClass,buttonClass} from "@/components/auth/AuthCard";
import {createSupabaseBrowserClient} from "@/lib/supabase/client";
export default function ForgotPasswordPage(){
 const [email,setEmail]=useState("");const [busy,setBusy]=useState(false);const [sent,setSent]=useState(false);const [error,setError]=useState("");
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setError("");try{
 const {error}=await createSupabaseBrowserClient().auth.resetPasswordForEmail(email.trim(),{redirectTo:window.location.origin+"/"});
 if(error){setError("Unable to send a reset link right now. Please try again shortly.");return;}setSent(true);
 }catch{setError("Unable to connect. Please try again.");}finally{setBusy(false);}}
 return <AuthCard title="Forgot your password?">{sent?<div role="status" className="space-y-3 text-sm text-slate-600"><p className="font-semibold text-[#0C2F57]">Check your email</p><p>If an account exists for this email address, you will receive a password reset link. Check your spam folder too.</p></div>:<><p className="text-sm text-slate-600">Enter your account email and we’ll send you a link to reset your password.</p><form onSubmit={submit} className="space-y-5"><label className="block text-sm font-medium">Email<input type="email" autoComplete="email" required className={inputClass} value={email} onChange={e=>setEmail(e.target.value)}/></label>{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={busy} className={buttonClass}>{busy?"Sending…":"Send reset link"}</button></form></>}<Link className="block text-center text-sm text-blue-700 underline" href="/sign-in">Back to sign in</Link></AuthCard>;
}
