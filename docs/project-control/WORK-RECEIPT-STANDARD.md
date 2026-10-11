# GSLA WebApp — Work Receipt Standard

Status: Approved operating baseline  
Owner: Project Controller

## Purpose

A Work Receipt is the specialist worker's evidence-backed handoff after completing or stopping work.

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

### Known limitations
State anything not verified, not implemented or still relying on demo/local data.

### Follow-up work
List new tasks that should be assessed by the Project Controller. Do not start them without approval.

### Blockers
If incomplete, state the exact blocker and evidence.

## Project Controller disposition

The Project Controller records one of:

- PASS → Done
- PASS WITH FOLLOW-UP → Done plus new controlled task(s)
- RETURN FOR CORRECTION → In Progress
- BLOCKED → Blocked
- ON HOLD → On Hold

Workers do not close their own tasks.
