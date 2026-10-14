# GSLA WebApp — Project Control Outputs & Handoffs Guide

Status: Approved owner reference  
Owner: GSLA WebApp Project Controller  
Version: 1.0 — 13 October 2026

## Purpose

This document explains the different project-control outputs that may be produced during GSLA WebApp work, who produces them, when to expect them, what each one means, and what it does not mean.

The aim is simple: at any point, the Project Owner should be able to understand what a worker has returned and what should happen next.

## Core audit trail

Every controlled task that enters execution must leave this trace:

**Task ID → Work Order → Execution / Verification → Evidence → Work Receipt → Project Controller Verification → Status Decision**

If work stops before completion:

**Task ID → Work Order → Partial Execution → Interim Work Receipt → Blocker / Hold → Resume → Final Work Receipt → Project Controller Verification → Status Decision**

No controlled work should disappear into a chat without this trace.

## Output reference

### 1. Request / Idea
**Produced by:** Project Owner  
**When:** At the start  
**Purpose:** States what should be changed, investigated, built, reviewed or decided.  
**Does not mean:** The work is approved or authorised yet.

### 2. Project Controller Assessment
**Produced by:** Project Controller  
**When:** Before work is assigned  
**Purpose:** Determines whether the request is new work, a bug, duplicate, follow-up, dependency, decision or priority issue.  
**Does not mean:** A worker has started execution.

### 3. Controlled Task
**Produced by:** Project Controller  
**When:** Once work is accepted into the project  
**Purpose:** Creates the permanent Task ID, for example `GSLA-M1-019`.  
**Does not mean:** The work has begun.

### 4. Work Order
**Produced by:** Project Controller  
**When:** Before execution starts  
**Purpose:** Formally instructs the worker what to do.  
**Rule:** Controlled execution should not begin without a formal `WORK ORDER — <Task ID>`.

### 5. Progress Update
**Produced by:** Worker  
**When:** While work is continuing  
**Purpose:** Reports progress.  
**Does not replace:** Work Receipt.

### 6. Evidence / Test Evidence
**Produced by:** Worker, QA, Project Controller or authorised test operator  
**When:** During execution or verification  
**Examples:** screenshots, HTTP results, commits, PRs, build results, logs, deployment IDs, exports, browser observations.  
**Purpose:** Proves what was observed.  
**Does not mean:** The task is accepted.

### 7. Defect Report / Finding
**Produced by:** Usually QA / verifier  
**When:** Expected and actual behaviour differ  
**Purpose:** Records a reproducible issue and evidence.  
**Does not replace:** Work Receipt.

### 8. Interim Work Receipt
**Produced by:** Worker  
**When:** Work started but cannot currently finish  
**Formal title:** `INTERIM WORK RECEIPT — <Task ID>`  
**Purpose:** Preserves completed work, evidence, blocker, safe state and remaining work.

### 9. Work Receipt
**Produced by:** Worker / specialist  
**When:** At the end of an execution or verification assignment  
**Formal title:** `WORK RECEIPT — <Task ID>`  
**Purpose:** Formal handoff to the Project Controller.

It normally includes Actual Outcome, work completed, systems changed, verification, documentation, limitations, Specialist Role Compliance where applicable, and the mandatory owner-facing handoff sections.

A finding, verdict, assessment, test report or handoff does not replace the Work Receipt.

### 10. QA Findings / Verification Report
**Produced by:** Senior QA & Independent Verification Specialist  
**Purpose:** Records test cases and observed PASS / FAIL / BLOCKED results.  
**Does not replace:** QA's formal `WORK RECEIPT — <Task ID>`.

### 11. Specialist Role Compliance
**Evidence supplied by:** Specialist  
**Acceptance judgement by:** Project Controller  
**Purpose:** Proves the named specialist actually worked within their approved role and performed the specialist-specific checks.

### 12. Project Controller Verification
**Produced by:** Project Controller  
**When:** After the Work Receipt  
**Purpose:** Independently verifies whether the evidence supports acceptance.

### 13. Project Controller Disposition
**Produced by:** Project Controller  
**Possible decisions:**  
- PASS → Done  
- PASS WITH FOLLOW-UP → Done plus controlled follow-up  
- RETURN FOR CORRECTION → In Progress  
- BLOCKED → Blocked  
- ON HOLD → On Hold

### 14. Follow-up Work Order
**Produced by:** Project Controller  
**When:** Additional material work is required  
**Purpose:** Starts the next controlled execution chain.

### 15. Closure Record
**Produced by:** Project Controller  
**When:** The task is genuinely complete  
**Purpose:** Confirms final status and links the Work Order, evidence, Work Receipt, verification and follow-up tasks.

## Key differences

**Evidence** = proof of what happened.  
**Finding / Defect** = a specific noteworthy or incorrect observation.  
**Progress Update** = information while work remains active.  
**Interim Work Receipt** = formal handoff when started work cannot finish.  
**Work Receipt** = the worker's formal handoff.  
**QA Findings** = verification evidence, not a substitute for the QA Work Receipt.  
**Project Controller Verification** = independent acceptance review.  
**Disposition** = the actual project status decision.

## Owner checklist

Whenever a worker finishes or stops work, check:

1. What is the Task ID?
2. Was there a Work Order?
3. What evidence was produced?
4. Where is the Work Receipt?
5. If specialist work, is Specialist Role Compliance included?
6. What did the Project Controller decide?
7. What happens next?

If one of these is missing, the audit trail may be incomplete.

## Permanent rule

Every controlled piece of GSLA WebApp work that enters execution must be traceable from instruction to evidence to acceptance.

Nothing should rely only on memory, chat history, verbal agreement, a screenshot, a successful build, a QA verdict or a worker saying “done.”

The minimum permanent trace is:

**Task ID → Work Order → Evidence → Work Receipt → Project Controller Verification → Status Decision**


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
