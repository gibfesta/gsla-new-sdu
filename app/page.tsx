"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function HomePage() {
  const router = useRouter();
  const [invitation, setInvitation] = useState(false);
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const flow = hash.get("type");
    const hasToken = hash.has("access_token") || hash.has("token_hash");
    const isInvite = flow === "invite" || flow === "recovery";
    const authError = hash.get("error_description");
    if (authError) {
      setInvitation(true);
      setError(decodeURIComponent(authError.replace(/\+/g, " ")));
      setReady(true);
      return;
    }
    if (!isInvite && !hasToken) {
      router.replace("/organisation/home");
      return;
    }
    setInvitation(true);
    let active = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session) setReady(true);
    });
    void supabase.auth.getSession().then(({ data, error: sessionError }) => {
      if (!active) return;
      if (sessionError || !data.session) setError("Invitation not yet verified. Open a fresh invitation link.");
      setReady(true);
    });
    return () => { active = false; subscription.unsubscribe(); };
  }, [router]);

  async function setNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < 16) { setError("Use a password with at least 16 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setSaving(true); setError("");
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (updateError) { setError(updateError.message); return; }
    window.history.replaceState({}, "", "/");
    router.replace("/facilities/home");
    router.refresh();
  }

  if (!invitation) return <main className="min-h-screen bg-slate-50" aria-label="Loading GSLA WebApp" />;
  return <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
    <section className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-bold text-[#0C2F57]">Activate your GSLA account</h1>
      <p className="text-slate-600">Choose your private password to finish setting up your account.</p>
      {error && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {ready && !error && <form onSubmit={setNewPassword} className="space-y-4">
        <label className="block text-sm font-semibold">New password<input type="password" minLength={16} required autoComplete="new-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
        <label className="block text-sm font-semibold">Confirm password<input type="password" minLength={16} required autoComplete="new-password" value={confirm} onChange={e=>setConfirm(e.target.value)} className="mt-2 w-full rounded-lg border p-3" /></label>
        <button disabled={saving} className="w-full rounded-lg bg-[#0C2F57] p-3 font-semibold text-white disabled:opacity-50">{saving ? "Saving…" : "Set password"}</button>
      </form>}
      <a href="/sign-in" className="block text-sm text-blue-700 underline">Go to sign in</a>
    </section>
  </main>;
}
