# GSLA WebApp — Work Receipt Standard

Status: Approved operating baseline  
Owner: Project Controller

## Purpose

A Work Receipt is the worker's evidence-backed handoff after completing, pausing, blocking, verifying, rejecting or otherwise stopping controlled work.

## Universal audit-trail rule

Every controlled task that enters execution must leave a complete auditable chain:

**Task ID → Work Order → named worker/role → execution evidence → Work Receipt → Project Controller verification → status decision**

This rule applies to all workers and all execution types, including implementation, architecture, database work, frontend/backend work, QA, independent verification, review, investigation and defect diagnosis.

A QA finding, assessment, test report, verdict, handoff, defect note or review comment does **not** replace the formal Work Receipt. Where QA/verification is the assigned work, that verification itself counts as execution and must end with a formally titled **WORK RECEIPT — <Task ID>**.

If work stops before completion, the worker must return an **INTERIM WORK RECEIPT — <Task ID>** preserving work completed, evidence, current safe state, blocker/hold reason and remaining work.

No worker is exempt from this audit-trail requirement.

## Required format

### WORK RECEIPT — <Task ID>

**Worker:**  
**Outcome:** Completed / Partially completed / Blocked  
**Branch / PR / commit:**  
**Deployment:** Not deployed / Preview / Production  

### Work completed
Describe exactly what changed.

### Files / systems changed
List relevant source files, database migrations, configuration or external systems.

### Verification performed
Record type checks, lint, builds, automated tests, manual UI checks, role checks, database checks and deployment verification.

### Documentation updated
List all authoritative documents updated.

### Specialist Role Compliance
Required whenever the work is credited to a specialist.

**Specialist Worker / Role:**  
**Role Specification Reference:**  
**Specialist responsibilities exercised:**  
**Specialist checks actually performed:**  
**Evidence inspected / produced:**  
**Authority boundaries respected:**  
**Items referred to another specialist:**  
**Specialist conclusion:**  

If the work was not actually performed by a specialist, do not complete this section with a specialist title. Record the real executor accurately.

### Known limitations
State anything not verified, not implemented or still relying on demo/local data.

### Follow-up work
List new tasks that should be assessed by the Project Controller. Do not start them without approval.

### Blockers
If incomplete, state the exact blocker and evidence.

### What happens next
State the exact next controlled step, the responsible worker/role, and the expected task/status transition. If no further worker action is required, say so explicitly.

### Plain-English explanation
Give the project owner a brief non-technical explanation of what happened, what did not happen, and why it matters. Assume the reader is learning the system and avoid unexplained jargon.

### Copy/paste instructions for the next worker
Provide a ready-to-send instruction block for the next worker or specialist. It must include the Task ID, worker/role, objective, dependencies, scope/boundaries, required evidence and Work Receipt requirement. The project owner should not need to rewrite or translate the handoff.

If there is no next worker, provide a copy/paste instruction back to the Project Controller stating that verification/closure is the next action.

## Project Controller disposition

The Project Controller records one of:

- PASS → Done
- PASS WITH FOLLOW-UP → Done plus new controlled task(s)
- RETURN FOR CORRECTION → In Progress
- BLOCKED → Blocked
- ON HOLD → On Hold

Workers do not close their own tasks.

For specialist work, the Project Controller must additionally record **Specialist Role Compliance = PASS** before Done. Missing or unsupported specialist evidence requires correction or assignment to the appropriate specialist.

A final or interim Work Receipt is incomplete if it omits the formal receipt title and the three mandatory handoff sections: **What happens next**, **Plain-English explanation**, and **Copy/paste instructions for the next worker**.


## When a Work Receipt is required

A Work Receipt is tied to execution, not merely to the existence of a task.

| Task status | Work Receipt rule |
| --- | --- |
| Backlog | No Work Receipt. Execution has not started. |
| Ready | No Work Receipt. The task is defined but not yet executed. |
| In Progress | Normally no final Work Receipt yet. Use progress comments while work is active. |
| Review / Verification | **Mandatory final Work Receipt before entering this status.** |
| Blocked | If execution had already started, add an **INTERIM WORK RECEIPT** before/when moving to Blocked. If blocked before execution began, no receipt is required. |
| On Hold | If execution had already started, add an **INTERIM WORK RECEIPT** before/when moving to On Hold. If paused before execution began, no receipt is required. |
| Done | **Mandatory final Work Receipt plus separate Project Controller Verification.** |

### Interim Work Receipt

Use this when work has started but cannot currently be completed.

Record:
- work completed so far;
- files/systems changed;
- verification already performed;
- exact blocker or hold reason;
- current safe state;
- remaining work;
- any documentation already updated.

An Interim Work Receipt does not mean the task is complete.

## Breeze recording rule

For controlled Breeze tasks:
- post the Work Receipt as a structured comment on the same Breeze card;
- post Project Controller Verification as a separate comment;
- keep GitHub PR/commit/Issue links in the receipt as technical evidence;
- no card may enter **Review / Verification** without a Work Receipt;
- no card may enter **Done** without both a Work Receipt and Project Controller Verification;
- specialist-credited work may not enter **Done** unless Specialist Role Compliance is evidenced and explicitly passed by the Project Controller;
- retrospective specialist attribution is prohibited;
- every Work Receipt must finish with the three mandatory owner-facing handoff sections so the project owner always knows what happened and exactly what to do next.


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
