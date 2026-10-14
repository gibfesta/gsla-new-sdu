# GSLA WebApp — Project Status & Reporting Rules

Status: Approved operating baseline  
Owner: Project Controller

## Status definitions

| Status | Meaning | Exit condition |
| --- | --- | --- |
| Backlog | Known but unscheduled | Assessed and promoted to Ready |
| Ready | Fully defined and dependency-safe | Worker starts execution |
| In Progress | Actively being worked | Work Receipt submitted |
| Review / Verification | Awaiting independent verification | Pass, correction, block or hold decision |
| Blocked | External dependency prevents progress | Blocker resolved |
| On Hold | Intentionally paused | Project owner / controller resumes |
| Done | Verified against completion criteria | Closed |

## Required task metadata

Every controlled task should record:
- Task ID
- Title
- Milestone
- Department / area
- Workstream
- Status
- Owner
- Priority
- Dependencies
- Verification requirement
- Documentation requirement
- Release / deployment state
- Source / discovery context
- Specialist Worker / Role, where applicable
- Role Specification Reference, where specialist work is required
- Specialist verification requirement

## Priority

- Critical — security, data loss, production outage or release blocker
- High — material milestone blocker or core workflow
- Medium — important planned work without immediate blocking impact
- Low — improvement or non-urgent cleanup

Priority does not replace dependencies.

## Completion evidence

Use verifiable evidence:
- PR / commit
- test output
- deployment
- route / UI verification
- API or database round-trip
- documentation commit

Do not close tasks based only on chat statements.

For specialist-credited work, completion evidence must also show the specialist's approved scope, specialist-specific checks, authority boundaries and Specialist Role Compliance. A specialist title or specialist chat name is not completion evidence.

## Standard project report

### GSLA WebApp Project Status
Current Milestone:
Reporting date:
Baseline commit:

Backlog:
Ready:
In Progress:
Review / Verification:
Blocked:
On Hold:
Done:

### Since last report
- Completed
- Changed
- Newly blocked

### Next controlled work
1.
2.
3.

### Decisions required
- None, or explicit owner decisions.

## Reconciliation rule

Historical work may be recorded as verified completed evidence without creating fake open tasks.

Unverified historical work should be classified as Review / Verification, Outstanding, Blocked or On Hold until evidence supports closure.

Never mark a task complete merely because a PR merged.


## Work Receipt gates

Status movement must preserve execution evidence:

- **Backlog → Ready:** no Work Receipt required.
- **Ready → In Progress:** no Work Receipt required; execution begins.
- **In Progress → Review / Verification:** final Work Receipt required first.
- **In Progress → Blocked:** Interim Work Receipt required if any execution occurred.
- **In Progress → On Hold:** Interim Work Receipt required if any execution occurred.
- **Blocked / On Hold before execution:** no receipt required until work actually starts.
- **Review / Verification → Done:** Project Controller Verification required in addition to the Work Receipt.
- **Specialist work → Done:** Specialist Role Compliance must be explicitly verified as PASS.

A task must never be placed in Done simply because a PR was merged, a deployment succeeded or a worker says it is complete.


## Specialist attribution status rule

A task must not be represented as specialist-completed unless specialist execution is evidenced under the Specialist Worker Verification Standard.

If specialist involvement cannot be demonstrated:
- keep the factual implementation evidence;
- use general/project implementation attribution;
- do not backfill a specialist name;
- create or assign specialist verification where specialist certification is actually required.


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
