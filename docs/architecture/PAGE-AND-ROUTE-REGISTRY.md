# GSLA WebApp — Page & Route Registry

**Purpose:** Authoritative inventory of current application pages, route handlers, route ownership, access boundary and redirect compatibility rules.  
**Baseline:** 2026-10-11 · GSLA-M0-003  
**Source:** Recursive GitHub `main` tree, current department layouts/middleware, API route guards and `next.config.ts`.

## Inventory summary

- **84 current UI page files** (`app/**/page.tsx`)
- **5 current route-handler files** (`app/**/route.ts`)
- **41 configured redirects** in `next.config.ts`

This registry records what exists. It does **not** certify that every page is production-ready or that every workflow is database-backed.

## Access baseline

The current source establishes these broad boundaries:

- Middleware defaults internal routes to authenticated access.
- Organisation routes require `organisation_admin`.
- Facilities routes require `organisation_admin` or `facilities_admin`.
- Human Resources, Sports Development and Finance currently require `organisation_admin`; dedicated department roles are not configured yet.
- Centre Managers do not currently receive Facilities route access from the department layout; they remain on the awaiting-assignment path until a facility-assignment model is implemented.
- API access is separately enforced by route/server logic where documented.
- A folder name such as `(public)` does not itself grant public access; middleware behaviour is authoritative.

## UI page registry

### Planned owner routes — not included in current counts

[M1-014 Owner Form Control](OWNER-FORM-CONTROL.md) proposes `/owner`, `/owner/form-control`, `/owner/form-control/[formId]` and owner-guarded read/detail/optional-export APIs under `/api/owner/form-control`. These are design contracts, not current/deployed routes. Admission is independent of normal GSLA role inheritance; page/layout and data endpoints must each enforce it. [Discovery evidence](OWNER-FORM-CONTROL-DISCOVERY.md) records the newer source-page baseline for inventory reconciliation; it does not certify deployed route counts or grant access to unlinked forms.

### Planned Facilities approval routes — not included in current counts

The [M1-009 architecture](FACILITIES-APPROVAL-WORKFLOW.md) proposes an Organisation-only `/organisation/facility-approvals` review page and explicit Facilities initial-approval, archive-request, request-withdrawal, decision and history API endpoints. These are design contracts only, not current routes. The existing create/edit/archive page URLs remain. Update the deployed registry/counts only when implementation adds the routes and access tests provide evidence.

| Route | Source file | Owner / purpose | Current access | Status |
| --- | --- | --- | --- | --- |
| `/access-denied` | `app/(auth)/access-denied/page.tsx` | Authentication — Restricted-access response | Public by middleware | Existing |
| `/auth/awaiting-assignment` | `app/(auth)/auth/awaiting-assignment/page.tsx` | Authentication — Centre Manager awaiting venue assignment | Public by middleware (/auth/*) | Existing |
| `/auth/continue` | `app/(auth)/auth/continue/page.tsx` | Authentication — Post-login role routing | Public by middleware (/auth/*) | Existing |
| `/change-password` | `app/(auth)/change-password/page.tsx` | Authentication — Change password | Authenticated | Existing |
| `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | Authentication — Request password recovery | Public by middleware | Existing |
| `/reset-password` | `app/(auth)/reset-password/page.tsx` | Authentication — Password reset | Public by middleware | Existing |
| `/set-password` | `app/(auth)/set-password/page.tsx` | Authentication — Set password | Public by middleware | Existing |
| `/sign-in` | `app/(auth)/sign-in/page.tsx` | Authentication — Sign in | Public by middleware | Existing |
| `/join` | `app/(public)/join/page.tsx` | Public / Join — Join / public demonstration form | Authenticated by middleware (despite (public) source group) | Existing |
| `/On-Hold-Pages/login` | `app/On-Hold-Pages/login/page.tsx` | On-Hold / Public legacy — On-hold legacy/public account page | Public by middleware | On Hold |
| `/On-Hold-Pages/profile` | `app/On-Hold-Pages/profile/page.tsx` | On-Hold / Public legacy — On-hold legacy/public account page | Authenticated user with recognised role | On Hold |
| `/On-Hold-Pages/signup` | `app/On-Hold-Pages/signup/page.tsx` | On-Hold / Public legacy — On-hold legacy/public account page | Public by middleware | On Hold |
| `/auth/page-preview` | `app/auth/page-preview/page.tsx` | Authentication — Authentication UI preview | Public by middleware (/auth/*) | Preview / review needed |
| `/facilities/bookings` | `app/facilities/bookings/page.tsx` | Facilities — Facilities — Bookings | Organisation or Facilities Administrator | Existing |
| `/facilities/cm-assignments` | `app/facilities/cm-assignments/page.tsx` | Facilities — Facilities — Cm Assignments | Organisation or Facilities Administrator | Existing |
| `/facilities/compliance` | `app/facilities/compliance/page.tsx` | Facilities — Facilities — Compliance | Organisation or Facilities Administrator | Existing |
| `/facilities/daily-operations` | `app/facilities/daily-operations/page.tsx` | Facilities — Facilities — Daily Operations | Organisation or Facilities Administrator | Existing |
| `/facilities/duty-team` | `app/facilities/duty-team/page.tsx` | Facilities — Facilities — Duty Team | Organisation or Facilities Administrator | Existing |
| `/facilities/events-control/[eventId]/archive` | `app/facilities/events-control/[eventId]/archive/page.tsx` | Facilities — Facilities — Events Control — [eventId] — Archive | Organisation or Facilities Administrator | Existing dynamic page |
| `/facilities/events-control/[eventId]/edit` | `app/facilities/events-control/[eventId]/edit/page.tsx` | Facilities — Facilities — Events Control — [eventId] — Edit | Organisation or Facilities Administrator | Existing dynamic page |
| `/facilities/events-control/[eventId]` | `app/facilities/events-control/[eventId]/page.tsx` | Facilities — Facilities — Events Control — [eventId] | Organisation or Facilities Administrator | Existing dynamic page |
| `/facilities/events-control/new` | `app/facilities/events-control/new/page.tsx` | Facilities — Facilities — Events Control — New | Organisation or Facilities Administrator | Existing |
| `/facilities/events-control` | `app/facilities/events-control/page.tsx` | Facilities — Facilities — Events Control | Organisation or Facilities Administrator | Existing |
| `/facilities/facilities-directory/[facilityId]/archive` | `app/facilities/facilities-directory/[facilityId]/archive/page.tsx` | Facilities — Facilities — Facilities Directory — [facilityId] — Archive | Organisation or Facilities Administrator | Existing dynamic page |
| `/facilities/facilities-directory/[facilityId]/edit` | `app/facilities/facilities-directory/[facilityId]/edit/page.tsx` | Facilities — Facilities — Facilities Directory — [facilityId] — Edit | Organisation or Facilities Administrator | Existing dynamic page |
| `/facilities/facilities-directory/[facilityId]/events/[eventId]` | `app/facilities/facilities-directory/[facilityId]/events/[eventId]/page.tsx` | Facilities — Facilities — Facilities Directory — [facilityId] — Events — [eventId] | Organisation or Facilities Administrator | Existing dynamic page |
| `/facilities/facilities-directory/[facilityId]/issues` | `app/facilities/facilities-directory/[facilityId]/issues/page.tsx` | Facilities — Facilities — Facilities Directory — [facilityId] — Issues | Organisation or Facilities Administrator | Existing dynamic page |
| `/facilities/facilities-directory/[facilityId]` | `app/facilities/facilities-directory/[facilityId]/page.tsx` | Facilities — Facilities — Facilities Directory — [facilityId] | Organisation or Facilities Administrator | Existing dynamic page |
| `/facilities/facilities-directory/new` | `app/facilities/facilities-directory/new/page.tsx` | Facilities — Facilities — Facilities Directory — New | Organisation or Facilities Administrator | Existing |
| `/facilities/facilities-directory` | `app/facilities/facilities-directory/page.tsx` | Facilities — Facilities — Facilities Directory | Organisation or Facilities Administrator | Existing |
| `/facilities/forms-and-procedures` | `app/facilities/forms-and-procedures/page.tsx` | Facilities — Facilities — Forms And Procedures | Organisation or Facilities Administrator | Existing |
| `/facilities/forms` | `app/facilities/forms/page.tsx` | Facilities — Facilities — Forms | Organisation or Facilities Administrator | Existing |
| `/facilities/home` | `app/facilities/home/page.tsx` | Facilities — Facilities — Home | Organisation or Facilities Administrator | Existing |
| `/facilities/maintenance-&-issues` | `app/facilities/maintenance-&-issues/page.tsx` | Facilities — Facilities — Maintenance & Issues | Organisation or Facilities Administrator | Existing |
| `/facilities` | `app/facilities/page.tsx` | Facilities — Facilities | Organisation or Facilities Administrator | Redirect-only entry page |
| `/facilities/procedures-&-sop` | `app/facilities/procedures-&-sop/page.tsx` | Facilities — Facilities — Procedures & Sop | Organisation or Facilities Administrator | Existing |
| `/facilities/reports-&-history` | `app/facilities/reports-&-history/page.tsx` | Facilities — Facilities — Reports & History | Organisation or Facilities Administrator | Existing |
| `/facilities/shared-calendar` | `app/facilities/shared-calendar/page.tsx` | Facilities — Facilities — Shared Calendar | Organisation or Facilities Administrator | Existing |
| `/finance/dashboard` | `app/finance/dashboard/page.tsx` | Finance — Finance — Dashboard | Organisation Administrator only (current layout) | Existing |
| `/finance` | `app/finance/page.tsx` | Finance — Finance | Organisation Administrator only (current layout) | Redirect-only entry page |
| `/human-resources/dashboard` | `app/human-resources/dashboard/page.tsx` | Human Resources — Human Resources — Dashboard | Organisation Administrator only (current layout) | Existing |
| `/human-resources/employees/[id]` | `app/human-resources/employees/[id]/page.tsx` | Human Resources — Human Resources — Employees — [id] | Organisation Administrator only (current layout) | Existing dynamic page |
| `/human-resources/employees` | `app/human-resources/employees/page.tsx` | Human Resources — Human Resources — Employees | Organisation Administrator only (current layout) | Existing |
| `/human-resources/leave` | `app/human-resources/leave/page.tsx` | Human Resources — Human Resources — Leave | Organisation Administrator only (current layout) | Existing |
| `/human-resources` | `app/human-resources/page.tsx` | Human Resources — Human Resources | Organisation Administrator only (current layout) | Redirect-only entry page |
| `/human-resources/timesheets` | `app/human-resources/timesheets/page.tsx` | Human Resources — Human Resources — Timesheets | Organisation Administrator only (current layout) | Existing |
| `/human-resources/timesheets/settings` | `app/human-resources/timesheets/settings/page.tsx` | Human Resources — Human Resources — Timesheets — Settings | Organisation Administrator only (current layout) | Existing |
| `/human-resources/timesheets/weeks/[id]` | `app/human-resources/timesheets/weeks/[id]/page.tsx` | Human Resources — Human Resources — Timesheets — Weeks — [id] | Organisation Administrator only (current layout) | Existing dynamic page |
| `/human-resources/timesheets/weeks` | `app/human-resources/timesheets/weeks/page.tsx` | Human Resources — Human Resources — Timesheets — Weeks | Organisation Administrator only (current layout) | Existing |
| `/organisation/health` | `app/organisation/health/page.tsx` | Organisation — Organisation — Health | Organisation Administrator | Existing |
| `/organisation/home` | `app/organisation/home/page.tsx` | Organisation — Organisation — Home | Organisation Administrator | Existing |
| `/organisation` | `app/organisation/page.tsx` | Organisation — Organisation | Organisation Administrator | Redirect-only entry page |
| `/organisation/reports/operations` | `app/organisation/reports/operations/page.tsx` | Organisation — Organisation — Reports — Operations | Organisation Administrator | Existing |
| `/organisation/reports/overview` | `app/organisation/reports/overview/page.tsx` | Organisation — Organisation — Reports — Overview | Organisation Administrator | Existing |
| `/organisation/system/import-export` | `app/organisation/system/import-export/page.tsx` | Organisation — Organisation — System — Import Export | Organisation Administrator | Existing |
| `/organisation/system/info` | `app/organisation/system/info/page.tsx` | Organisation — Organisation — System — Info | Organisation Administrator | Existing |
| `/organisation/system/mail` | `app/organisation/system/mail/page.tsx` | Organisation — Organisation — System — Mail | Organisation Administrator | Existing |
| `/organisation/system/manage` | `app/organisation/system/manage/page.tsx` | Organisation — Organisation — System — Manage | Organisation Administrator | Existing |
| `/organisation/system/reminders` | `app/organisation/system/reminders/page.tsx` | Organisation — Organisation — System — Reminders | Organisation Administrator | Existing |
| `/organisation/users/add` | `app/organisation/users/add/page.tsx` | Organisation — Organisation — Users — Add | Organisation Administrator | Existing |
| `/organisation/users/new` | `app/organisation/users/new/page.tsx` | Organisation — Organisation — Users — New | Organisation Administrator | Existing |
| `/organisation/users` | `app/organisation/users/page.tsx` | Organisation — Organisation — Users | Organisation Administrator | Existing |
| `/` | `app/page.tsx` | Application entry — Application entry / auth-link handling then Organisation Home | Public by middleware | Entry page / client redirect logic |
| `/profile` | `app/profile/page.tsx` | Shared profile — Internal user profile | Authenticated | Existing |
| `/sports-development/associations/form-b` | `app/sports-development/associations/form-b/page.tsx` | Sports Development Unit — Sports Development — Associations — Form B | Organisation Administrator only (current layout) | Existing |
| `/sports-development/associations/form-c` | `app/sports-development/associations/form-c/page.tsx` | Sports Development Unit — Sports Development — Associations — Form C | Organisation Administrator only (current layout) | Existing |
| `/sports-development/associations/forms` | `app/sports-development/associations/forms/page.tsx` | Sports Development Unit — Sports Development — Associations — Forms | Organisation Administrator only (current layout) | Existing |
| `/sports-development/associations/registration` | `app/sports-development/associations/registration/page.tsx` | Sports Development Unit — Sports Development — Associations — Registration | Organisation Administrator only (current layout) | Existing |
| `/sports-development/dashboard` | `app/sports-development/dashboard/page.tsx` | Sports Development Unit — Sports Development — Dashboard | Organisation Administrator only (current layout) | Existing |
| `/sports-development/leagues/[leagueId]` | `app/sports-development/leagues/[leagueId]/page.tsx` | Sports Development Unit — Sports Development — Leagues — [leagueId] | Organisation Administrator only (current layout) | Existing dynamic page |
| `/sports-development/leagues/[leagueId]/teams/add` | `app/sports-development/leagues/[leagueId]/teams/add/page.tsx` | Sports Development Unit — Sports Development — Leagues — [leagueId] — Teams — Add | Organisation Administrator only (current layout) | Existing dynamic page |
| `/sports-development/leagues/add` | `app/sports-development/leagues/add/page.tsx` | Sports Development Unit — Sports Development — Leagues — Add | Organisation Administrator only (current layout) | Existing |
| `/sports-development/leagues` | `app/sports-development/leagues/page.tsx` | Sports Development Unit — Sports Development — Leagues | Organisation Administrator only (current layout) | Existing |
| `/sports-development` | `app/sports-development/page.tsx` | Sports Development Unit — Sports Development | Organisation Administrator only (current layout) | Redirect-only entry page |
| `/sports-development/ranking` | `app/sports-development/ranking/page.tsx` | Sports Development Unit — Sports Development — Ranking | Organisation Administrator only (current layout) | Existing |
| `/sports-development/reports` | `app/sports-development/reports/page.tsx` | Sports Development Unit — Sports Development — Reports | Organisation Administrator only (current layout) | Existing |
| `/sports-development/sports/[sport]/coaches` | `app/sports-development/sports/[sport]/coaches/page.tsx` | Sports Development Unit — Sports Development — Sports — [sport] — Coaches | Organisation Administrator only (current layout) | Existing dynamic page |
| `/sports-development/sports/[sport]/governance` | `app/sports-development/sports/[sport]/governance/page.tsx` | Sports Development Unit — Sports Development — Sports — [sport] — Governance | Organisation Administrator only (current layout) | Existing dynamic page |
| `/sports-development/sports/[sport]` | `app/sports-development/sports/[sport]/page.tsx` | Sports Development Unit — Sports Development — Sports — [sport] | Organisation Administrator only (current layout) | Existing dynamic page |
| `/sports-development/sports/[sport]/participants` | `app/sports-development/sports/[sport]/participants/page.tsx` | Sports Development Unit — Sports Development — Sports — [sport] — Participants | Organisation Administrator only (current layout) | Existing dynamic page |
| `/sports-development/sports/[sport]/teams` | `app/sports-development/sports/[sport]/teams/page.tsx` | Sports Development Unit — Sports Development — Sports — [sport] — Teams | Organisation Administrator only (current layout) | Existing dynamic page |
| `/sports-development/sports` | `app/sports-development/sports/page.tsx` | Sports Development Unit — Sports Development — Sports | Organisation Administrator only (current layout) | Existing |
| `/sports-development/teams/add` | `app/sports-development/teams/add/page.tsx` | Sports Development Unit — Sports Development — Teams — Add | Organisation Administrator only (current layout) | Existing |
| `/sports-development/teams` | `app/sports-development/teams/page.tsx` | Sports Development Unit — Sports Development — Teams | Organisation Administrator only (current layout) | Existing |

## Route-handler registry

| Route | Source file | Purpose | Current access | Status / note |
| --- | --- | --- | --- | --- |
| `/callback` | `app/(auth)/callback/route.ts` | Exchange Supabase auth code for session | Public callback | Existing handler; runtime/security verification still governed separately |
| `/api/facilities/[id]` | `app/api/facilities/[id]/route.ts` | Read / update / delete facility | Organisation or Facilities Administrator via server guard | Existing handler; runtime/security verification still governed separately |
| `/api/facilities` | `app/api/facilities/route.ts` | List / create facilities | Organisation or Facilities Administrator via server guard | Existing handler; runtime/security verification still governed separately |
| `/api/me/permissions` | `app/api/me/permissions/route.ts` | Return current user's Organisation access flag | Authenticated | Existing handler; runtime/security verification still governed separately |
| `/api/profile` | `app/api/profile/route.ts` | Read / create authenticated user's profile | Authenticated | Existing handler; runtime/security verification still governed separately |

## Redirect registry

| Legacy / source route | Canonical destination | Type | Disposition |
| --- | --- | --- | --- |
| `/awaiting-venue` | `/auth/awaiting-assignment` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/superuser` | `/organisation/home` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/superuser/dashboard` | `/organisation/home` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/superuser/:path*` | `/organisation/:path*` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/facilities/dashboard` | `/facilities/home` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/facilities/facilities/:path*` | `/facilities/facilities-directory/:path*` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/facilities/facilities` | `/facilities/facilities-directory` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/facilities/events/:path*` | `/facilities/events-control/:path*` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/facilities/events` | `/facilities/events-control` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/facilities/maintenance` | `/facilities/maintenance-&-issues` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/facilities/procedures` | `/facilities/procedures-&-sop` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/facilities/reports` | `/facilities/reports-&-history` | Permanent | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin` | `/organisation/home` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/dashboard` | `/organisation/reports/overview` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/superuser-dashboard` | `/organisation/home` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/accounts` | `/finance/dashboard` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/sdu` | `/sports-development/dashboard` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/hr/:path*` | `/human-resources/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/human-resources/:path*` | `/human-resources/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/facilities/:path*` | `/facilities/facilities-directory/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/bookings` | `/facilities/bookings` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/calendar` | `/facilities/shared-calendar` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/events/:path*` | `/facilities/events-control/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/sports/:path*` | `/sports-development/sports/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/sports-development-unit/:path*` | `/sports-development/sports/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/association/registration` | `/sports-development/associations/registration` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/form-b` | `/sports-development/associations/form-b` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/form-c` | `/sports-development/associations/form-c` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/forms` | `/sports-development/associations/forms` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/statistics` | `/sports-development/reports` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/manage/leagues/:path*` | `/sports-development/leagues/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/manage/teams/:path*` | `/sports-development/teams/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/manage/users/:path*` | `/organisation/users/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/manage/:path*` | `/organisation/system/manage/:path*` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/users/new` | `/organisation/users/new` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/profile` | `/profile` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/reminders` | `/organisation/system/reminders` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/mail` | `/organisation/system/mail` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/info` | `/organisation/system/info` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/admin/import-export` | `/organisation/system/import-export` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |
| `/auth/callback` | `/callback` | Temporary | Compatibility / migration redirect; retain until audited and approved for removal |

## Redirect-only source pages confirmed

These source pages exist only to forward their base department URL to the current landing page:

- `/facilities` → `/facilities/home`
- `/human-resources` → `/human-resources/dashboard`
- `/sports-development` → `/sports-development/dashboard`
- `/finance` → `/finance/dashboard`
- `/organisation` → `/organisation/home`

The root `/` is a special client entry page: it handles auth-link fragments/query parameters and otherwise routes to `/organisation/home`.

## Findings requiring follow-up

1. **`/auth/page-preview` is publicly reachable.** Middleware treats all `/auth/*` paths as public. This preview route should be deliberately retained, protected or moved/removed in a separate approved task.
2. **`/join` is not public in runtime middleware.** Although its source sits under `app/(public)/join`, middleware does not include `/join` in the public allow-list. It currently requires authentication. Decide whether that is intended.
3. **Dashboard naming remains inconsistent outside Facilities/Organisation.** Human Resources, Sports Development and Finance still use canonical `/dashboard` landing routes at this baseline.
4. **On-Hold-Pages remain routable.** Login and signup are public by middleware; the on-hold profile has its own authenticated role layout. Their presence is intentional until a separate cleanup decision.
5. **Legacy redirects remain active.** No redirect removal is authorised by this inventory.
6. **Dynamic page existence is not workflow verification.** Routes containing `[facilityId]`, `[eventId]`, `[id]`, `[leagueId]` and `[sport]` require valid records/parameters and separate runtime acceptance testing.
7. **Route access is broader than business-policy approval in some areas.** Current code boundaries are recorded here, but the Data Ownership & Access Matrix remains the business-policy authority once approved.

## Route governance rules

1. New routes must have an owner, purpose, authorised roles and implementation status.
2. Do not place a new page directly under `app/` without checking module ownership.
3. Route groups such as `(auth)` and `(public)` do not change public URLs and do not independently define security.
4. Rename or move existing routes with a compatibility redirect when bookmarks/callers may still exist.
5. Authentication is not authorisation. Enforce role and record/facility scope at server/API/database boundaries.
6. Keep on-hold pages distinct from active canonical workflows.
7. Update this registry in the same task as any meaningful route addition, removal, move or redirect change.
8. Do not remove a legacy redirect until destination, dependencies, runtime traffic/use and role restrictions are verified and removal is approved.

## GSLA-M0-003 completion note

This registry is now exhaustive for current `app/**/page.tsx` and `app/**/route.ts` files visible in the recursive `main` tree at the baseline date, plus every redirect declared in the current `next.config.ts`.

“Exhaustive” here means source-route inventory, not production workflow certification. Runtime behaviour, data integration, role correctness and redirect retirement remain separate controlled work.
