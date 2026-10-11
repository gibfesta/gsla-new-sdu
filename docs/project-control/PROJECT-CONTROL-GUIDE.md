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

## Starting new work

A request can arrive as plain language, for example:

“I want the Facilities Events page to show clashes.”

The Project Controller must:
1. Check whether a task already exists.
2. Identify the milestone and workstream.
3. Check dependencies and affected authoritative documents.
4. Define acceptance criteria.
5. Select the correct worker.
6. Create or update the controlled task.
7. Issue a Work Order.

The project owner does not need to manually format Breeze cards or linked GitHub tickets.

## Work Order flow

REQUEST → ASSESS → TASK → ASSIGN → WORK ORDER → EXECUTION → WORK RECEIPT → VERIFY → CLOSE / FOLLOW-UP

See WORK-ORDER-STANDARD.md and WORK-RECEIPT-STANDARD.md.

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
- updates required documentation;
- returns a Work Receipt;
- identifies limitations and follow-up work.

The Project Controller verifies and closes the task.

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

The Project Controller is responsible for enforcing these gates when moving Breeze cards between stages.


## Expected Outcome vs Actual Outcome

- **Objective** describes what the task is trying to achieve.
- **Expected Outcome** is defined before execution and describes the successful end-state the Work Order is aiming for.
- **Actual Outcome** is recorded only after execution in the Work Receipt and describes what was actually achieved.

Active Breeze cards must show Expected Outcome in their description. Completed work must not rewrite Expected Outcome as if it were evidence; Actual Outcome belongs in the Work Receipt.
