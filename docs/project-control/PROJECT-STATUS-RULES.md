# GSLA WebApp — Project Status & Reporting Rules

Status: Approved operating baseline  
Owner: Project Controller

## Status definitions

| Status | Meaning | Exit condition |
| --- | --- | --- |
| Backlog | Known but unscheduled | Assessed and promoted to Ready |
| Ready | Fully defined and dependency-safe | Worker starts execution |
| In Progress | Actively being worked | Work Receipt submitted |
| Review / Verification | Awaiting independent verification | Pass, correction, block or hold decision |
| Blocked | External dependency prevents progress | Blocker resolved |
| On Hold | Intentionally paused | Project owner / controller resumes |
| Done | Verified against completion criteria | Closed |

## Required task metadata

Every controlled task should record:
- Task ID
- Title
- Milestone
- Department / area
- Workstream
- Status
- Owner
- Priority
- Dependencies
- Verification requirement
- Documentation requirement
- Release / deployment state
- Source / discovery context

## Priority

- Critical — security, data loss, production outage or release blocker
- High — material milestone blocker or core workflow
- Medium — important planned work without immediate blocking impact
- Low — improvement or non-urgent cleanup

Priority does not replace dependencies.

## Completion evidence

Use verifiable evidence:
- PR / commit
- test output
- deployment
- route / UI verification
- API or database round-trip
- documentation commit

Do not close tasks based only on chat statements.

## Standard project report

### GSLA WebApp Project Status
Current Milestone:
Reporting date:
Baseline commit:

Backlog:
Ready:
In Progress:
Review / Verification:
Blocked:
On Hold:
Done:

### Since last report
- Completed
- Changed
- Newly blocked

### Next controlled work
1.
2.
3.

### Decisions required
- None, or explicit owner decisions.

## Reconciliation rule

Historical work may be recorded as verified completed evidence without creating fake open tasks.

Unverified historical work should be classified as Review / Verification, Outstanding, Blocked or On Hold until evidence supports closure.

Never mark a task complete merely because a PR merged.


## Work Receipt gates

Status movement must preserve execution evidence:

- **Backlog → Ready:** no Work Receipt required.
- **Ready → In Progress:** no Work Receipt required; execution begins.
- **In Progress → Review / Verification:** final Work Receipt required first.
- **In Progress → Blocked:** Interim Work Receipt required if any execution occurred.
- **In Progress → On Hold:** Interim Work Receipt required if any execution occurred.
- **Blocked / On Hold before execution:** no receipt required until work actually starts.
- **Review / Verification → Done:** Project Controller Verification required in addition to the Work Receipt.

A task must never be placed in Done simply because a PR was merged, a deployment succeeded or a worker says it is complete.
