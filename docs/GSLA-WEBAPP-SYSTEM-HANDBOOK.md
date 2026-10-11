# GSLA WebApp — System Handbook

**START HERE — Developer and Administrator Handover**  
Status: Living document · Initial edition: 2026-10-11 · Owner: GSLA WebApp project

## Purpose and operating principle
This is the entry point for a future developer, IT administrator or database engineer. It explains how to locate reliable source documentation and operate the app safely. **Current implementation and planned features must never be confused.** Verify claims against the repository, running deployment and database before acting.

The approved frontend is the product reference. Backend/database work must preserve approved fields, forms and workflows; modifications require review and testing.

## System at a glance
- Source repository: `gibfesta/gsla-new-sdu` (Next.js, TypeScript, React, Tailwind).
- Deployment: Vercel, publicly reachable under `https://gsla-new-sdu.vercel.app`; verify current project and deployment status before release.
- Identity: Supabase Auth. Database: Supabase PostgreSQL. Existing server queries also use Prisma.
- Main areas: `/organisation`, `/facilities`, `/sports-development`, `/human-resources`, `/finance`; some modules are not production-ready.
- Authentication route source is grouped under `app/(auth)/`, which does **not** alter URLs. The Centre Manager awaiting-assignment URL remains `/auth/awaiting-assignment`.

## Current implementation status (verify periodically)
- Organisation Admin and Facilities Admin role-based routing, initial departmental access guards and Facilities API guards have been implemented. These require comprehensive negative/security tests before production accreditation.
- Centre Managers can authenticate and reach an awaiting-venue page. Venue-scoped assignment/access remains future work until real facilities exist.
- Facilities Directory has a Prisma-backed API and database table; create/edit/read operations still require full acceptance testing. A complete persistent forms system is **not yet live**.
- Forms & Procedures has predefined templates and browser-local editing/assignment behaviour; approved migration to Supabase remains outstanding. Preserve users' browser-only customisations.
- Duty Team page is a preview; shift staff and rota are not yet database-connected.
- HR development is on hold; its three timesheet tables were retained and direct `anon`/`authenticated` access was revoked with RLS enabled. Privileged data connections need separate review.
- Security is not yet signed off. A migration-history table in the public schema and other database advisors require review.

## Where to find authoritative material
| Subject | Source of truth |
|---|---|
| Active routing and redirects | `app/`, `next.config.ts`, [Page & Route Registry](architecture/PAGE-AND-ROUTE-REGISTRY.md) |
| Facilities integration | [Facilities Forms Integration Register](architecture/FACILITIES-FORMS-INTEGRATION-REGISTER.md) |
| Legacy URL review | [Legacy Admin/SuperUser Audit](architecture/LEGACY-ADMIN-SUPERUSER-REDIRECT-AUDIT.md) |
| Form development rules | `standards/GSLA-FORM-DEVELOPMENT-STANDARD.md` (planned) |
| Facilities form inventory | `departments/facilities/MASTER-FORM-REGISTER.md` (planned) |
| Facilities field mapping | `departments/facilities/FORM-DATABASE-MAPPING.md` (planned) |
| Documentation maintenance | [Documentation Maintenance Rule](standards/DOCUMENTATION-MAINTENANCE-RULE.md) |

## New developer onboarding checklist
1. Review this handbook and the repo README.
2. Identify current production deployment/branch; check build history and outstanding issues.
3. Configure an isolated local environment using the repo's documented package scripts. Never place secrets in source control.
4. Understand Supabase authentication, role checks and PostgreSQL access/RLS before handling real user data.
5. Review every changed route and migration against existing URLs and form data contracts.
6. Run type checks, lint, build and role-based acceptance tests before deploying.
7. Update relevant handbook/registry and record any material architectural decision in an ADR.

## Authentication and permissions principles
- Authentication establishes identity; authorisation must independently enforce **role and facility scope**.
- Frontend-hidden buttons are not security boundaries.
- Enforce sensitive read/write checks at server/API and database levels. Account or role labels must not be taken from user-editable JWT metadata.
- Never expose Supabase service-role credentials to the browser.
- Do not treat an awaiting-assignment page as proof of venue access.

## Form lifecycle contract
1. User opens the approved form and completes visible fields.
2. Both client and server validate input; server checks identity, role and record scope.
3. Persist record identity, every supplied field, attachments where applicable, timestamps and actor attribution.
4. Reopen record with identical values and tested edit/archive rules.
5. Preserve historical submissions and relevant form definition/version through subsequent template changes.
6. Record changes and test errors, concurrency, repeated submission and unauthorised access.
7. Existing localStorage forms **must be exported/reconciled before switching to database storage**.

## Deployment and change management
- Prefer reviewable source-controlled commits and migrations. Do not change production schemas without impact analysis, appropriate backups and verification.
- Check Vercel `READY` and exact commit SHA; a successful build is not equivalent to an end-to-end test.
- Test Organisation Admin, Facilities Admin, Centre Manager and anonymous scenarios for each security-sensitive change.
- Keep old redirects until callers/bookmarks have been audited and removals approved.
- Maintain a tested rollback plan. Never document a planned feature as deployed.

## Operations and incident handling
For broken login: verify current Supabase URL configuration, callback endpoints, link expiry/rate limits, sessions and error logs without sharing access tokens.
For API errors: inspect server logs, authentication/role checks and database connectivity/grants; avoid printing secrets or employee data.
For form-save failures: preserve browser draft data; verify API validation, schema mapping, permissions and expected record round-trip.
For unsafe access: restrict exposure, document scope, test fixes, and assess data protection obligations before releasing.

## Change and decision history
- 2026-10-11 — First handbook established as entry point; linked supporting registers and documented gaps. This is **not** a completed operational certification.
- Subsequent entries should include date, author/reviewer, relevant commit, changes, migration/test outcomes and any known limitations.

## Handover acceptance criteria
A replacement maintainer can install/run the project, locate every deployed route and API, explain actual permissions, identify source-of-truth data, deploy and roll back safely, and diagnose common failures using documented procedures. If any item is unknown, track it as a gap instead of inventing details.
