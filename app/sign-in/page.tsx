"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
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
      // Determine the destination before navigating, avoiding an intermediate page.
      // Department layouts still enforce access independently on the server.
      const userId = result.data.user?.id;
      if (!userId) { setError("Unable to verify your account."); return; }
      const { data: assignments, error: rolesError } = await supabase
        .from("user_roles")
        .select("role_name")
        .eq("user_id", userId);
      if (rolesError) { setError("Unable to verify your account permissions."); return; }
      const roles = new Set((assignments ?? []).map(item => item.role_name));
      const destination = roles.has("organisation_admin")
        ? "/organisation/home"
        : roles.has("facilities_admin")
          ? "/facilities/home"
          : "/access-denied";
      router.replace(destination);
      router.refresh();
    } catch {
      setError("Sign-in is temporarily unavailable.");
    } finally { setBusy(false); }
  }
  return (
    <AuthCard title="Sign in to your account">
      <form onSubmit={submit} className="space-y-5">
        <label className="block text-sm font-medium">Email<input className="mt-2 w-full rounded-lg border p-3" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label className="block text-sm font-medium">Password<input className="mt-2 w-full rounded-lg border p-3" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button disabled={busy} className="w-full rounded-lg bg-[#0C2F57] p-3 font-semibold text-white disabled:opacity-50">{busy ? "Signing in…" : "Sign in"}</button>
      </form>
      <Link href="/forgot-password" className="block text-center text-sm text-blue-700 underline">Forgot your password?</Link>
    </AuthCard>
  );
}
