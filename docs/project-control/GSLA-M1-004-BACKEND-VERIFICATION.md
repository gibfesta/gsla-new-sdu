# GSLA-M1-004 — Backend Access Verification Evidence
Date: 2026-10-12
Role: Senior Backend Developer
Status: In Progress — authenticated runtime verification incomplete

## Approved policy
Source: docs/data-ownership-and-access.md (Active M1 / Facilities v0.2).
Facilities Administrator: Facilities-wide access, but Organisation Administrator must approve new facilities and their archival. Other departments and Organisation-only pages are restricted.

## Inspected application enforcement
- lib/auth/access.ts: verifies Supabase user and queries user_roles with that user's session; missing roles fail closed.
- middleware.ts: unauthenticated internal page requests redirect to /sign-in, API requests return 401 in code.
- app/facilities/layout.tsx: admits organisation_admin or facilities_admin.
- app/organisation/layout.tsx, app/sports-development/layout.tsx, app/human-resources/layout.tsx, app/finance/layout.tsx: organisation_admin only.
- app/(auth)/sign-in/page.tsx: uses role-based destination selection; layout/API checks are authoritative, not navigation.
- app/api/facilities/route.ts: GET and POST use requireFacilityAccess.
- app/api/facilities/[id]/route.ts: GET and PATCH use requireFacilityAccess.
- app/api/me/permissions/route.ts: organisation flag derives from verified session roles.

## Backend correction
Commit 3b94a762cf5ef0e3085be252d968abcaab8dd1c4: permanently destructive DELETE operation was disabled pending a genuine archival workflow; anonymous request returns 401, authenticated non-Organisation Admin returns 403, Organisation Admin returns 409 until archive workflow is implemented. These are **code-path expectations only**, not successful live test results. No facility row was changed, and no new business permission was granted.

## Remaining policy/implementation mismatch
POST /api/facilities currently creates a facility record without an approved proposed -> pending -> Organisation-approved workflow. This requires a schema/state transition design, history and approval handling. Do not invent semantics by overloading the current Operational/Limited/Closed status field. Refer to Software Architect for lifecycle model and Senior Database Engineer for schema/RLS grants after approved architecture. Backend implementation follows those approvals.

## Runtime testing
No authenticated Facilities Admin/Centre Manager/Organisation Admin browser sessions or tokens are available to this worker's connected tools. Therefore these actual live requests were NOT run:
- Facilities Admin: direct Facilities pages and GET/POST/PATCH (safe disposable fixture)
- Facilities Admin: deny /organisation/home, /finance/dashboard, /human-resources/dashboard, /sports-development/dashboard
- Centre Manager: deny generic Facilities administration pages and current Facilities API
- Anonymous: redirect on protected pages and 401 on facilities API
- Organisation Admin: permissions and DELETE fail-closed (409) under authenticated session

An unauthenticated direct network request attempt from execution environment failed without HTTP response, so it cannot be counted as a negative-access test.

## Test preconditions
Use authorised browser test sessions or a secure test harness in a designated development environment; never share passwords or access tokens in the chat. Once available, record exact request, role, expected/observed status, fixture ID, evidence and cleanup. Avoid making destructive production mutations.

## Non-certifications
No RLS or database-grant inspection/certification was performed; those belong to Senior Database Engineer. No business approval matrix change was made. No system architecture approved on behalf of Software Architect. A Vercel build success, if obtained, does not replace role-based runtime testing.

## Work receipt status
Partial backend specialist execution; complete only after authenticated positive and negative tests and after approval lifecycle correction acceptance. 
