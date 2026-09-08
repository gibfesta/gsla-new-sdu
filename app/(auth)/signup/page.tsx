"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMsg(null);

    const origin = window.location.origin;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // IMPORTANT: confirmation email will come back here,
        // and then we redirect to /profile
        emailRedirectTo: `${origin}/auth/callback?next=/profile`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If email confirmations are ON, user must click the email link first.
    if (!data.session) {
      setMsg(
        "Signup successful. Check your email to confirm your account, then you'll be redirected to your profile."
      );
      return;
    }

    // If confirmations are OFF, you're logged in immediately.
    router.refresh();
    router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Sign up</h1>

      <form onSubmit={onSignup} className="mt-4 space-y-3">
        <div>
          <label className="text-sm font-semibold">Email</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 p-2"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label className="text-sm font-semibold">Password</label>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 p-2"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
            required
            minLength={6}
          />
          <div className="mt-1 text-xs text-slate-500">Minimum 6 characters.</div>
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}
        {msg ? <div className="text-sm text-green-700">{msg}</div> : null}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <div className="text-sm text-slate-600">
          Already have an account?{" "}
          <a className="underline" href="/login">
            Log in
          </a>
        </div>
      </form>
    </div>
  );
}
