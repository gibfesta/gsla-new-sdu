# WORK RECEIPT — GSLA-M1-009

**Task:** Define Facilities approval workflow architecture.

**Milestone:** M1 — Core Platform, Authentication & Permissions.

**Worker:** Software Architect.

**Date:** 2026-10-12.

**Outcome:** Completed architecture definition; awaiting Project Controller / Project Owner acceptance. Task not self-closed.

**Branch:** `docs/gsla-m1-009-facility-approval` (documentation-only review branch).

**Baseline commit:** `eb4dc64a176addc6172d98518001bd5065a8eecd`.

**PR / delivery commit:** Recorded in the matching Issue #43 and Breeze receipt after publication; no runtime code commit is represented by this document.

**Deployment:** Not deployed by this Work Order; no app/database implementation performed.

**Authoritative task:** [GitHub Issue #43](https://github.com/gibfesta/gsla-new-sdu/issues/43), [Breeze card 6533385 / M1-009](https://app.breeze.pm/cards/6533385).

## Task and actual outcome

Assessed the current New Facilities / Venues implementation against approved active M1 / Facilities v0.2 and M1-004's identified creation/archival mismatch. Produced the [implementation-ready architecture proposal](../architecture/FACILITIES-APPROVAL-WORKFLOW.md): explicit state/transition and role-authority tables, preparation/submission/decision behaviour, post-approval operational editing, archive requests and decisions, immutable audit/revisions, server/API boundaries, database-specialist requirements, migration/cutover, bounded implementation handoff candidates and 23 acceptance scenarios.

The proposal is concrete enough for specialist review/planning but is not an approval to implement or deploy. It does not amend approved business permissions. Architectural acceptance belongs to Project Owner / Project Controller. M1-004 remains open for implementation and runtime evidence.

## Findings

- Current source has verified-user/session role guards in departmental layouts and Facilities APIs; positive/negative runtime results are not inferred from those guards.
- POST saves a facility without explicit initial approval state/evidence; PATCH has no approval/revision contract.
- Permanent DELETE was disabled by M1-004; archive UI remains an unconnected placeholder.
- Operational condition uses `status`; it must not encode draft/pending/approved/archive decisions.
- Prisma's Facilities model uses a primary key composed of UUID and mutable fields. Canonical identity/relationships require Senior Database Engineer review before workflow foreign keys or constraints are implemented.
- No existing approval/request/audit schema is specified in this facility model. Live database/schema data and security settings were not inspected.

## Decision / recommendation

Use a Facilities-owned command service with separate initial approval and archival requests. FA/OA prepare and submit; OA alone approves/returns/rejects. Approved operational edits remain allowed for FA/OA and append attributable revisions without invented mandatory reapproval. Archive requests keep the venue active until OA decides; edits during archive review supersede the stale request without suppressing FA edit rights. Decisions bind immutable submitted content and versions; command, history and idempotency effects commit together. Archive retains records/history and never aliases physical deletion.

Use no generic cross-department workflow engine for M1. Reuse proven request/audit mechanics later only after mapping each module's policy. Keep existing page routes and visual contract; add explicit backend commands and a proposed Organisation review queue through subsequent controlled work.

## Work completed / files changed

Documentation only:

- `docs/architecture/FACILITIES-APPROVAL-WORKFLOW.md` — complete proposed technical model and acceptance specifications.
- `docs/project-control/GSLA-M1-009-WORK-RECEIPT.md` — this specialist receipt.
- `docs/architecture.md` — architecture reference and source-accurate correction of stale claims about missing role guards.
- `docs/GSLA-WEBAPP-SYSTEM-HANDBOOK.md` — entry point/status/history links labelled proposed, not live.
- `docs/architecture/FACILITIES-FORMS-INTEGRATION-REGISTER.md` — lifecycle/archival integration dependency and current safeguard.
- `docs/architecture/PAGE-AND-ROUTE-REGISTRY.md` — planned routes clearly excluded from current/deployed counts.
- `docs/data-ownership-and-access.md` — technical implementation reference only; existing approved policy text preserved exactly.

No production code, schema, roles, grants, RLS, credentials, user records, venues, route counts or operational permissions changed. A separate worktree preserved pre-existing unrelated local modifications to `accelerate.txt` and the historical brain-dump document. No private record values were copied into public documentation.

## Verification performed

- Read full Issue #43 and its comments; full Breeze M1-009 task and comments; M1-004 Issue #27 Work Order, receipts and Controller continuation; approved v0.2 policy and specialist/work-order/receipt/status/documentation standards.
- Inspected baseline role resolver, Facilities/Organisation layout gates, middleware, both Facilities API handlers, Prisma Facilities schema, Create/Edit form, saved-facility consumers, detail/archive route, sidebar, overview, handbook and integration/route registers.
- Traced every mutation to approved role authority; walked create/submit/return/reject/revise/approve/edit/archive paths including OA self-approval and multi-role handling.
- Reviewed stale pending edits, competing decisions, archive/edit races, retries, audit failure, role revocation, legacy provenance and history retention as architectural cases; supplied expected results for F01–F23. These are design checks, not executable production acceptance results.
- Validated relative Markdown links, document-only scope and all required specialist receipt fields; compared permission-document content after removing the added reference: approved policy unchanged byte-for-byte. The first unstaged whitespace check omitted new untracked documents; a complete committed-diff check caught Markdown hard-break trailing spaces. Removed those spaces and reran the full change check before final handoff.
- Consulted current primary Next.js authorization, Prisma v6 transaction/concurrency and Supabase RLS documentation as technical boundary references.
- No application typecheck/build/runtime test, SQL test, live role request, database advisors or deployment test was required or performed for this documentation-only task. Such evidence is explicitly required of later implementation specialists.

## Specialist Role Compliance

**Specialist Worker / Role:** Software Architect, identified before execution in user instruction and authoritative task records.

**Role Specification Reference:** [Issue #43](https://github.com/gibfesta/gsla-new-sdu/issues/43) and [Breeze M1-009](https://app.breeze.pm/cards/6533385) explicit approved scope: system structure, workflow/state architecture, component/service boundaries and cross-system design; [Specialist Worker Verification Standard](SPECIALIST-WORKER-VERIFICATION-STANDARD.md).

**Specialist responsibilities exercised:** Policy-to-state translation, explicit transition authority, server/service/UI separation, durable approval/archival evidence, concurrency and migration impact design, cross-specialist handoff boundaries.

**Specialist checks actually performed:** State reachability/disposition review; role/action mapping against v0.2; preparation/pending/approved distinctions; return/reject/edit/archive model; audit/version consistency; API bypass and race analysis; existing consumer impact; database implication review without physical implementation/certification.

**Evidence inspected / produced:** Baseline source paths and task records listed above; architecture v1.0 with transition tables/API contracts/F01–F23; linked authoritative registers and this receipt; publication PR/commit and validation results recorded in Issue/Breeze handoff.

**Authority boundaries respected:** No business permission redefinition, no production implementation or self-approval of architecture, no schema/RLS/grant change or certification, no independent claim of Backend/Database specialist review, no runtime/security/deployment sign-off, no self-closing M1-009 or M1-004.

**Items referred to another specialist:** Senior Database Engineer for canonical key, schema/constraints, migration/reconciliation, grants/RLS/privileged Prisma paths and DB tests; Senior Backend Developer for command implementation review and API/session/concurrency tests; Frontend Developer for approved state controls/queue/read projections; QA for independent role/runtime acceptance; Project Controller/Owner for architectural acceptance and controlled assignments. These referrals are deliverable requirements, not claims that those specialists have executed.

**Specialist conclusion:** Software Architect responsibilities and required architectural checks were executed and evidenced. Architecture deliverable complete for review; Specialist Role Compliance assessment belongs to Project Controller. No production workflow or database security certification is claimed.

## Developer work required / follow-up candidates

After architectural acceptance, Project Controller should issue separate controlled tasks in this order: database contract and safe migration; backend command service/API implementation; frontend integration; independent lifecycle/negative-access verification. Link the outcomes to M1-004. Keep permanent deletion disabled until a separately designed erasure workflow exists. M1-007 owns Centre Manager venue/history/contribution-scope integration.

## Risks / dependencies and known limitations

Existing saved facilities have no documented approval evidence. They need reviewed disposition and cannot be silently labelled approved or removed from live use without a coordinated cutover. Current field names/IDs/routes must survive migration. Browser-local form previews are not authoritative data. Direct/privileged database paths need separate specialist enforcement evidence. Authenticated runtime harness and current database inventory remain unverified dependencies. Retention/erasure, restoration and handling outstanding operations are future controlled designs; no new policy is inferred here.

## Blockers and recommended next step

No blocker prevented completion of this architecture definition. Implementation depends on Owner/Controller acceptance plus Senior Database Engineer and Senior Backend Developer review under separate Work Orders. Recommended task state: **Review / Verification**, after this receipt is recorded. Project Controller must issue separate verification and explicitly assess Specialist Role Compliance before Done. M1-004 is not completed by this receipt.
