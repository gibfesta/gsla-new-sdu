# GSLA-M1-003 — Organisation Administrator Access Verification

**Task:** GSLA-M1-003  
**Milestone:** M1 — Core Platform, Authentication & Permissions  
**Policy baseline:** `docs/data-ownership-and-access.md` v0.2  
**Verification status:** Source verification complete; runtime role verification still required

## Approved policy under test

Organisation Administrator has full rights across the GSLA WebApp, including all departments and underlying HR/Finance data, with Create, Read, Edit, Approve, Archive/Delete and Export rights unless a later explicit exception is approved.

## Source verification results

| Area | Current source behaviour | Result |
| --- | --- | --- |
| Organisation routes | `app/organisation/layout.tsx` requires `organisation_admin` | PASS |
| Facilities routes | `app/facilities/layout.tsx` permits `organisation_admin` or `facilities_admin` | PASS |
| HR routes | `app/human-resources/layout.tsx` currently permits `organisation_admin` only | PASS for Organisation Admin |
| SDU routes | `app/sports-development/layout.tsx` currently permits `organisation_admin` only | PASS for Organisation Admin |
| Finance routes | `app/finance/layout.tsx` currently permits `organisation_admin` only | PASS for Organisation Admin |
| Facilities API read/write | `requireFacilityAccess()` permits `organisation_admin` | PASS |
| Organisation permission API | `/api/me/permissions` reports Organisation access from `organisation_admin` | PASS |
| Profile API | Authenticated-user scoped; no Organisation-only restriction needed | PASS for current scope |
| Post-login routing | `/auth/continue` sends Organisation Admin to `/organisation/home` | PASS |
| Sign-in routing | Client destination prefers `organisation_admin` and sends to `/organisation/home` | PASS |
| Anonymous internal access | Middleware default-denies internal pages and APIs | PASS in source |

## Negative-boundary source checks

- Facilities Administrator is rejected by `app/organisation/layout.tsx`.
- Centre Manager is rejected by `app/organisation/layout.tsx`.
- Anonymous users are redirected by middleware before protected page access.
- Anonymous API requests receive an authentication failure path.
- Being signed in without `organisation_admin` is not sufficient for Organisation route access.

## Findings

1. The current route-layout model is consistent with the approved Organisation Administrator full-rights policy for the departments implemented today.
2. Organisation Administrator is explicitly allowed through the current Facilities API guard.
3. HR, SDU and Finance currently have no dedicated department roles configured, so Organisation Administrator is the only role allowed by those department layouts.
4. The repository currently has no automated authentication/authorisation test framework; `tests/` contains only a placeholder README.
5. The root `/` page redirects to `/organisation/home` for ordinary visits. Non-Organisation users therefore rely on the Organisation layout to reject access if they arrive through the root. This is secure in source but not an ideal role-aware entry experience.
6. This task does not certify database-level RLS/grants. Database security remains within GSLA-M1-005 / GSLA-M1-006.

## Runtime verification still required

Before this task can be marked Done, verify on the deployed environment:

### Organisation Administrator
- Sign in and land on `/organisation/home`.
- Directly open representative pages under Organisation, Facilities, HR, SDU and Finance.
- Confirm representative permitted actions load without an authorisation failure.
- Confirm `GET /api/facilities` succeeds.
- Confirm Organisation-only pages do not unexpectedly redirect to Access Denied.

### Facilities Administrator negative test
- Directly open `/organisation/home` and representative `/organisation/*` pages.
- Expected: redirect to `/access-denied`.

### Centre Manager negative test
- Directly open `/organisation/home` and representative `/organisation/*` pages.
- Expected: redirect to `/access-denied`.

### Anonymous negative test
- Directly open `/organisation/home`.
- Expected: redirect to `/sign-in`.
- Request `/api/facilities`.
- Expected: HTTP 401 JSON authentication error.

## Completion rule

M1-003 may move to Review / Verification only after the runtime checks above are evidenced. Source inspection alone is not sufficient for final completion.
