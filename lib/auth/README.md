# GSLA authentication and access

This area contains shared authentication and authorisation helpers used by the GSLA WebApp.

## Current model

- Identity is provided by Supabase Auth.
- `lib/auth/access.ts` reads the verified Supabase user and current `user_roles` assignments.
- Department layouts enforce role boundaries independently of navigation visibility.
- Facilities API handlers use shared server-side access checks.
- Client sign-out is implemented through the shared `components/auth/SignOutButton.tsx` component.

## Sign-out contract

For all current authenticated roles:

1. Call Supabase browser `auth.signOut()`.
2. On success, redirect to `/sign-in`.
3. Refresh navigation state so authenticated UI is cleared.
4. Verify protected routes cannot be reopened without signing in again.

Current account roles:
- Organisation Administrator
- Facilities Administrator
- Centre Manager

Sign-out is exposed in the shared authenticated account banner/profile flow and directly on the Centre Manager awaiting-assignment screen.

Authentication establishes identity only. Role, department and venue scope must still be enforced separately at server/API/database boundaries.
