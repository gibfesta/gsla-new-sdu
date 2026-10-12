# GSLA WebApp — Work Order Standard

Status: Approved operating baseline  
Owner: Project Controller

## Purpose

A Work Order is the controlled instruction given to a specialist worker before substantial work begins.

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

## Rules

- One Work Order maps to one controlled Task ID.
- Do not combine unrelated work to reduce issue count.
- If new material work is discovered, return it to the Project Controller as a follow-up candidate.
- The worker may clarify implementation detail but may not silently expand scope.
- A Work Order is not complete until a Work Receipt is returned.
- The required Work Receipt must end with: **What happens next**, **Plain-English explanation**, and **Copy/paste instructions for the next worker**.
- Specialist attribution must be defined before or during execution, never invented retrospectively.
- Specialist Work Orders must define role scope, specialist checks and authority boundaries.
- Cross-discipline tasks must identify each required specialist; one specialist cannot silently absorb another discipline's judgement.
- If no specialist actually executes the work, the Work Receipt must use accurate general/project implementation attribution instead.
