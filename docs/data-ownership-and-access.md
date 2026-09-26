# GSLA WebApp — Data Ownership and Access

> **Status: REVIEW DRAFT v0.1. No access decision in this file is approved or implemented.**

## What this file is

This is the **developer-facing implementation reference** for the GSLA WebApp's data ownership and access policy. It translates approved business decisions into record-level and action-level requirements for the application and database. It is not an authorization grant, a live permission configuration, or a substitute for enforcement.

The business review document is [GSLA WebApp — Data Ownership & Access Matrix — REVIEW DRAFT v0.1](https://docs.google.com/document/d/1clO4A564E9fNNM9F4f8Ezj9nTCsMwA0mpeFlYMUWcxc/edit). Review and approve decisions there first. When a version is approved, copy its decisions into this file with the same version and approval reference, then implement and verify them.

## Relationship between the two locations

| Location | Audience | Purpose | Change path |
| --- | --- | --- | --- |
| Google Drive review matrix | GSLA decision makers and project owner | Define who inputs, sees, edits, approves, and archives each record | Draft, discuss, approve |
| This GitHub file | Developers and AI workers | Map approved decisions to code, database rules, and verification | Update after a Drive decision is approved |
| App and database | Users | Enforce the approved policy | Implement and test; documentation alone grants nothing |

## Terms

- **Role:** a person's functional responsibility (for example, Centre Manager).
- **Scope:** the records covered by that role, such as assigned venue, department, association, or own records.
- **Actions:** create, read, edit, approve, archive/delete, and any separate export or cross-department action.
- **Business owner:** person or group accountable for approving a record's rules.
- **Assignment change:** an event such as a Centre Manager's venue reassignment that may change scope.
- **Decision status:** Proposed, Approved, or Deferred. Only Approved decisions may be treated as implementation requirements.

## Matrix schema to implement after approval

Create one entry per record type, and split sensitive fields or distinct workflow states into separate entries when access differs:

| Field | Required decision |
| --- | --- |
| Department, record type, page/route | Which resource is governed? |
| Field group / sensitivity | Which parts differ in access? |
| Business owner and approval reference | Who signed off, and in which version? |
| Create / input location | Who adds data and through which workflow? |
| Read + scope | Who sees which records? |
| Edit + scope | Who changes which records and in what state? |
| Approve + transition | Who authorizes each transition? |
| Archive/delete/export | Who performs these separate actions? |
| Cross-department exceptions | Which summaries or underlying records can cross boundaries? |
| Reassignment behavior | What happens to old and new venue access? |
| Audit and retention | What must be recorded or retained? |
| Implementation and verification | Policy, server action, UI, test, and release reference |

## Review inventory — no implied privileges

Facilities: venues; Centre Manager assignments; events and calendar; maintenance/issues; compliance; procedures/SOPs; reports/history. SDU: associations and sports directory; events; compliance. HR: personnel and employment data. Finance: financial data. Health Dashboard: monitoring data. Confirm and refine this inventory against the actual schema and page flows.

Candidate roles for review include SuperUser, Facilities Manager, Centre Manager, and department-specific SDU, HR, and Finance roles. Their exact privileges, exceptions, and assignment timing remain **to decide**.

## Implementation rule once approved

For every approved matrix entry, enforce read and write scope at the data boundary and validate actions on the server. The UI should reflect the same permissions, but hiding a page or button does not secure a record. Include direct URL, API/action, cross-venue, cross-department, and reassignment cases in verification. Default to no new access for any undecided entry; do not infer permissions from demo data or current navigation.

## Version handoff

- Review version: v0.1 draft
- Approved version: not yet assigned
- Business approver: to assign
- Implementation status: not started from this policy
- Next step: complete and approve the Drive matrix entry by entry, then revise this file with the approved decisions and implementation references.

This repository is public. Keep personnel details, individual assignments, private records, credentials, and security-sensitive operational information out of this file.
