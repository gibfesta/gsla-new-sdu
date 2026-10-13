# GSLA-M1-021 — Authenticated Role Attestation Backend Handoff

**Worker:** Senior Backend Developer · **Status:** Security review required; not accepted / not enabled.
**Baseline:** QA correction PR #63, commit `6af9d60406254a1a6cab80900057ed9e7039dfa2`.
**Implementation:** `app/api/test/role-attestation/route.ts` on `security/gsla-m1-021-role-attestation`, commit `3f3b10f755a41f034f84d232cf1599a7af0f1d69`.

## Source of identity and authority
Supabase Auth `auth.getUser()` validates the request's current signed-in user against Supabase. Trusted application role assignments come from `user_roles.role_name` queried using that verified session and `user.id`, following `lib/auth/access.ts`. Operational Owner is **separate**: `lib/server/owner-access.ts` verifies the private designated principal. No browser-supplied role, JWT user metadata, unverified session object, arbitrary header role or test fixture label determines an attested GSLA role.

## Private admission (disabled by default)
The read-only `GET /api/test/role-attestation` handler admits requests only when **all** conditions hold:
- `VERCEL_ENV=preview` (a platform deployment environment value; deny Production)
- `GSLA_TEST_ATTESTATION_ENABLED=true`, configured server-side for a controlled Preview
- `GSLA_TEST_ATTESTATION_SECRET` is a high-entropy secret with length >= 32, stored only in private Preview configuration
- Request supplies exact matching `X-GSLA-Test-Admission` header; constant-time comparison for equal-length values
- Supabase `auth.getUser()` verifies a non-anonymous authenticated user
- Exactly one trusted GSLA role assignment is returned, **or** the already established Operational Owner capability gate admits the verified session

Never expose or commit the admission secret, real user identifier, authentication storage state or credentials. This is a separate test admission secret, not an owner designation or a GSLA permission grant. A test runner must privately set its request context header in addition to its existing secure session cookies; `tests/browser/attestation.cjs` is unchanged. Owner designation and business roles are unchanged.

## Response contract
Success: HTTP 200 JSON `{schemaVersion:1,authority:"gsla-server-verified",authenticated:true,sessionValid:true,role:"<verified-role>"}`. Allowed roles: organisation_admin, facilities_admin, centre_manager, operational_owner (owner via independent gate only).
Denied: 404 when test admission disabled or invalid; 401 missing/expired/invalid Supabase session; 403 role source unavailable, no role or ambiguous roles. Unexpected errors fail closed (401). Denial bodies contain only `{error:"Attestation unavailable"}`.
All responses: `Cache-Control: private, no-store`, `Vary: Cookie, X-GSLA-Test-Admission`, `X-Content-Type-Options: nosniff`. No user UUID, emails, tokens, secrets or per-role private configuration in responses.

## Known limitations and required independent review
- An authenticated valid session with a multi-role GSLA assignment fails closed rather than arbitrarily picking a role. Review if QA needs more than one expected role per test; do not relax without approved contract change.
- Supabase `user_roles` data-boundary RLS/grants have **not** been certified by this worker. The Senior Database Engineer owns any database-security question.
- Never enable in production; keep credentialed CI OFF until security and independent QA approve the entire admission design and runtime behaviour. Preview deployment authentication may involve Vercel SSO.
- This mechanism attests role/session only, not authorization to a particular route or API. Playwright must still assert actual route/action denial separately.
- A header-bearing testing request must not export secrets in traces, network logs or artifacts. Reviewer must inspect the redaction behaviour of test tooling before activation.
- Server configuration must be refreshed/redeployed for changes, and any older preview with test access must be revoked as appropriate.
- No genuine credentialed test was executed here. No Production data was written.

## Required verification after security approval
1. Confirm the backend code compiles, scoped lint passes, and Playwright tests use a reviewed dependency lockfile on the exact commit.
2. In an isolated Preview with approved private secret, verify with real authorised sessions: correct role 200, wrong role classified FAIL, missing/expired/invalid session 401/BLOCKED, disabled/missing/incorrect secret 404/BLOCKED, unknown/ambiguous roles 403/BLOCKED.
3. Verify request headers are not logged, exported to CI artifacts, or publicly disclosed. Verify private/no-store headers across responses.
4. Verify Production always denies even if flag/secret are accidentally configured; verify Operational Owner designation has not changed.
5. Run regression tests for existing GSLA role routing and owner routes. Record sanitized evidence; independent QA accepts before credentialed automation is enabled.

## Integration handoff — OM-EMP-024
The existing `tests/browser/attestation.cjs` calls `context.request.get('/api/test/role-attestation')`. The automation engineer must ensure only the attestation request or its separate APIRequestContext carries the admission header, with private injection and artifact redaction. Do not put the secret into browser page navigation headers, logs, screenshots, or committed fixture JSON. Role labels remain expected test inputs only; server attestation response is the proof. Run only after Project Controller / security reviewer approves and provisions test secrets.
