# GSLA WebApp — System Handbook

**START HERE — Developer and Administrator Handover**  
Status: Living document · Initial edition: 2026-10-11 · Owner: GSLA WebApp project

## Purpose and operating principle
This is the entry point for a future developer, IT administrator or database engineer. It explains how to locate reliable source documentation and operate the app safely. **Current implementation and planned features must never be confused.** Verify claims against the repository, running deployment and database before acting.

The approved frontend is the product reference. Backend/database work must preserve approved fields, forms and workflows; modifications require review and testing.

## Project control

Project work is governed through the GSLA WebApp Project Control System. Start with the [Project Control Guide](project-control/PROJECT-CONTROL-GUIDE.md).

The control system uses the Breeze project **GSLA WebApp — Project Control** as the operational board for milestones, owners, dependencies, status, verification and closure. GitHub Issues may remain linked technical task records, while GitHub source, pull requests, commits and documentation remain the permanent technical evidence. Specialist ChatGPT conversations execute approved Work Orders and return Work Receipts; they do not independently set project sequence or mark their own work Done. Every Work Receipt must also tell the project owner what happens next, explain the result in plain English, and provide copy/paste-ready instructions for the next worker.

Supporting control documents:
- [Work Order Standard](project-control/WORK-ORDER-STANDARD.md)
- [Work Receipt Standard](project-control/WORK-RECEIPT-STANDARD.md)
- [Project Status & Reporting Rules](project-control/PROJECT-STATUS-RULES.md)
- [Specialist Worker Verification Standard](project-control/SPECIALIST-WORKER-VERIFICATION-STANDARD.md)

Breeze is the operational project-control record. GitHub remains the permanent technical record. Technical behaviour belongs in the authoritative architecture, route, permissions, forms and departmental registers rather than being duplicated in Breeze.

## System at a glance
- Source repository: `gibfesta/gsla-new-sdu` (Next.js, TypeScript, React, Tailwind).
- Deployment: Vercel, publicly reachable under `https://gsla-new-sdu.vercel.app`; verify current project and deployment status before release.
- Identity: Supabase Auth. Database: Supabase PostgreSQL. Existing server queries also use Prisma.
- Main areas: `/organisation`, `/facilities`, `/sports-development`, `/human-resources`, `/finance`; some modules are not production-ready.
- Authentication route source is grouped under `app/(auth)/`, which does **not** alter URLs. The Centre Manager awaiting-assignment URL remains `/auth/awaiting-assignment`.

## Current implementation status (verify periodically)
- Owner Form Control has a [proposed M1-014 architecture](architecture/OWNER-FORM-CONTROL.md): universal form metadata inventory and separate private Operational Owner admission. It is not implemented/configured/deployed. Normal GSLA roles receive no owner-control right. Form usefulness/intentional unconnected state and persistence evidence are independent; current business forms remain unchanged.
- Organisation Admin and Facilities Admin role-based routing, initial departmental access guards and Facilities API guards have been implemented. Shared account controls are available through `/account`. The banner avatar/name opens My Account, where users can review personal/account details, change password and sign out. Centre Managers can also open My Account from the awaiting-assignment screen. These require comprehensive negative/security tests before production accreditation.
- Centre Managers can authenticate and reach an awaiting-venue page. Venue-scoped assignment/access remains future work until real facilities exist.
- Facilities Directory has a Prisma-backed API and database table; create/edit/read operations still require full acceptance testing. A complete persistent forms system is **not yet live**.
- New Facilities / Venues approval and archival have a [proposed M1-009 architecture](architecture/FACILITIES-APPROVAL-WORKFLOW.md), ready for Owner/Controller review. It is not an implemented workflow. M1-004 disabled permanent venue deletion; database/schema and backend/frontend implementation remain controlled follow-up work.
- Forms & Procedures has predefined templates and browser-local editing/assignment behaviour; approved migration to Supabase remains outstanding. Preserve users' browser-only customisations.
- Duty Team page is a preview; shift staff and rota are not yet database-connected.
- HR development is on hold; its three timesheet tables were retained and direct `anon`/`authenticated` access was revoked with RLS enabled. Privileged data connections need separate review.
- Security is not yet signed off. A migration-history table in the public schema and other database advisors require review.

## Where to find authoritative material
| Subject | Source of truth |
|---|---|
| Project control and task lifecycle | [Project Control Guide](project-control/PROJECT-CONTROL-GUIDE.md) |
| Active routing and redirects | `app/`, `next.config.ts`, [Page & Route Registry](architecture/PAGE-AND-ROUTE-REGISTRY.md) |
| Facilities integration | [Facilities Forms Integration Register](architecture/FACILITIES-FORMS-INTEGRATION-REGISTER.md) |
| Legacy URL review | [Legacy Admin/SuperUser Audit](architecture/LEGACY-ADMIN-SUPERUSER-REDIRECT-AUDIT.md) |
| Form development rules | `standards/GSLA-FORM-DEVELOPMENT-STANDARD.md` (planned) |
| Facilities form inventory | `departments/facilities/MASTER-FORM-REGISTER.md` (planned) |
| Facilities field mapping | `departments/facilities/FORM-DATABASE-MAPPING.md` (planned) |
| Documentation maintenance | [Documentation Maintenance Rule](standards/DOCUMENTATION-MAINTENANCE-RULE.md) |

## New developer onboarding checklist
1. Review this handbook and the repo README.
2. Review the Project Control Guide, Specialist Worker Verification Standard and the current Breeze board before starting work.
3. Identify current production deployment/branch; check build history and outstanding issues.
4. Configure an isolated local environment using the repo's documented package scripts. Never place secrets in source control.
5. Understand Supabase authentication, role checks and PostgreSQL access/RLS before handling real user data.
6. Review every changed route and migration against existing URLs and form data contracts.
7. Run type checks, lint, build and role-based acceptance tests before deploying.
8. Update relevant handbook/registry and record any material architectural decision in an ADR.

## Authentication and permissions principles
- Authentication establishes identity; authorisation must independently enforce **role and facility scope**.
- Frontend-hidden buttons are not security boundaries.
- Enforce sensitive read/write checks at server/API and database levels. Account or role labels must not be taken from user-editable JWT metadata.
- Never expose Supabase service-role credentials to the browser.
- Sign-out must terminate the Supabase browser session, redirect to `/sign-in`, and be verified by attempting protected-route access after logout.
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
- Do not credit specialist workers unless their role scope, specialist checks and evidence are recorded under the Specialist Worker Verification Standard.

## Operations and incident handling
For broken login: verify current Supabase URL configuration, callback endpoints, link expiry/rate limits, sessions and error logs without sharing access tokens.
For API errors: inspect server logs, authentication/role checks and database connectivity/grants; avoid printing secrets or employee data.
For form-save failures: preserve browser draft data; verify API validation, schema mapping, permissions and expected record round-trip.
For unsafe access: restrict exposure, document scope, test fixes, and assess data protection obligations before releasing.

## Change and decision history

- 2026-10-13 — M1-014 Owner Form Control architecture and [source discovery evidence](architecture/OWNER-FORM-CONTROL-DISCOVERY.md) produced for review at `7fb6bac`. No personal designation, new role, form behaviour or database connection changed. [Work Receipt](project-control/GSLA-M1-014-WORK-RECEIPT.md) provides specialist evidence and the mandatory next-worker handoff.

- 2026-10-12 — M1-009 approval architecture produced for review against `eb4dc64`; links added to the architecture/permission/forms references. No production behaviour or v0.2 business permission was changed. [Architecture](architecture/FACILITIES-APPROVAL-WORKFLOW.md) and [Software Architect receipt](project-control/GSLA-M1-009-WORK-RECEIPT.md) record scope and evidence.
- 2026-10-11 — First handbook established as entry point; linked supporting registers and documented gaps. This is **not** a completed operational certification.
- 2026-10-11 — Project Control System linked into handbook. GitHub Issues / GitHub Project were used for the initial M0 control setup; technical registers remained authoritative for system behaviour.
- 2026-10-11 — Operational project control migrated from GitHub Projects to Breeze (`GSLA WebApp — Project Control`). GitHub remains the permanent technical record for code, Issues, pull requests, commits and documentation.
- 2026-10-12 — Unified My Account flow added for current authenticated roles. Banner account identity opens `/account`, which centralises personal details, role/access information, password change and secure sign-out. Runtime role verification required before closing GSLA-M1-008.
- 2026-10-12 — Specialist Worker Verification Standard established. Specialist attribution now requires role-definition evidence, specialist checks, authority-boundary compliance and Project Controller verification.
- 2026-10-12 — Work Receipt handoff standard expanded. Every Work Receipt must now include the exact next step/owner, a plain-English explanation for the project owner, and copy/paste instructions for the next worker.
- Subsequent entries should include date, author/reviewer, relevant commit, changes, migration/test outcomes and any known limitations.

## Handover acceptance criteria
A replacement maintainer can install/run the project, locate every deployed route and API, explain actual permissions, identify source-of-truth data, deploy and roll back safely, understand the current controlled work queue, and diagnose common failures using documented procedures. If any item is unknown, track it as a gap instead of inventing details.

## M1-016 Form Control implementation submitted for review

The owner register now has a [reviewed source inventory](form-control/MASTER-INVENTORY.md) and read-only List/Card/detail UI under `/owner/form-control`, behind the existing M1-015 server boundary. See the [M1-016 receipt](project-control/GSLA-M1-016-WORK-RECEIPT.md) for delivery state and verification limits. 66 source definitions include 23 Facilities defaults; 143 UI-source / 88 page-source dispositions and 29 planned-only route candidates are separate counts. Browser-local copies on other devices/origins remain explicitly unreconciled. No form connection, submission behaviour or domain permissions changed. M1-016 is not marked Done by the Frontend Developer.


## Autonomous Workforce Coordination & Delivery Standard — 2026-10-14 (Owner Approved)

**Applies:** GSLA WebApp and OM-EMP-001 across OrganisedMindOS. Builds on the Readiness, Value and Owner-Time Standard; does not override existing access, security, QA independence or approvals.

### Central coordination, not owner relaying
The Project Controller is the primary interface for project delivery. It owns assessment, integrated sequencing, routing to specialists, tracking, evidence reconciliation and final status decisions. Use connected Breeze, GitHub, Google Drive, Vercel and Supabase tools **where available and authorised**, rather than routinely asking the Project Owner to copy instructions between chats. Separate specialist chats do not automatically message one another: do not claim cross-chat coordination, specialist execution or autonomous background work unless actually performed with available tools. When a required specialist or system action is unavailable, state the exact limitation once and propose the shortest real action.

### One owner-facing deliverable, controlled internal work
When the owner approves a combined release, maintain one parent delivery objective and one consolidated progress view. Divide technical implementation into bounded internal tasks by discipline (architecture, database, backend, frontend, independent QA, deployment/security), with each task retaining its proper Work Order, evidence and Work Receipt. Do not require owner approval for routine steps already authorised. Do obtain explicit consent for material scope/cost, secret/security access, destructive migrations, Production deployment or policy changes. Do not merge, modify protected configuration, or write Production data without the necessary authority.

### Implementation readiness and useful increments
Before execution, confirm real feature state, source of truth, database/service readiness, dependencies and smallest useful working result. Deliver integrated working Preview increments that the owner can explore, while preserving mandatory migration, integrity, permission and smoke checks before write-enabled access. Comprehensive acceptance remains necessary before Production release. A merged PR or successful build alone is not business-complete functionality.

### Mandatory escalation/stop rule
Repeated blockers, two ineffective handoffs or exceeded effort budget trigger a Controller reassessment, not automatic new infrastructure or worker loops. Prefer a proportionate safe route; never waive independent QA or security controls solely to save time. Track residual risk separately when it does not legitimately block the current bounded outcome.

### Owner reporting — five items
At meaningful checkpoints report **Completed (what works), In Progress, Blocked, Next, Owner Action**. Report working user capabilities separately from source work, deployment and synthetic testing. Present one coordinated owner-facing summary rather than forwarding raw specialist receipts unless needed for a decision.

### Immediate GSLA Phase 1 delivery directive
Owner's priority is an **integrated Supabase-connected Phase 1 Facilities Preview** based on the supplied Phase 1 forms, excluding FRM-041 (retired/retirement in progress), with approved Auth, Facility creation and retrieval, associated Events and operational forms. Existing services may require verification rather than new tables; never promise one table per form or that all features are already connected. Respect the accepted Facilities approval architecture and Org/Facilities/CM boundaries. Sequence technical dependencies internally and aim for a usable Preview for hands-on owner evaluation; safe database changes and role/permission safeguards remain gated. Suspend unrelated test-framework expansion absent demonstrated immediate benefit.

### Change history — WHY this was requested
**2026-10-14 — Project Owner directive:** Following repeated M1-004/M1-021 worker handoffs, delayed delivery, and hours spent building testing/security infrastructure while key Facilities persistence was deliberately unconnected, the owner requested an autonomous-style central coordinator to eliminate chat-switching and prioritise visible working outcomes. The controller must protect owner time, avoid bureaucratic loops, and be truthful about connector and separate-chat limitations. This is a prospective working-standard update, not retrospective worker attestation or a waiver of required verification.
