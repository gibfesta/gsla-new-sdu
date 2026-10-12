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

A final or interim Work Receipt is incomplete if it omits the three mandatory handoff sections: **What happens next**, **Plain-English explanation**, and **Copy/paste instructions for the next worker**.


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
