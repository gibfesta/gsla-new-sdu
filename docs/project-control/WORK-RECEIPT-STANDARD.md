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
- no card may enter **Done** without both a Work Receipt and Project Controller Verification.
