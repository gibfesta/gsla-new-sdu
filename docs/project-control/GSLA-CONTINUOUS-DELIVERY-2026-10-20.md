# Continuous Facilities delivery — interim receipt

Date: 2026-10-20. Executor: Project Controller / general implementation support.
Related existing tasks: M1-010, M1-011, M1-012, M1-013, M2-001. Existing implementation PR: #74. No independent specialist acceptance claimed.

## Verified baseline

- Repository main HEAD: `322345a015e03326eef5e38307c5f67ee8483b9f`.
- PR #49 merged; #71–#74 open drafts. #74 inspected at `c61c17a683e6d254e097b1462202f583017fb76f`.
- Vercel deployment `dpl_631581Uj2o19XRxcwfjdfgsWAxen` READY, matching that #74 commit and its Preview branch. READY is build evidence only.
- Vercel environment metadata confirms DATABASE_URL/DIRECT_URL are sensitive Preview variables restricted to the #74 branch. Supabase Auth configuration is shared across Preview/Production; no values are recorded here and no configuration changed.
- Supabase staging branch reports MIGRATIONS_FAILED despite containing Facilities and its three workflow tables. All four have RLS enabled. Workflow constraints report validated; append-only/evidence/delete guards exist. No anon/authenticated table grants returned. These catalog observations are not negative-access certification.
- Staging has zero Facilities, requests, revisions, audit events and Auth users; no public.user_roles or public._prisma_migrations. Separate application Auth and database configuration must be verified together; missing staging Auth alone does not establish an application login defect.
- Development has user_roles and Prisma migration history, but no Facilities approval_state column. No Development or Production writes performed.
- Authenticated Vercel connector fetch of `/api/facilities` failed with deployment_authentication_required, HTTP 401 after redirect. This is a platform access blocker, not an observed application denial. No local Vercel CLI/authentication is available in this checkout.

## Implementation performed

Added role-gated GET `/api/facilities/[id]/history`, bounded 25-entry pagination and explicit timeline projection with linked submitted/revision snapshots. Denials precede database reads. Responses are private/no-store; generic infrastructure errors do not disclose database details. Auth subject/command identifiers are excluded from top-level event projection; preserved snapshots remain admin-only.

Added Facility history to saved information with decisions, reasons, versions and expandable preserved snapshots. Approval/lifecycle labels are distinct from operational status and rely on text rather than colour.

## Validation performed

- `npm ci --no-audit --no-fund`: PASS; Prisma client generated.
- `npx tsc --noEmit`: PASS.
- Targeted ESLint on new history route and changed TSX files: PASS.
- `npm run build`: PASS, including history route; existing middleware-convention/Browserslist warnings remain.
- `node tests/automated/facility-history.cjs`: PASS. Mocked route checks cover 401/403 before DB access, UUID/page validation, 404, facility-scoped pagination, no-store and sanitised 500. Not a database round-trip or real role-session test.
- React review: bounded list, stable event keys, abortable fetch, loading/error states, native accessible buttons/details, text status labels. Browser visual QA remains pending.

## Outstanding acceptance gaps

No authenticated workflow, live save/read, concurrent command, direct database denial or independent QA PASS is claimed. Deployment protection remains enabled. Existing #74 still needs complete architecture reconciliation: create/decision retry semantics, incomplete draft validation, protected unknown-field rejection, preparation versus operational query projections, pending revision handling and archive-request supersession during edits. Source command presence alone is insufficient.

Staging migration provenance and branch failure must be reconciled against the single Prisma migration authority before any Development cutover. No migration history entries were fabricated and no schema/reset/merge operation performed.

## Blocker and next execution

Obtain an authorised testing path through the protected Preview and private existing synthetic role sessions. Do not paste passwords or session values into GitHub/Breeze/chat. Verify the Auth issuer/role source and staging Prisma target together. Continue architecture corrections and real staging tests, then seek independent M1-013 acceptance. Keep #74 draft and all affected completion gates open.

Specialist Role Compliance: not claimed; implementation support and observed checks only. No merge, Production deployment, privilege change or security-protection change approved or performed in this receipt.
