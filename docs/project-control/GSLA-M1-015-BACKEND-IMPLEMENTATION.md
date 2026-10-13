# GSLA-M1-015 — Backend Implementation and Verification Ledger
Date: 2026-10-13
Worker: Senior Backend Developer
Authority: M1-014 accepted architecture at commit 0710f77f1fa0a544893087576ec2ef99054432be
Issue: #54 / Breeze M1-015

## Implemented source
- `lib/server/owner-access.ts`: independent server-only Operational Owner policy; requires enabled flag, designated-account mode, valid UUID, verified `supabase.auth.getUser()` identity, and non-anonymous Supabase account. No role inheritance, email comparison, header authority, or public identifier.
- `app/(auth)/auth/continue/page.tsx`: server owner-first continuation then existing GSLA roles.
- `app/(auth)/sign-in/page.tsx`: sign-in redirects to server continuation instead of relying on browser role lookup.
- `app/owner/layout.tsx`: independent owner admission; fail-closed redirect for non-owner/unavailable.
- `app/owner/form-control/page.tsx`, `app/owner/form-control/[formId]/page.tsx`: additional per-RSC owner verification before metadata read; minimal read-only integration surfaces.
- `app/api/owner/form-control/route.ts`, `[formId]/route.ts`, `export/route.ts`: owner check before any metadata load, bounded pagination/filter validation, generic 404 and error responses, no-store/private JSON and CSV export, CSV formula-escape.
- `lib/form-control/register.server.ts`, `types.ts`, `config/form-control/register.json`: static validated server-only metadata contract; intentionally empty seed, not a completed universal inventory.
- `components/app-shell/AppShell.tsx`: owner path bypasses GSLA department chrome.
- `middleware.ts`: owner responses private/no-store with Cookie vary; no owner admission by middleware alone.

## Server configuration (private, no actual identifiers in documentation)
Provision in secure deployment environment only:
- `GSLA_OWNER_CONTROL_ENABLED=true`
- `GSLA_OWNER_ACCESS_MODE=designated-account`
- `GSLA_OPERATIONAL_OWNER_SUBJECT_ID` = exactly one verified Supabase account UUID
Do not use NEXT_PUBLIC_ variables. If unset/invalid/disabled, owner API returns generic 503 before reading metadata; owner UI denies admission.

**IMPORTANT:** Designation is NOT provisioned in this implementation task. Positive owner login requires an authorized deployment administrator to configure it securely. No configuration value is committed.

## Acceptance evidence matrix
| Case | Code implementation / expectation | Runtime evidence |
|---|---|---|
| O01–O08 | Identity verification, role-independent owner gate, continuation, owner layout, API protection | **Pending authenticated execution** |
| O16–O18 | Server validates metadata from static read-only manifest, bounded parameters, safe export | **Pending UI integration/QA** |
| O20–O21 | Revocation by toggling configuration and restarting affected deployments, no-store and fresh per-request identity checks | **Pending live revocation/account-switch tests** |
| OA / Facilities Admin / CM | Must fail owner admission unless precisely the designated principal, regardless of roles | **Pending different-subject sessions** |
| Anonymous / expired / forged | No verified subject => denied; supplied headers/metadata ignored | **Pending runtime probes** |
| Child route / RSC / API / export | Every handler or page rechecks capability before register read | **Pending direct URL and network tests** |
| Typecheck / build | Automated Vercel deployment generated from pushes | **Check exact final deployment SHA and status; do not infer PASS from queue** |
| Privacy scan | No real UUID/email in changed source or manifest; only variable name and generic errors | Static source inspected; full bundle/log scan pending |

## Verification and safety boundaries
No database, RLS/grant, form-submission, catalogue localStorage or business-role changes. The master manifest is a clearly labelled seed; M1-016 must populate and reconcile source/default/browser forms. This task does not certify completeness.

Browser logout uses the existing Supabase SignOutButton and server owner checks are performed afresh after signout, but runtime cache/account-switch/revocation testing is mandatory. Owner access can only be enabled by securing a private config in the active deployment; changes must be propagated to all accessible prior/preview deployments and verified against the old principal.

## Required next verification
1. Independently verify exact deployed commit and successful Vercel build; run explicit TypeScript and lint checks in a checked-out CI/dev runner.
2. Securely configure one non-personal test owner principal (or authorised designated principal) without publishing subject ID.
3. Execute owner positive case plus ordinary Organisation Admin / Facilities Admin / Centre Manager / anonymous, invalid and forged sessions against every direct URL, RSC navigation, JSON and export endpoint; preserve status/header evidence without recording secrets.
4. Toggle missing/malformed/mode-disabled designation and confirm generic fail-closed results. Test logout, rapid account switch, no-store and old-owner revocation across all accessible deployments.
5. M1-016: populate reviewed metadata inventory, inspect unknown/custom forms without accessing live submitted answers.
6. M1-017: independent full O01–O21 acceptance review.
