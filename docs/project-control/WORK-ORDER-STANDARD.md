# GSLA WebApp — Work Order Standard

Status: Approved operating baseline  
Owner: Project Controller

## Purpose

A Work Order is the controlled instruction given to any worker before controlled execution begins.

## Required format

### WORK ORDER — <Task ID>

**Task:**  
**Milestone:**  
**Owner / Worker:**  
**Specialist Worker / Role (if applicable):**  
**Role Specification Reference:**  
**Specialist Responsibilities Used:**  
**Specialist Checks Required:**  
**Authority Boundaries / Out of Scope:**  
**Other Specialists Required:**  
**Priority:**  
**Status:** Ready / In Progress  
**Dependencies:**  
**Authoritative documents:**  

### Objective
State what the task is trying to achieve in plain language.

### Expected Outcome
State the successful end-state expected before execution begins. This is not the Actual Outcome; the Work Receipt records what was actually achieved.

### Background
Only the context required to perform the task correctly.

### In scope
List the work that must be performed.

### Out of scope
List adjacent work that must not be changed.

### Acceptance criteria
Use observable, testable outcomes.

### Verification required
State the tests, manual checks, roles, routes, data round-trip or deployment checks required.

### Documentation required
Name the authoritative documents that must be updated under the Documentation Maintenance Rule.

### Constraints / safeguards
Record compatibility, security, data preservation, migration or rollback requirements.

### Specialist verification requirements
When a specialist is assigned, define the specialist-specific evidence required to prove that the specialist actually performed the work. The approved role specification, or an explicit approved specialist scope, must be identified before execution begins.

## Auditable trace rule

Every controlled task that enters execution must have a formal **WORK ORDER — <Task ID>** before work starts. The Work Order is the beginning of the permanent execution trace and must identify the worker/role, objective, scope, boundaries, required evidence and expected Work Receipt.

The required chain is:

**Task ID → Work Order → execution/evidence → Work Receipt → Project Controller verification → status decision**

Verification and QA assignments are controlled work and require their own Work Order and Work Receipt. A request such as “review”, “assess”, “verify” or “test” does not remove this requirement.

## Rules

- One Work Order maps to one controlled Task ID.
- Do not combine unrelated work to reduce issue count.
- If new material work is discovered, return it to the Project Controller as a follow-up candidate.
- The worker may clarify implementation detail but may not silently expand scope.
- A Work Order is not complete until a formally titled **WORK RECEIPT — <Task ID>** is returned. If execution stops early, an **INTERIM WORK RECEIPT — <Task ID>** is required.
- The required Work Receipt must end with: **What happens next**, **Plain-English explanation**, and **Copy/paste instructions for the next worker**.
- Specialist attribution must be defined before or during execution, never invented retrospectively.
- Specialist Work Orders must define role scope, specialist checks and authority boundaries.
- Cross-discipline tasks must identify each required specialist; one specialist cannot silently absorb another discipline's judgement.
- If no specialist actually executes the work, the Work Receipt must use accurate general/project implementation attribution instead.


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
