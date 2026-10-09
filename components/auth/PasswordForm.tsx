"use client";
import {useState,type FormEvent} from "react";
import Link from "next/link";
import {inputClass,buttonClass} from "./AuthCard";
import {createSupabaseBrowserClient} from "@/lib/supabase/client";
export default function PasswordForm({change=false,preview=false}:{change?:boolean;preview?:boolean}){
 const [current,setCurrent]=useState("");const [password,setPassword]=useState("");const [confirm,setConfirm]=useState("");const [busy,setBusy]=useState(false);const [error,setError]=useState("");const [done,setDone]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();if(preview)return;setError("");if(password.length<16){setError("Please use at least 16 characters.");return;}if(password!==confirm){setError("The passwords do not match.");return;}setBusy(true);try{
 const client=createSupabaseBrowserClient();const {data:{user},error:authError}=await client.auth.getUser();if(authError||!user){setError("Your session has expired. Please request a new reset link or sign in again.");return;}
 if(change){if(!user.email){setError("This account does not have an email address. Contact your administrator.");return;}const {error}=await client.auth.signInWithPassword({email:user.email,password:current});if(error){setError("Your current password is incorrect. Please try again.");return;}}
 const {error}=await client.auth.updateUser({password});if(error){setError("Your password could not be saved. Use a different password or request a new reset link.");return;}setDone(true);
 }catch{setError("Unable to connect. Please try again.");}finally{setBusy(false);}}
 if(done)return <div className="space-y-5"><p role="status" className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Your password has been saved successfully.</p><Link className={buttonClass+" block text-center"} href="/facilities/home">Continue to the app</Link></div>;
 return <form onSubmit={submit} className="space-y-5">{change&&<label className="block text-sm font-medium">Current password<input type="password" autoComplete="current-password" required className={inputClass} value={current} onChange={e=>setCurrent(e.target.value)}/></label>}<label className="block text-sm font-medium">New password<input type="password" autoComplete="new-password" minLength={16} required className={inputClass} value={password} onChange={e=>setPassword(e.target.value)}/></label><p className="text-xs text-slate-500">Use at least 16 characters. A memorable phrase works well.</p><label className="block text-sm font-medium">Confirm new password<input type="password" autoComplete="new-password" minLength={16} required className={inputClass} value={confirm} onChange={e=>setConfirm(e.target.value)}/></label>{error&&<p role="alert" className="text-sm text-red-700">{error}</p>}<button disabled={busy||preview} className={buttonClass}>{busy?"Saving…":"Save password"}</button></form>;
}
