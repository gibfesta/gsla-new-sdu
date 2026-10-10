# GSLA WebApp — Page & Route Registry

**Purpose:** Record the approved location, ownership, access rules, and migration status of application routes. Keep this document in source control; update it with each routing change. This is an initial verified subset, **not yet an exhaustive inventory**.

| Route | Source file | Owner / purpose | Access | Status |
| --- | --- | --- | --- | --- |
| /sign-in | app/sign-in/page.tsx | Authentication: sign in | Public | Existing |
| /auth/continue | app/auth/continue/page.tsx | Authentication: post-login role routing | Signed-in users | Existing |
| /auth/awaiting-assignment | app/auth/awaiting-assignment/page.tsx | Authentication: centre manager without venue assignment | Centre Manager | Current / canonical |
| /awaiting-venue | Redirect in next.config.ts | Legacy URL compatibility | Redirect to canonical route | Deprecated |
| /organisation/home | app/organisation/home/page.tsx | Organisation overview | Organisation Administrator | Existing |
| /organisation/health | app/organisation/health/page.tsx | WebApp system health | Organisation Administrator | Existing |
| /facilities/home | app/facilities/home/page.tsx | Facilities overview | Organisation or Facilities Administrator | Existing |
| /facilities/facilities-directory | app/facilities/facilities-directory/page.tsx | Facility records | Organisation or Facilities Administrator | Existing |
| /profile | app/profile/page.tsx | Internal user profile (content still needs full data integration) | Authenticated authorised user | Existing |
| /access-denied | app/access-denied/page.tsx | Restricted access response | Public page, no privileged data | Existing |

## Route governance rules
1. New routes must have an owner, purpose, authorised roles and implementation status.
2. Never place a new page directly under `app/` without checking whether it belongs in an existing module.
3. Rename or move existing routes with a compatibility redirect when bookmarks or callers may still exist.
4. Authentication-only pages belong under `app/auth/` where practical; existing login/recovery URLs should be consolidated in a separate reviewed migration.
5. A signed-in session is not sufficient to grant facility access: enforce role and venue assignment checks on server/database operations.
6. Keep on-hold public pages distinct from authenticated internal profiles.
7. Inventory the remaining pages and API endpoints before declaring this registry complete.

**Next audit:** Inventory all `app/**/page.tsx` and `app/**/route.ts` files, identify duplicates and undocumented redirects, then review each migration before moving it.
