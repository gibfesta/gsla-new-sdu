# M1-014 — Form Control Source Discovery Evidence

**Date / baseline:** 2026-10-13 / `7fb6bac897824029cabf68919f706ba3483766bd`. Software Architect source discovery, not deployed inventory certification.

Companion to [Owner Form Control architecture](OWNER-FORM-CONTROL.md). This appendix is an audit input. It contains paths/default-template metadata only; it does not copy submitted answers, user identities or browser customisations.

## Method and limits

Enumerated every app/components TSX source; searched form/input/textarea/select/onSubmit/FormData markers. Reviewed shared form/template factories and representative handlers separately. Marker matches include filters/searches and can miss placeholder uploads, component-only inputs and button-driven editors. Counts are not unique form counts. No navigation crawl, live database query or browser-storage extraction was performed.

Every page below needs downstream semantic/import/action review and an explicit disposition, including zero-marker pages. Register candidates or exclude auxiliary controls with a reason; this sweep alone is not the complete master register.

## Coverage counts

- UI source files scanned: **135**.
- Page sources enumerated: **85**.
- Direct-marker candidate source files: **45**.
- Facilities source-default definitions: **23**, including four generated compliance templates; local additions not inspected.

| Area | Page files |
| --- | --- |
| Login/Auth | 8 |
| Shared/Public | 5 |
| On-Hold | 3 |
| Facilities | 20 |
| Facilities / Venue | 5 |
| Finance | 2 |
| HR | 9 |
| Health | 1 |
| Organisation | 12 |
| SDU | 20 |

## Candidate source files — not distinct-form counts

| Source | Marker matches | HTML form elements |
| --- | --- | --- |
| `app/(auth)/forgot-password/page.tsx` | 3 | 1 |
| `app/(auth)/sign-in/page.tsx` | 4 | 1 |
| `app/(public)/join/page.tsx` | 4 | 0 |
| `app/On-Hold-Pages/login/page.tsx` | 4 | 1 |
| `app/On-Hold-Pages/profile/page.tsx` | 1 | 0 |
| `app/On-Hold-Pages/signup/page.tsx` | 4 | 1 |
| `app/facilities/bookings/page.tsx` | 1 | 0 |
| `app/facilities/cm-assignments/page.tsx` | 5 | 0 |
| `app/facilities/duty-team/page.tsx` | 1 | 0 |
| `app/facilities/events-control/page.tsx` | 5 | 0 |
| `app/facilities/facilities-directory/page.tsx` | 2 | 0 |
| `app/human-resources/employees/[id]/page.tsx` | 1 | 0 |
| `app/human-resources/employees/page.tsx` | 3 | 0 |
| `app/human-resources/leave/page.tsx` | 15 | 0 |
| `app/human-resources/timesheets/weeks/page.tsx` | 1 | 1 |
| `app/organisation/health/page.tsx` | 1 | 1 |
| `app/organisation/system/mail/page.tsx` | 7 | 0 |
| `app/organisation/system/reminders/page.tsx` | 1 | 0 |
| `app/organisation/users/add/page.tsx` | 5 | 0 |
| `app/organisation/users/new/page.tsx` | 5 | 0 |
| `app/sports-development/associations/form-b/page.tsx` | 8 | 0 |
| `app/sports-development/associations/form-c/page.tsx` | 4 | 0 |
| `app/sports-development/associations/registration/page.tsx` | 8 | 0 |
| `app/sports-development/leagues/[leagueId]/teams/add/page.tsx` | 3 | 0 |
| `app/sports-development/leagues/add/page.tsx` | 4 | 0 |
| `app/sports-development/reports/page.tsx` | 1 | 0 |
| `app/sports-development/sports/[sport]/coaches/page.tsx` | 7 | 0 |
| `app/sports-development/sports/[sport]/governance/page.tsx` | 5 | 0 |
| `app/sports-development/sports/[sport]/page.tsx` | 6 | 0 |
| `app/sports-development/sports/[sport]/participants/page.tsx` | 14 | 0 |
| `app/sports-development/sports/[sport]/teams/page.tsx` | 8 | 0 |
| `app/sports-development/teams/add/page.tsx` | 3 | 0 |
| `components/app-shell/HeaderBar.tsx` | 1 | 0 |
| `components/auth/PasswordForm.tsx` | 5 | 1 |
| `components/facilities/EventEditor.tsx` | 6 | 1 |
| `components/facilities/FacilityForm.tsx` | 11 | 0 |
| `components/facilities/FacilityFormPreviewer.tsx` | 14 | 1 |
| `components/facilities/FacilityScheduleEditor.tsx` | 6 | 0 |
| `components/facilities/FormsAndProcedures.tsx` | 10 | 1 |
| `components/facilities/SharedCalendarBoard.tsx` | 1 | 0 |
| `components/facilities/WorkflowAttachments.tsx` | 1 | 0 |
| `components/facilities/WorkflowCompletionForm.tsx` | 12 | 1 |
| `components/facilities/WorkflowRecordReview.tsx` | 8 | 1 |
| `components/facilities/WorkflowTemplateEditor.tsx` | 17 | 1 |
| `components/human-resources/timesheets/WeekGridDemo.tsx` | 2 | 0 |

## Every page source — review ledger seed

Imported forms/modal actions and aliases require mapping even without direct markers. No forms are inferred merely from a route name.

| Area | Current route pattern | Source | Direct markers |
| --- | --- | --- | --- |
| Login/Auth | `/access-denied` | `app/(auth)/access-denied/page.tsx` | 0 |
| Login/Auth | `/auth/awaiting-assignment` | `app/(auth)/auth/awaiting-assignment/page.tsx` | 0 |
| Login/Auth | `/auth/continue` | `app/(auth)/auth/continue/page.tsx` | 0 |
| Login/Auth | `/change-password` | `app/(auth)/change-password/page.tsx` | 0 |
| Login/Auth | `/forgot-password` | `app/(auth)/forgot-password/page.tsx` | 3 |
| Login/Auth | `/reset-password` | `app/(auth)/reset-password/page.tsx` | 0 |
| Login/Auth | `/set-password` | `app/(auth)/set-password/page.tsx` | 0 |
| Login/Auth | `/sign-in` | `app/(auth)/sign-in/page.tsx` | 4 |
| Shared/Public | `/join` | `app/(public)/join/page.tsx` | 4 |
| On-Hold | `/On-Hold-Pages/login` | `app/On-Hold-Pages/login/page.tsx` | 4 |
| On-Hold | `/On-Hold-Pages/profile` | `app/On-Hold-Pages/profile/page.tsx` | 1 |
| On-Hold | `/On-Hold-Pages/signup` | `app/On-Hold-Pages/signup/page.tsx` | 4 |
| Shared/Public | `/account` | `app/account/page.tsx` | 0 |
| Shared/Public | `/auth/page-preview` | `app/auth/page-preview/page.tsx` | 0 |
| Facilities | `/facilities/bookings` | `app/facilities/bookings/page.tsx` | 1 |
| Facilities | `/facilities/cm-assignments` | `app/facilities/cm-assignments/page.tsx` | 5 |
| Facilities | `/facilities/compliance` | `app/facilities/compliance/page.tsx` | 0 |
| Facilities | `/facilities/daily-operations` | `app/facilities/daily-operations/page.tsx` | 0 |
| Facilities | `/facilities/duty-team` | `app/facilities/duty-team/page.tsx` | 1 |
| Facilities | `/facilities/events-control/[eventId]/archive` | `app/facilities/events-control/[eventId]/archive/page.tsx` | 0 |
| Facilities | `/facilities/events-control/[eventId]/edit` | `app/facilities/events-control/[eventId]/edit/page.tsx` | 0 |
| Facilities | `/facilities/events-control/[eventId]` | `app/facilities/events-control/[eventId]/page.tsx` | 0 |
| Facilities | `/facilities/events-control/new` | `app/facilities/events-control/new/page.tsx` | 0 |
| Facilities | `/facilities/events-control` | `app/facilities/events-control/page.tsx` | 5 |
| Facilities / Venue | `/facilities/facilities-directory/[facilityId]/archive` | `app/facilities/facilities-directory/[facilityId]/archive/page.tsx` | 0 |
| Facilities / Venue | `/facilities/facilities-directory/[facilityId]/edit` | `app/facilities/facilities-directory/[facilityId]/edit/page.tsx` | 0 |
| Facilities / Venue | `/facilities/facilities-directory/[facilityId]/events/[eventId]` | `app/facilities/facilities-directory/[facilityId]/events/[eventId]/page.tsx` | 0 |
| Facilities / Venue | `/facilities/facilities-directory/[facilityId]/issues` | `app/facilities/facilities-directory/[facilityId]/issues/page.tsx` | 0 |
| Facilities / Venue | `/facilities/facilities-directory/[facilityId]` | `app/facilities/facilities-directory/[facilityId]/page.tsx` | 0 |
| Facilities | `/facilities/facilities-directory/new` | `app/facilities/facilities-directory/new/page.tsx` | 0 |
| Facilities | `/facilities/facilities-directory` | `app/facilities/facilities-directory/page.tsx` | 2 |
| Facilities | `/facilities/forms` | `app/facilities/forms/page.tsx` | 0 |
| Facilities | `/facilities/forms-and-procedures` | `app/facilities/forms-and-procedures/page.tsx` | 0 |
| Facilities | `/facilities/home` | `app/facilities/home/page.tsx` | 0 |
| Facilities | `/facilities/maintenance-&-issues` | `app/facilities/maintenance-&-issues/page.tsx` | 0 |
| Facilities | `/facilities` | `app/facilities/page.tsx` | 0 |
| Facilities | `/facilities/procedures-&-sop` | `app/facilities/procedures-&-sop/page.tsx` | 0 |
| Facilities | `/facilities/reports-&-history` | `app/facilities/reports-&-history/page.tsx` | 0 |
| Facilities | `/facilities/shared-calendar` | `app/facilities/shared-calendar/page.tsx` | 0 |
| Finance | `/finance/dashboard` | `app/finance/dashboard/page.tsx` | 0 |
| Finance | `/finance` | `app/finance/page.tsx` | 0 |
| HR | `/human-resources/dashboard` | `app/human-resources/dashboard/page.tsx` | 0 |
| HR | `/human-resources/employees/[id]` | `app/human-resources/employees/[id]/page.tsx` | 1 |
| HR | `/human-resources/employees` | `app/human-resources/employees/page.tsx` | 3 |
| HR | `/human-resources/leave` | `app/human-resources/leave/page.tsx` | 15 |
| HR | `/human-resources` | `app/human-resources/page.tsx` | 0 |
| HR | `/human-resources/timesheets` | `app/human-resources/timesheets/page.tsx` | 0 |
| HR | `/human-resources/timesheets/settings` | `app/human-resources/timesheets/settings/page.tsx` | 0 |
| HR | `/human-resources/timesheets/weeks/[id]` | `app/human-resources/timesheets/weeks/[id]/page.tsx` | 0 |
| HR | `/human-resources/timesheets/weeks` | `app/human-resources/timesheets/weeks/page.tsx` | 1 |
| Health | `/organisation/health` | `app/organisation/health/page.tsx` | 1 |
| Organisation | `/organisation/home` | `app/organisation/home/page.tsx` | 0 |
| Organisation | `/organisation` | `app/organisation/page.tsx` | 0 |
| Organisation | `/organisation/reports/operations` | `app/organisation/reports/operations/page.tsx` | 0 |
| Organisation | `/organisation/reports/overview` | `app/organisation/reports/overview/page.tsx` | 0 |
| Organisation | `/organisation/system/import-export` | `app/organisation/system/import-export/page.tsx` | 0 |
| Organisation | `/organisation/system/info` | `app/organisation/system/info/page.tsx` | 0 |
| Organisation | `/organisation/system/mail` | `app/organisation/system/mail/page.tsx` | 7 |
| Organisation | `/organisation/system/manage` | `app/organisation/system/manage/page.tsx` | 0 |
| Organisation | `/organisation/system/reminders` | `app/organisation/system/reminders/page.tsx` | 1 |
| Organisation | `/organisation/users/add` | `app/organisation/users/add/page.tsx` | 5 |
| Organisation | `/organisation/users/new` | `app/organisation/users/new/page.tsx` | 5 |
| Organisation | `/organisation/users` | `app/organisation/users/page.tsx` | 0 |
| Shared/Public | `/` | `app/page.tsx` | 0 |
| Shared/Public | `/profile` | `app/profile/page.tsx` | 0 |
| SDU | `/sports-development/associations/form-b` | `app/sports-development/associations/form-b/page.tsx` | 8 |
| SDU | `/sports-development/associations/form-c` | `app/sports-development/associations/form-c/page.tsx` | 4 |
| SDU | `/sports-development/associations/forms` | `app/sports-development/associations/forms/page.tsx` | 0 |
| SDU | `/sports-development/associations/registration` | `app/sports-development/associations/registration/page.tsx` | 8 |
| SDU | `/sports-development/dashboard` | `app/sports-development/dashboard/page.tsx` | 0 |
| SDU | `/sports-development/leagues/[leagueId]` | `app/sports-development/leagues/[leagueId]/page.tsx` | 0 |
| SDU | `/sports-development/leagues/[leagueId]/teams/add` | `app/sports-development/leagues/[leagueId]/teams/add/page.tsx` | 3 |
| SDU | `/sports-development/leagues/add` | `app/sports-development/leagues/add/page.tsx` | 4 |
| SDU | `/sports-development/leagues` | `app/sports-development/leagues/page.tsx` | 0 |
| SDU | `/sports-development` | `app/sports-development/page.tsx` | 0 |
| SDU | `/sports-development/ranking` | `app/sports-development/ranking/page.tsx` | 0 |
| SDU | `/sports-development/reports` | `app/sports-development/reports/page.tsx` | 1 |
| SDU | `/sports-development/sports/[sport]/coaches` | `app/sports-development/sports/[sport]/coaches/page.tsx` | 7 |
| SDU | `/sports-development/sports/[sport]/governance` | `app/sports-development/sports/[sport]/governance/page.tsx` | 5 |
| SDU | `/sports-development/sports/[sport]` | `app/sports-development/sports/[sport]/page.tsx` | 6 |
| SDU | `/sports-development/sports/[sport]/participants` | `app/sports-development/sports/[sport]/participants/page.tsx` | 14 |
| SDU | `/sports-development/sports/[sport]/teams` | `app/sports-development/sports/[sport]/teams/page.tsx` | 8 |
| SDU | `/sports-development/sports` | `app/sports-development/sports/page.tsx` | 0 |
| SDU | `/sports-development/teams/add` | `app/sports-development/teams/add/page.tsx` | 3 |
| SDU | `/sports-development/teams` | `app/sports-development/teams/page.tsx` | 0 |

## Expanded Facilities source defaults

Preserve native IDs. Completion/review/template-edit/assignment usages are distinct behaviours, not definitions duplicated for every venue/submission.

| Native template ID | Title | Definition source |
| --- | --- | --- |
| `opening` | Daily Opening | `lib/facilityWorkflows.ts` |
| `closing` | Daily Closing | `lib/facilityWorkflows.ts` |
| `afternoon` | Afternoon Handover | `lib/facilityWorkflows.ts` |
| `night` | Night Handover | `lib/facilityWorkflows.ts` |
| `maintenance` | Weekly Maintenance Inspection | `lib/facilityWorkflows.ts` |
| `monthly` | Monthly Maintenance Review | `lib/facilityWorkflows.ts` |
| `sop` | Pitch Access & Safety Procedure | `lib/facilityWorkflows.ts` |
| `issue` | Report an Issue | `lib/facilityWorkflows.ts` |
| `fire` | Fire extinguisher inspection | `lib/facilityWorkflows.ts` |
| `first-aid` | First aid kit stock check | `lib/facilityWorkflows.ts` |
| `site` | Monthly site safety walkaround | `lib/facilityWorkflows.ts` |
| `signage` | H&S signage verification | `lib/facilityWorkflows.ts` |
| `event-form` | Event Form | `lib/facilityFormCatalogue.ts` |
| `maintenance-request` | Maintenance Request | `lib/facilityFormCatalogue.ts` |
| `maintenance-update` | Maintenance Update / Work Order | `lib/facilityFormCatalogue.ts` |
| `follow-up` | Compliance Follow-up Action | `lib/facilityFormCatalogue.ts` |
| `opening-sop` | Opening Procedure SOP | `lib/facilityFormCatalogue.ts` |
| `closing-checklist` | Closing Checklist | `lib/facilityFormCatalogue.ts` |
| `incident-form` | Incident Reporting Form | `lib/facilityFormCatalogue.ts` |
| `issue-review` | Review & Resolve Issue | `lib/facilityFormCatalogue.ts` |
| `photo-log` | Photo Log | `lib/facilityFormCatalogue.ts` |
| `booking` | Booking / Resource Reservation | `lib/facilityFormCatalogue.ts` |
| `quick-update` | Quick Update / Timeline Entry | `lib/facilityFormCatalogue.ts` |

## Representative distinctions

- FacilityForm: Create/Edit use Facilities API with Prisma writes; runtime persistence/approval is unverified.
- FormsAndProcedures: catalogue editing/assignments are browser-local; venue lookup GET does not persist answers.
- FacilityFormPreviewer, WorkflowCompletionForm and WorkflowRecordReview: template-driven preview/completion/review need mode-specific storage tracing.
- EventEditor: template preview and browser-record modes must be distinguished; Event title does not prove database integration.
- HR timesheets/weeks: Server Action writes a week pack; WeekGridDemo is a different demo editor.
- Sign-in/recovery/PasswordForm: Supabase Auth service, distinct from application-table persistence.
- Health: Run checks again is a system-action form; database SELECT 1 is not saved form submission.
- Organisation import-export: unconnected drop-zone/action controls have no ordinary form/input marker; manual review prevents omission.
- Account page imports PasswordForm; /profile is an alias redirect, not a new editable form.
- Finance: two page sources and six README-only planned areas; retain planned candidates/empty implemented-form group rather than fabricate forms.
- On-Hold, Shared/Public, unlinked pages, conditional editors and unused components remain in scope.
- Browser custom/edited catalogue definitions need separate reconciliation; cannot be known from this source scan.

## Verification boundary

Counts and paths were mechanically verified at the pinned commit. Default expansion was cross-checked against literal and mapped factories. Semantic completeness, permission enforcement, runtime persistence, local copies and production deployment are not certified. Architecture defines the downstream reconciliation and acceptance gate.
