"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // This helps ensure cookies are set and middleware can see them
    router.refresh();

    // Go test /api/profile
    router.push("/profile");
  }

  return (
    <div className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={onLogin} className="mt-4 space-y-3">
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
            autoComplete="current-password"
            required
          />
        </div>

        {error ? <div className="text-sm text-red-600">{error}</div> : null}

        <button
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-sm text-slate-600">
          Don’t have an account yet? (We’ll add signup next.)
        </p>
      </form>

      <div className="mt-6 text-sm">
        After logging in, open{" "}
        <a className="underline" href="/api/profile">
          /api/profile
        </a>{" "}
        to confirm auth works.
      </div>
    </div>
  );
}
