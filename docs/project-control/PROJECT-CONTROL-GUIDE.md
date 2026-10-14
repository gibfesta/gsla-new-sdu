# GSLA WebApp — Project Control Guide

Status: Approved operating baseline  
Owner: GSLA WebApp Project Controller  
Applies to: All GSLA WebApp workstreams, departments and specialist workers

## Purpose

This guide defines how GSLA WebApp work is requested, assessed, prioritised, assigned, verified, documented and closed.

The operational project-control record is Breeze. GitHub remains the permanent technical record for source code, Issues, pull requests, commits and source-controlled documentation. ChatGPT conversations are working environments, not the source of truth.

## Control hierarchy

GSLA WebApp
→ Milestone
→ Workstream / Epic
→ Controlled Task
→ Work Order
→ Specialist execution
→ Work Receipt
→ Project Controller verification
→ Done

## Permanent records

- Breeze project **GSLA WebApp — Project Control**: operational control board and authoritative workflow status.
- GitHub Issues: linked technical task records where useful; not the authoritative board status.
- Pull Requests / commits: implementation evidence.
- System Handbook: operational handover entry point.
- Architecture and departmental registers: technical source of truth.
- Documentation Maintenance Rule: mandatory documentation process.

Do not duplicate technical detail from an authoritative register into the control board.

## Milestone structure

| ID | Milestone | Purpose |
| --- | --- | --- |
| M0 | Project Control & Baseline | Establish the board, task register, audit current progress and reconcile status |
| M1 | Core Platform, Authentication & Permissions | Identity, roles, access control, route protection and assignment foundations |
| M2 | Facilities Data & Forms | Facilities data, forms, procedures and persistence |
| M3 | Facilities Operations & Release | Events, calendar, maintenance, duty teams, assignments and release readiness |
| M4 | Human Resources | Employees, leave, timesheets and HR access/data |
| M5 | Sports Development Unit | Sports, associations, leagues, ranking and related workflows |
| M6 | Finance | Budgets, expenditure, invoices, suppliers and finance workflows |
| M7 | Organisation, Health & Production Hardening | Organisation controls, monitoring, security sign-off, handover and release assurance |

## Task IDs

Every controlled task uses:

GSLA-M<Milestone>-<three digit sequence>

Examples:
- GSLA-M0-001
- GSLA-M1-014
- GSLA-M3-006

The GitHub Issue number is separate from the Task ID.

## Statuses

### Backlog
Known work that has not been scheduled.

### Ready
Defined work with sufficient context and satisfied dependencies.

### In Progress
A worker is actively performing the task.

### Review / Verification
Implementation is complete and awaiting Project Controller verification.

### Blocked
Work cannot proceed because a named dependency, decision, environment or defect prevents progress.

### On Hold
Work is deliberately paused. On Hold is not the same as Blocked.

### Done
The Project Controller has verified the completion criteria and evidence.

## Core rules

1. One permanent Project Control Board.
2. One Task ID per controlled piece of work.
3. No duplicate tasks.
4. No substantial work starts without an approved task.
5. Workers do not set project priority.
6. Workers do not mark their own work Done.
7. Done requires evidence and verification.
8. Documentation changes with the work, not later.
9. Blocked work must name the blocker.
10. On Hold work must state why it is paused.
11. New ideas go to Backlog until assessed.
12. Breeze is the operational control record; GitHub is the permanent technical record; ChatGPT conversations are execution environments.
13. Specialist titles are not evidence of specialist execution.
14. A specialist may only be credited when their approved role scope, specialist checks and evidence are recorded.
15. Retrospective specialist attribution is prohibited.
16. Every controlled task that enters execution must have an auditable Work Order → evidence → Work Receipt → Project Controller verification chain.
17. QA, independent verification, review, diagnosis and assessment are execution activities when assigned as controlled work; they require formal Work Orders and Work Receipts just like implementation work.
18. Findings, verdicts, comments, screenshots, PR reviews or test summaries may support a Work Receipt but never replace it.

## Starting new work

A request can arrive as plain language, for example:

“I want the Facilities Events page to show clashes.”

The Project Controller must:
1. Check whether a task already exists.
2. Identify the milestone and workstream.
3. Check dependencies and affected authoritative documents.
4. Define acceptance criteria.
5. Select the correct worker.
6. If specialist work is required, identify the specialist's approved role definition, specialist checks and authority boundaries.
7. Create or update the controlled task.
8. Issue a Work Order.

The project owner does not need to manually format Breeze cards or linked GitHub tickets.

## Work Order flow

REQUEST → ASSESS → TASK → ASSIGN → WORK ORDER → EXECUTION / VERIFICATION → EVIDENCE → WORK RECEIPT → PROJECT CONTROLLER VERIFY → CLOSE / FOLLOW-UP

This chain is the minimum auditable trace for every task that actually begins execution.

See WORK-ORDER-STANDARD.md, WORK-RECEIPT-STANDARD.md and SPECIALIST-WORKER-VERIFICATION-STANDARD.md.

## Definition of Done

A task may be marked Done only when all applicable criteria are satisfied:

1. Requirement completed.
2. Code exists on the approved branch.
3. Required type checks, lint, build or tests have passed.
4. Permission/security scenarios have been tested where relevant.
5. UI has been manually verified where relevant.
6. Database migration and data round-trip have been verified where relevant.
7. Required documentation has been updated in the same task.
8. The Documentation Maintenance Rule has been satisfied.
9. Dependent registers have been updated.
10. The Project Controller has verified the evidence.
11. Where specialist work is claimed, Specialist Role Compliance has passed under the Specialist Worker Verification Standard.

Implemented ≠ Done.
Merged ≠ Done.
Deployed ≠ Done.

## Bugs

Bugs are controlled tasks and follow the same lifecycle. High-risk access, data-loss or security issues should be prioritised immediately and explicitly.

## Ideas

Ideas are placed in Backlog unless and until assessed. An idea is not a commitment.

## Specialist ChatGPT conversations

Specialist chats do not independently decide the project sequence.

The Project Controller:
- selects the next task;
- issues a Work Order;
- identifies authoritative documents;
- states scope and exclusions;
- records dependencies and acceptance criteria.

The specialist:
- performs only the assigned scope;
- works against an approved role specification or explicitly stated specialist scope;
- performs the specialist-specific checks defined in the Work Order;
- respects authority boundaries and refers cross-discipline decisions to the correct specialist;
- updates required documentation;
- returns a formally titled **WORK RECEIPT — <Task ID>** containing Specialist Role Compliance; a QA finding, verdict, review or handoff is not a substitute;
- identifies limitations and follow-up work;
- finishes the Work Receipt with: exact next step and owner, a plain-English explanation, and copy/paste-ready instructions for the next worker.

The Project Controller:
- verifies the evidence;
- checks Specialist Role Compliance before crediting the named specialist;
- must not invent or retrospectively assign specialist participation;
- closes the task only after all applicable verification gates pass.

If work was performed generally, record the actual executor as Project Controller / implementation support or other accurate non-specialist attribution.

## Project reporting

The Project Controller should be able to answer “Where are we?” using the board and evidence.

A standard status report contains:
- Current milestone
- Backlog
- Ready
- In Progress
- Review / Verification
- Blocked
- On Hold
- Done
- Changes since last report
- Next controlled tasks
- Decisions required from the project owner

## Continuous Documentation

For every meaningful code, route, permission, form, schema, deployment or operational change, follow ../standards/DOCUMENTATION-MAINTENANCE-RULE.md.

Project-control records describe work status. Technical registers describe system behaviour. Do not create a second competing source of truth.

## How to recover when you forget the process

Start here:

Repository README
→ Project Control Guide
→ Breeze: GSLA WebApp — Project Control
→ Current milestone and Ready / In Progress tasks

If the board and documentation disagree, stop and reconcile before continuing.


## Breeze / GitHub responsibility split

**Breeze** is the day-to-day control layer. Maintain the current task stage, milestone swimlane, dependency links, blocker/on-hold state, verification position and operational sequence there.

**GitHub** is the permanent technical evidence layer. Keep source code, source-controlled documentation, linked Issues where useful, pull requests, commits and implementation evidence there.

A Breeze card may link to a GitHub Issue or PR, but GitHub Project fields are no longer part of the GSLA WebApp control model. Do not maintain a duplicate GitHub Projects board.

If Breeze and GitHub technical evidence disagree, stop and reconcile the task before proceeding. Operational status is corrected in Breeze; technical implementation facts are corrected in GitHub/source-controlled documentation.


## Breeze card description standard

Every controlled Breeze card must use a clear, mobile-friendly description rather than one compressed paragraph.

Use the following order where applicable:

1. **Owner**
2. **Priority**
3. **GitHub Issue / PR**
4. **Objective**
5. **Dependencies**
6. **Expected Outcome**
7. **Decision Required** or **On Hold Reason**, where applicable
8. **Verification**
9. **Documentation**

Formatting rules:
- Put each field in its own paragraph or clearly separated line.
- Keep the Task ID and task name in the card title; do not repeat them unnecessarily in the description.
- Use clickable GitHub Issue/PR links where available.
- Keep dependencies both in the description and as native Breeze dependency links when the feature is enabled.
- Do not compress Owner, Priority, Dependencies, Objective and evidence into one continuous block of text.
- New Breeze cards created by the Project Controller should follow this standard automatically.


## Work Receipt lifecycle rule

Work Receipts are created when execution produces evidence, not simply because a card exists.

- Ready and Backlog cards do not need receipts.
- In Progress cards use progress comments until the worker reaches a handoff point.
- Review / Verification requires a final Work Receipt on the Breeze card.
- Blocked or On Hold work that had already started requires an Interim Work Receipt preserving completed work, blocker/hold reason, safe state and remaining work.
- Blocked or On Hold work that never entered execution does not require a receipt.
- Done requires both the final Work Receipt and a separate Project Controller Verification comment.
- Every Work Receipt must tell the project owner exactly what happens next, explain the result in plain English, and provide ready-to-send instructions for the next worker.

The Project Controller is responsible for enforcing these gates when moving Breeze cards between stages. If a worker returns findings or a verdict without the required formal Work Receipt, the Project Controller must request the missing receipt before accepting the handoff.


## Expected Outcome vs Actual Outcome

- **Objective** describes what the task is trying to achieve.
- **Expected Outcome** is defined before execution and describes the successful end-state the Work Order is aiming for.
- **Actual Outcome** is recorded only after execution in the Work Receipt and describes what was actually achieved.

Active Breeze cards must show Expected Outcome in their description. Completed work must not rewrite Expected Outcome as if it were evidence; Actual Outcome belongs in the Work Receipt.


## Specialist worker verification

The permanent rule is defined in [Specialist Worker Verification Standard](SPECIALIST-WORKER-VERIFICATION-STANDARD.md).

A specialist task must be traceable through:

**named specialist → approved role definition → specialist checks → specialist evidence → Specialist Role Compliance → Project Controller verification**

A chat title, task category, merged PR or successful deployment does not prove that specialist work occurred.

Multi-specialist tasks require separate evidence for each discipline. One specialist must not certify another specialist's area.


## Owner-facing Work Receipt handoff

Every Work Receipt must end with three mandatory sections:

1. **What happens next** — the next controlled action, who owns it, and the expected status/task transition.
2. **Plain-English explanation** — a short non-technical summary of what was done, what was not done, and why it matters.
3. **Copy/paste instructions for the next worker** — a ready-to-send instruction that the project owner can paste directly into the correct specialist chat without rewriting it.

This applies to final and interim Work Receipts. The handoff instructions do not authorise unapproved work; the Project Controller still controls assignment and sequencing.


## Mandatory Project Controller Readiness, Value and Owner-Time Standard — 2026-10-14

**Origin:** The Project Owner expressly requested this corrective standard after GSLA M1-004/M1-021 consumed hours of worker handoffs, automation and security activity without delivering the intended completed Facilities Administrator verification. The deliberately unconnected Facilities database was not properly recognised as a dependency. The owner reported wasted time, confusion and no corresponding Breeze closures. The Project Controller accepts responsibility for failure to intervene.

**Seven mandatory rules (all new and resumed controlled tasks):**

1. **Implementation Readiness Gate:** Classify each feature before testing: NOT BUILT, UI ONLY, IMPLEMENTED BUT UNCONNECTED, CONNECTED/IMPLEMENTED, TESTABLE IN ISOLATION, VERIFIED or ON HOLD. Record evidence and dependencies. Permission guards may be tested separately from unconnected data storage; never certify absent persistence.
2. **Business Outcome First:** State the tangible user-facing deliverable, agreed success criteria and smallest useful increment. Code, PRs, documentation and receipts are evidence/activity, not by themselves finished working functionality.
3. **Time and Complexity Limits:** Compare simpler safe approaches before infrastructure work. Define an effort budget/checkpoint; when breached, stop and reassess with the owner instead of expanding automatically.
4. **Dependency Verification:** Confirm owner decisions, approved architecture, schemas/database readiness, intended account/role, environment and deploy prerequisites before handing work to a specialist.
5. **Controlled Worker Handoffs:** Two unsuccessful handoffs, repeated blockers or a breached effort budget trigger a Project Controller STOP and one-paragraph reassessment, not another default work order. Explain the simplest safe alternative and keep coordination away from the owner.
6. **Proportionate Verification:** Choose appropriate manual, automated, code-level or isolated tests for actually implemented behaviour. Distinguish owner-observed, independently reproduced, synthetic, PASS/FAIL/BLOCKED/NOT RUN. Never bypass security, QA independence, evidence or rollback obligations.
7. **Progress and Value Reporting:** At checkpoints report what newly works, what was genuinely verified, what remains unbuilt/unconnected, what is blocked, whether further effort is worth it, and the smallest next action. Ask the owner only for necessary decisions/account actions.

**Project Controller authority and duty:** Challenge or stop its own or another specialist's proposed work; simplify, defer or recommend cancellation where value is disproportionate; verify dependencies; protect owner time. Preserve security obligations, separate residual security risk from unrelated operational acceptance where justified, and never claim unexecuted tests PASS.

**Required brief pre-execution record:** Feature readiness; evidence and missing dependencies; business outcome; cheapest safe route; effort checkpoint; required owner involvement; stop condition; verification method. Unknown means NOT READY until resolved; it is not an invitation to invent readiness.

**Change record — 2026-10-14:** Explicit Project Owner request following wasted hours on M1-004/M1-021 and failure to recognise intentionally deferred Facilities database integration. Purpose: prevent recurrence in GSLA and wider OrganisedMindOS Project Controller practice. Applies prospectively. Historical task evidence and security approvals must not be rewritten or silently weakened.


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
