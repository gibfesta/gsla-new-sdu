# GSLA WebApp — Data Ownership and Access

> **Status: APPROVED FOR ACTIVE M1 / FACILITIES SCOPE v0.2. Active M1 / Facilities decisions below are approved business rules. Later-department and explicitly deferred roles remain Deferred / To decide. Approval does not itself mean implementation is complete.**

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

Current approved active-role mapping:
- **Organisation Administrator** — full rights across the entire WebApp.
- **Facilities Manager (job title) → Facilities Administrator (system role)** — Facilities Department only, subject to the approval rules below.
- **Centre Manager** — assigned venue(s) only, except for retained personal contribution history.

Later SDU, HR, Finance, service-account and auditor roles remain Deferred / To decide unless explicitly stated below.


## Approved active M1 / Facilities baseline — v0.2

### Organisation Administrator
- Full rights across the entire GSLA WebApp.
- Full access to all departments, including underlying HR and Finance records.
- Create, Read, Edit, Approve, Archive/Delete and Export rights across the app.
- Full user/role administration and organisation-level master-record administration.
- No department-specific restriction unless a later explicit exception is approved.

### Facilities Manager → Facilities Administrator
- **Facilities Manager** is the organisational/job-title label.
- **Facilities Administrator** is the technical WebApp permission role.
- Do not create a separate technical Facilities Manager role unless future approved requirements make its permissions different.
- Facilities Administrator access is restricted to the Facilities Department.
- No Organisation-only, HR, SDU or Finance access unless separately approved later.
- **Facilities Administrator default rule:** full access and control within the Facilities Department unless a specific approved rule explicitly limits that authority or reserves approval/control to Organisation Administrator.
- Current explicit exceptions: **Events** require Organisation Administrator approval; **New Facilities / Venues** require Organisation Administrator approval and archive approval.

### Events
- Facilities Administrators may create and edit event records.
- Centre Managers may view event cards relevant to their currently assigned venue(s).
- Centre Managers may contribute through comments/updates only; they do not directly edit core event fields.
- Centre Managers may not create events and may not approve events.
- Formal approval authority is the Organisation Administrator.
- An event remains pending until required information/documentation has been gathered and the Organisation Administrator is satisfied with the supporting documentation.
- Approved workflow: Create / Prepare → Gather information/documentation → Submit for Organisation Administrator approval → Approved / Final.

### New Facilities / Venues
- Facilities Administrators may create and edit a proposed facility/venue record before approval.
- Organisation Administrator is the approval authority.
- Approved workflow: Facilities Administrator creates/prepares → required information completed → Organisation Administrator approves → facility becomes formally approved/final.
- After approval, Facilities Administrators may continue to manage and edit the approved facility's operational details within Facilities.
- Archiving a facility/venue requires Organisation Administrator approval.

### Maintenance / Venue Issues
- Centre Managers may create issue cards for their assigned venue and add information/updates while active.
- Centre Managers may not assign/reassign, change formal issue status, close, or archive an issue.
- Facilities Administrators control assignment, formal status transitions, closure and archive across Facilities.

### Compliance / Procedures / SOPs
- Same control pattern as Maintenance / Venue Issues.
- Centre Managers may create relevant venue-level entries where reporting/contribution is required and add information/updates while active.
- Centre Managers may not assign/reassign, control formal status, formally close/complete, or archive.
- Facilities Administrators control assignment, formal status transitions, completion/closure and archive.

### Daily Handovers
- Centre Managers have full access for their assigned venue(s).
- Centre Managers may Create, Read, Edit and complete/manage the Daily Handover workflow within assigned venue scope.

### Bookings / Shared Calendar
- Centre Managers have full visibility for the venue(s) they are currently assigned to.
- Visibility changes with venue assignment.
- Reassignment ends full booking/calendar visibility for the previous venue.
- Historical personal contributions remain available through the Personal Working Record rule.
- This decision grants full visibility only; Centre Manager create/edit rights for bookings/calendar are not approved by this rule.

### CM Assignments / Duty Team / rota information
- Not visible to Centre Managers.
- Full visibility and control for Facilities Administrators within Facilities.

### Reports & History
- Centre Managers may view the full historical record for the venue(s) they are currently assigned to.
- On reassignment, full venue-history visibility moves to the new assignment.
- Centre Managers do not retain full browse access to the previous venue solely because they once worked there.
- Their own personal contribution history remains available regardless of reassignment.

### Forms & Procedures
- Organisation Administrator: full access.
- Facilities Administrator: full access within Facilities.
- Centre Manager: not visible at this stage.

### Centre Manager personal working record / export
- A Centre Manager must be able to export a complete record of their own contributions across the WebApp.
- This right follows contribution history, not only current venue assignment, current shift/day or present access scope.
- Included examples: comments, updates, handover entries, issue contributions, event comments/updates, compliance/procedure/SOP contributions and other attributable data items.
- Assignment changes must never erase contribution history.
- Export may include the Centre Manager's own contributed content plus the minimum surrounding context needed to understand that contribution.
- This does not grant unrestricted access to unrelated records or other users' non-essential restricted data.
- Technical implementation must use auditable actor/contribution history rather than UI visibility alone.

## Explicitly Deferred / Open items

The following are not yet approved and must not be inferred:
- Any future Facilities exception to the approved default rule.
- Any later-department SDU, HR or Finance permission model beyond Organisation Administrator full rights.
- Any system/service-account or auditor roles.
- Any future exception to the current Centre Manager assigned-venue model.

## Implementation rule once approved

### Separate owner/system-control architecture reference

The [M1-014 Owner Form Control proposal](architecture/OWNER-FORM-CONTROL.md), authorised for design by Issue #52 / Breeze M1-014, defines an independent owner-only metadata area outside normal GSLA departmental/business administration. Normal GSLA roles, including Organisation Administrator, do not gain owner control through their business roles. The temporary designated principal is held only in private server configuration; the future owner/system role remains subject to separate approval. This reference does not amend any existing v0.2 business-data/action rights, implement an owner gate, or certify enforcement. Architectural acceptance and specialist implementation remain outstanding.

### Facilities workflow implementation reference

The [M1-009 Facilities approval architecture](architecture/FACILITIES-APPROVAL-WORKFLOW.md) is a proposed technical implementation of the approved New Facilities / Venues rules above. It is awaiting architectural acceptance; it does not amend this v0.2 permission policy or certify enforcement. Preparation, Organisation approval, continuing operational edits and Organisation archive approval are mapped there to states, API commands and specialist implementation requirements.

For every approved matrix entry, enforce read and write scope at the data boundary and validate actions on the server. The UI should reflect the same permissions, but hiding a page or button does not secure a record. Include direct URL, API/action, cross-venue, cross-department, and reassignment cases in verification. Default to no new access for any undecided entry; do not infer permissions from demo data or current navigation.

## Version handoff

- Review version: v0.2 partial approval
- Approved scope: Active M1 / Facilities baseline above
- Business approver: Project Owner
- Implementation status: not yet verified against the approved policy
- Deferred scope: explicitly listed open items and later-department roles
- Next step: resolve the remaining open Facilities items, then use the approved matrix to verify role boundaries and API/database authorisation.

This repository is public. Keep personnel details, individual assignments, private records, credentials, and security-sensitive operational information out of this file.


## GSLA-M1-010 implementation trace — 2026-10-12

The database implementation proposal lives at [GSLA-M1-010 Facilities approval database contract](database/GSLA-M1-010-FACILITIES-APPROVAL-DATABASE-CONTRACT.md) and draft PR #49. This is **not** a business-policy amendment or proof of deployed enforcement. Canonical facility UUID, unverified-legacy safeguards, request evidence, history, migration gates and RLS/grant implications are described there. Full staging migration, application command enforcement, cutover and independent acceptance remain pending. The approved v0.2 permission matrix is unchanged.
