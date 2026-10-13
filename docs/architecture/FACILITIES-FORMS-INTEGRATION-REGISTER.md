# GSLA Facilities — Form & Backend Integration Register

Status: Implementation planning; data model and permissions require approval before migrations.
Scope: Facilities first. HR module remains on hold.

## Relationship to universal Owner Form Control

[M1-014 architecture](OWNER-FORM-CONTROL.md) proposes a separate owner-only inventory of all form definitions/usages and connection evidence. This document remains the Facilities-specific implementation plan. The owner inventory will reference native catalogue IDs and this plan; it will not replace the browser catalogue, force persistence, change template assignments or grant GSLA users owner access. An intentionally unconnected form can be ready for its intended use. Source/browser/UI status is separate from live database verification. Owner Form Control is not implemented by this reference.

## Existing interfaces
| Interface | Route | Source | Persistence | Next work |
|---|---|---|---|---|
| Create / Edit Facility | /facilities/facilities-directory/new and /facilities/facilities-directory/[id]/edit | components/facilities/FacilityForm.tsx | /api/facilities (Prisma/PostgreSQL); initial approval lifecycle absent | M1-009 architecture acceptance, database specialist contract, versioned approval commands, field mapping and role/runtime tests |
| Forms & Procedures | /facilities/forms-and-procedures | components/facilities/FormsAndProcedures.tsx | localStorage via lib/facilityFormCatalogue.ts | Preserve/export browser data, approved catalogue tables, venue assignments, submissions, role checks |
| Duty Team | /facilities/duty-team | app/facilities/duty-team/page.tsx | None (disabled preview) | Staff source, Shift Black/Grey/White assignments, date/shift validation, audit history |

## Predefined catalogue
23 templates are seeded from lib/facilityWorkflows.ts and lib/facilityFormCatalogue.ts. Preserve stable template and field IDs, versions, section, required fields, standard/extra assignments and event layouts. Confirm against user-edited browser copies before migrating. User-created and edited catalogue data currently may exist in browser localStorage only.

## Suggested entity model (proposal, not yet created)
- facilities: reuse and normalise existing facility table through reviewed migration
- staff directory: reference authenticated user/profile records; do not build HR payroll module
- facility_form_templates: UUID, stable key, name, category, version, status, definition JSONB, dates, creator
- facility_form_assignments: template version, facility, optional event/date period, status
- facility_form_submissions: template version, facility, submitted_by, submitted_at, answers JSONB, status
- facility_form_attachments: submission, storage key, safe metadata
- duty_shift_assignments: duty date, shift colour (Black/Grey/White), employee, assigned_by, timestamps
- operational_audit_log: actor, action, subject, time, details
Model uniqueness, version history, archive/retention, indexes and foreign keys with Database Engineer review.

## Planned build gates
1. Export existing browser-only forms and assignments safely; compare each customized form against default templates. Do not overwrite localStorage or silently promote browser preview venues to real facilities.
2. Secure facilities APIs and database access, including Prisma server operations. Establish role permissions for Organisation Admin, Facilities Admin and scoped Centre Manager.
3. Validate Create/Edit Facility form and ensure all submitted fields persist; test reads/updates and safe archival.
4. Implement persistent form catalogue and assignments, migrate approved templates and imported customisations.
5. Implement form submissions with provenance, attachment storage and traceable history.
6. Connect Duty Team selectors to an authorised staff directory and save dated Black/Grey/White shift records and audit trail.
7. Run role-based negative tests, concurrent edit tests, reload/device persistence checks and operational acceptance tests.

## Current findings

- [M1-009 Facilities approval architecture](FACILITIES-APPROVAL-WORKFLOW.md) is a review proposal dated 2026-10-12. It preserves v0.2 role authority, separates approval/archival from operational status, and specifies preparation, continuing edits, audit and negative tests. It has not been implemented. Current DELETE is fail-closed by M1-004; the archive page remains a disabled placeholder.
- Duty Team is a non-functional preview with disabled controls.
- Forms & Procedures uses browser-local storage and preview venues; it is not yet a shared production catalogue.
- Create Facility already calls an API, but field mapping and production security require verification.
- Separate Centre Manager venue assignments remain out of scope until actual facilities exist.

## M1-016 Form Control implementation submitted for review

The owner register now has a [reviewed source inventory](../form-control/MASTER-INVENTORY.md) and read-only List/Card/detail UI under `/owner/form-control`, behind the existing M1-015 server boundary. See the [M1-016 receipt](../project-control/GSLA-M1-016-WORK-RECEIPT.md) for delivery state and verification limits. 66 source definitions include 23 Facilities defaults; 143 UI-source / 88 page-source dispositions and 29 planned-only route candidates are separate counts. Browser-local copies on other devices/origins remain explicitly unreconciled. No form connection, submission behaviour or domain permissions changed. M1-016 is not marked Done by the Frontend Developer.
