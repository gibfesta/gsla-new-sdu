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
