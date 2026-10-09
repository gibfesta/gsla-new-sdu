"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      const supabase = createSupabaseBrowserClient();
      const result = await supabase.auth.signInWithPassword({ email, password });
      if (result.error) { setError("Unable to sign in. Check your details."); return; }
      router.replace("/facilities/home");
      router.refresh();
    } catch {
      setError("Sign-in is temporarily unavailable.");
    } finally { setBusy(false); }
  }
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm space-y-5">
        <div className="text-center">
          <div className="relative mx-auto mb-4 h-24 w-60 max-w-full">
            <Image src="/gsla-transp-logo.png" alt="GSLA" fill sizes="240px" className="object-cover" priority />
          </div>
          <h1 className="text-2xl font-bold text-[#0C2F57]">GSLA WebApp</h1>
          <p className="mt-2 text-slate-600">Sign in to your account</p>
        </div>
        <label className="block text-sm font-medium">Email<input className="mt-2 w-full rounded-lg border p-3" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="block text-sm font-medium">Password<input className="mt-2 w-full rounded-lg border p-3" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-[#0C2F57] p-3 font-semibold text-white disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}
