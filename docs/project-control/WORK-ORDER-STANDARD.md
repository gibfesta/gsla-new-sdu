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
**Priority:**  
**Status:** Ready / In Progress  
**Dependencies:**  
**Authoritative documents:**  

### Objective
State the outcome in plain language.

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

## Rules

- One Work Order maps to one controlled Task ID.
- Do not combine unrelated work to reduce issue count.
- If new material work is discovered, return it to the Project Controller as a follow-up candidate.
- The worker may clarify implementation detail but may not silently expand scope.
- A Work Order is not complete until a Work Receipt is returned.
