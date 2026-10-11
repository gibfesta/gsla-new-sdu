# GSLA WebApp — Legacy Admin / SuperUser Redirect Audit
Date: 2026-10-11
Status: READ-ONLY REVIEW; NO ROUTE REMOVALS APPROVED

## Scope and limitations
Reviewed the 31 redirect declarations whose source begins with `/admin` or `/superuser` in `next.config.ts` (28 admin + 3 superuser). Verified selected concrete destinations with direct GitHub file reads. The connected repository search does not provide an exhaustive source tree or reliable reference search, so **no rule is certified unused**. Dynamic-route destinations are not considered verified merely because a corresponding index page exists.

## Verified destinations (index pages exist)
- `/organisation/home` (previously verified)
- `/organisation/reports/overview`
- `/finance/dashboard`
- `/facilities/bookings`
- `/facilities/events-control`
- `/organisation/users/new`
- `/organisation/system/manage`
- `/organisation/system/reminders`
- `/organisation/system/mail`
- `/organisation/system/info`
- `/organisation/system/import-export`
- `/sports-development/sports`

## Findings requiring attention
1. **High — Broad facility rewrite:** `/admin/facilities/:path*` maps everything into `/facilities/facilities-directory/:path*`. An old facility-management subpage might not correspond to a facility directory child. Verify each old concrete route before treating this as safe.
2. **High — Broad superuser rewrite:** `/superuser/:path*` maps to `/organisation/:path*`; many possible destinations need not exist. It is also a permanent redirect (browser-cached).
3. **Medium — Overlapping legacy patterns:** Specific `/admin/manage/leagues/:path*`, `/admin/manage/teams/:path*`, `/admin/manage/users/:path*`, and broad `/admin/manage/:path*` need path-matching tests and ordering verification.
4. **Medium — Generic profile route:** `/admin/profile` targets a shared `/profile` page, not an Organisation-owned profile. That is deliberate only if per-user identity/security checks hold. The restored internal profile page exists but must be tested for every role.
5. **Medium — Destination existence is not behaviour verification:** `/admin/dashboard` maps to `/organisation/reports/overview` rather than `/organisation/home`. Confirm this intentional mapping.
6. **Pending — User/link dependencies:** GitHub indexed search returned no matches for sampled legacy URL strings, but cannot prove zero references. Check source tree, runtime navigation, bookmarks and event/form generated links before removal.

## Recommended disposition
- **Keep while auditing**: all 31 rules, until exhaustive dependency inventory exists. No immediate benefit from deleting unverified legacy redirects.
- **Investigate first**: facility wildcard, superuser wildcard, admin dashboard mapping, overlapping admin manage rules.
- **Preserve canonical routes**: `/organisation/home`, `/facilities/home`, `/auth/awaiting-assignment`.
- **Security**: redirect itself is not an authorisation policy; canonical destinations and APIs require server-side checks. Test anonymous/Facilities Admin/Centre Manager/Organisation Admin access.
- **Cleanup approval gate**: only retire a redirect once its destination, active references, live traffic and role restrictions are verified.

## Next steps
1. Export full recursive `app/` source tree from GitHub checkout or an API capable of listing the Git tree.
2. Extract all Link href, router.push/replace, redirect, fetch, form actions and generated URLs; resolve static and dynamic patterns.
3. Build a row-per-route dependency register with file paths and line numbers, including APIs.
4. Test 301/302 chains, unmatched destinations and access controls across all roles.
5. Present remove/change/retain decisions for approval. Implement only after approval.

## Dependency review update — 2026-10-11

### Files directly inspected
The following source files were retrieved from GitHub and searched for literal references to old `/admin`, `/superuser`, `/awaiting-venue`, and `/auth/callback` addresses:

- `components/app-shell/Sidebar.tsx`
- `components/app-shell/HeaderBar.tsx`
- `components/facilities/FacilitiesDepartmentSidebar.tsx`
- `components/facilities/FacilitiesSidebar.tsx`
- `components/sports-development/SportsDevelopmentSidebar.tsx`
- `components/human-resources/HumanResourcesSidebar.tsx`
- `components/finance/FinanceSidebar.tsx`
- `components/shared/DepartmentPageFrame.tsx`
- `components/shared/BannerAccount.tsx`
- `app/page.tsx`
- `app/sign-in/page.tsx`
- `app/auth/continue/page.tsx`

**Result:** No matching legacy URL strings were found in these 12 inspected files. The legacy addresses remain configured in `next.config.ts` and may occur elsewhere.

### Confirmed blocker to full dependency certification
- GitHub connected code search returned zero even for known-present strings/files. This is not evidence of zero usage.
- No recursive repository tree/listing action is currently exposed through the connected GitHub integration.
- Attempting Vercel's deployed source-tree listing returned `404 File tree not found`.
- A direct Git clone from the analysis runtime was unavailable because external DNS/network access was blocked.

Therefore the full repository tree and **all** link references have **not** been collected. Do not remove any redirect based solely on this review.

### Safe next step
Obtain the repository tree and source locally (via a GitHub archive, authenticated checkout or connected action exposing the recursive tree); enumerate `app/**/page.tsx` and `app/**/route.ts`; scan `href`, `router.push/replace`, `redirect`, `fetch`, server actions, config rewrites, and dynamic templates. Preserve exact source files and line numbers. Only after that perform live redirect/role tests and approve deletions.

## Security and legacy route follow-up — 2026-10-11

Read-only scan of the uploaded repository snapshot: there were no exact legacy `/superuser` or `/facilities/dashboard` references in TypeScript/TSX outside `next.config.ts`. The current Facilities sidebar and home links use canonical routes. This does not measure old bookmarks or request traffic, and the snapshot may differ from later GitHub changes. Keep the redirects pending runtime and destination checks.

Supabase security advisors currently report 4 public tables without RLS (`_prisma_migrations`, `timesheet_week_packs`, `timesheet_shift_entries`, `timesheet_audit_logs`), 13 RLS tables without policies and 3 functions with mutable search path. Do not automatically enable RLS: inspect the use of those tables, existing database grants, Prisma access and required policies first. Review GraphQL exposure of public schema. Security issues are not resolved by page redirect cleanup.

The uploaded source snapshot contains four API files: `/api/facilities`, `/api/facilities/[id]`, `/api/profile`, `/api/me/permissions`, with 9 total exported HTTP handlers. Do a current-source and runtime authorisation test across all user roles before inserting production data.
