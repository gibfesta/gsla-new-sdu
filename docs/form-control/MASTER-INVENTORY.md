# GSLA-M1-016 — Reviewed Master Form Inventory

Generated from `config/form-control/register.json`; do not edit these exports independently.

Reviewed baseline: `175354cafe27c7c810de5493d23ade7baae2d743`. Source/handler evidence reviewed 2026-10-13 as Frontend Developer. Owner UI sources in the ledger are marked M1-016 working tree; final delivery commit is recorded in the Work Receipt.

**66 distinct source definitions; 23 Facilities source defaults included. 143 UI sources / 88 page sources accounted for. 29 README-only route candidates are separate, not form totals.**

Browser-local copies/customisations/deletions on other devices/origins are **not reconciled**. The register's explicit local-candidate section must remain visible. No full operational-readiness or live-saving certification is claimed.

## Area totals

| Area | Distinct definitions |
|---|---:|
| Organisation | 6 |
| Facilities | 32 |
| Sports Development Unit | 15 |
| Human Resources | 5 |
| Finance | 0 |
| Health | 1 |
| Login/Auth | 3 |
| On-Hold | 3 |
| Shared/Public | 1 |
| Owner/System | 0 |

## Definition register

| Form ID | Canonical ID | Form | Area | Connection | Lifecycle | Readiness | Usage modes |
|---|---|---|---|---|---|---|---|
| GSLA-FRM-001 | facilities.template.opening | Daily Opening | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-002 | facilities.template.closing | Daily Closing | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-003 | facilities.template.afternoon | Afternoon Handover | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-004 | facilities.template.night | Night Handover | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-005 | facilities.template.maintenance | Weekly Maintenance Inspection | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-006 | facilities.template.monthly | Monthly Maintenance Review | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-007 | facilities.template.fire | Fire extinguisher inspection | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-008 | facilities.template.first-aid | First aid kit stock check | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-009 | facilities.template.site | Monthly site safety walkaround | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-010 | facilities.template.signage | H&S signage verification | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-011 | facilities.template.sop | Pitch Access & Safety Procedure | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-012 | facilities.template.issue | Report an Issue | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-013 | facilities.template.event-form | Event Form | Facilities | MIXED | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template |
| GSLA-FRM-014 | facilities.template.maintenance-request | Maintenance Request | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-015 | facilities.template.maintenance-update | Maintenance Update / Work Order | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-016 | facilities.template.follow-up | Compliance Follow-up Action | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-017 | facilities.template.opening-sop | Opening Procedure SOP | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-018 | facilities.template.closing-checklist | Closing Checklist | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-019 | facilities.template.incident-form | Incident Reporting Form | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-020 | facilities.template.issue-review | Review & Resolve Issue | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-021 | facilities.template.photo-log | Photo Log | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-022 | facilities.template.booking | Booking / Resource Reservation | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-023 | facilities.template.quick-update | Quick Update / Timeline Entry | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | preview answers; edit template; assign template; venue preview answers |
| GSLA-FRM-024 | auth.sign-in | Staff sign in | Login/Auth | SERVER_SERVICE | IN_USE | NOT_ASSESSED | authenticate |
| GSLA-FRM-025 | auth.forgot-password | Password recovery request | Login/Auth | SERVER_SERVICE | IN_USE | NOT_ASSESSED | request recovery |
| GSLA-FRM-026 | auth.password | Set / change account password | Login/Auth | MIXED | IN_USE | NOT_ASSESSED | set password; change password; change password within account; disabled design preview; redirect alias; account redirect alias |
| GSLA-FRM-027 | on-hold.login | Public login | On-Hold | SERVER_SERVICE | ON_HOLD | NOT_ASSESSED | authenticate |
| GSLA-FRM-028 | on-hold.signup | Public signup | On-Hold | SERVER_SERVICE | ON_HOLD | NOT_ASSESSED | register |
| GSLA-FRM-029 | on-hold.profile-note | Public profile internal note | On-Hold | UI_ONLY | ON_HOLD | WORK_REQUIRED | note placeholder |
| GSLA-FRM-030 | organisation.user-intake.new | User intake wizard | Organisation | MIXED | NEEDS_REVIEW | NOT_ASSESSED | draft autosave; create account (UI-only) |
| GSLA-FRM-031 | organisation.user-intake.add | GSLA staff intake wizard | Organisation | MIXED | NEEDS_REVIEW | NOT_ASSESSED | draft autosave; create account (UI-only) |
| GSLA-FRM-032 | public.join | Public membership / role request wizard | Shared/Public | MIXED | NEEDS_REVIEW | NOT_ASSESSED | draft; submit UI-only |
| GSLA-FRM-033 | organisation.mail.compose | Compose mail / chat | Organisation | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | sendCompose |
| GSLA-FRM-034 | organisation.mail.mail-reply | Mail reply | Organisation | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | sendMailReply |
| GSLA-FRM-035 | organisation.mail.chat-reply | Chat reply | Organisation | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | sendChatReply |
| GSLA-FRM-036 | organisation.import | Dataset import drop-zone | Organisation | UI_ONLY | NEEDS_REVIEW | WORK_REQUIRED | import placeholder |
| GSLA-FRM-037 | facilities.information | Facility information (Create / Edit) | Facilities | MIXED | NEEDS_REVIEW | NOT_ASSESSED | create; edit; read; archive request (disabled) |
| GSLA-FRM-038 | facilities.event-record | Event record | Facilities | MIXED | NEEDS_REVIEW | NOT_ASSESSED | create; edit; read; venue read; archive request (disabled) |
| GSLA-FRM-039 | facilities.catalogue-editor | Workflow template editor | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | create template; edit template; editor host |
| GSLA-FRM-040 | facilities.catalogue-assignment | Template venue / date / event assignment | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | assign template |
| GSLA-FRM-041 | facilities.preview-venue | Browser-only preview venue | Facilities | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | add preview venue |
| GSLA-FRM-042 | facilities.booking-editor | Booking / resource reservation drawer | Facilities | UI_ONLY | NEEDS_REVIEW | WORK_REQUIRED | create; edit; delete |
| GSLA-FRM-043 | facilities.cm-cover | Temporary Centre Manager cover | Facilities | UI_ONLY | NEEDS_REVIEW | WORK_REQUIRED | assign cover placeholder |
| GSLA-FRM-044 | facilities.duty-team | Duty team shift selection | Facilities | UI_ONLY | NEEDS_REVIEW | WORK_REQUIRED | select shifts placeholder |
| GSLA-FRM-045 | facilities.workflow-review | Manager workflow record review | Facilities | UNKNOWN | NEEDS_REVIEW | WORK_REQUIRED | review (unused component) |
| GSLA-FRM-046 | sdu.association.registration | Form A — Association annual registration | Sports Development Unit | MIXED | NEEDS_REVIEW | NOT_ASSESSED | draft autosave; submit (UI-only); file selection metadata |
| GSLA-FRM-047 | sdu.association.form-b | Form B — Funding application | Sports Development Unit | MIXED | NEEDS_REVIEW | NOT_ASSESSED | draft autosave; submit (UI-only); file selection metadata |
| GSLA-FRM-048 | sdu.association.form-c | Form C — Results and outcomes | Sports Development Unit | MIXED | NEEDS_REVIEW | NOT_ASSESSED | draft autosave; submit (UI-only); file selection metadata |
| GSLA-FRM-049 | sdu.league-create | League details | Sports Development Unit | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | draft; save |
| GSLA-FRM-050 | sdu.team-create | Team details | Sports Development Unit | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | draft; save |
| GSLA-FRM-051 | sdu.league-entry | League team entry | Sports Development Unit | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | draft; save |
| GSLA-FRM-052 | sdu.overview.logo | Sport logo upload | Sports Development Unit | BROWSER_LOCAL | NEEDS_REVIEW | NOT_ASSESSED | edit logo |
| GSLA-FRM-053 | sdu.overview.committee | Sport overview committee editor | Sports Development Unit | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | mock modal |
| GSLA-FRM-054 | sdu.overview.league | Sport overview league quick-add | Sports Development Unit | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | mock modal |
| GSLA-FRM-055 | sdu.overview.team | Sport overview team quick-add | Sports Development Unit | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | mock modal |
| GSLA-FRM-056 | sdu.overview.coach | Sport overview coach quick-add | Sports Development Unit | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | mock modal |
| GSLA-FRM-057 | sdu.sport.participants | Participant details | Sports Development Unit | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | create mock; edit mock |
| GSLA-FRM-058 | sdu.sport.coaches | Coach details | Sports Development Unit | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | create mock; edit mock |
| GSLA-FRM-059 | sdu.sport.teams | Sport team details | Sports Development Unit | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | create mock; edit mock |
| GSLA-FRM-060 | sdu.sport.governance | Sport governance role | Sports Development Unit | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | create mock; edit mock |
| GSLA-FRM-061 | hr.leave | Leave request / manager review | Human Resources | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | create request; approve; reject |
| GSLA-FRM-062 | hr.week-pack | Create timesheet week pack | Human Resources | SERVER_SERVICE | NEEDS_REVIEW | NOT_ASSESSED | create week |
| GSLA-FRM-063 | hr.week-grid | Timesheet week grid | Human Resources | UI_ONLY | NEEDS_REVIEW | NOT_ASSESSED | edit demo cells; week route host |
| GSLA-FRM-064 | hr.note | Employee HR note | Human Resources | UI_ONLY | NEEDS_REVIEW | WORK_REQUIRED | note placeholder |
| GSLA-FRM-065 | hr.document-upload | Employee document upload placeholder | Human Resources | UI_ONLY | NEEDS_REVIEW | WORK_REQUIRED | upload placeholder |
| GSLA-FRM-066 | health.check | Run system health checks | Health | SERVER_SERVICE | NEEDS_REVIEW | NOT_ASSESSED | refresh GET checks |

## Reconciliation decisions

- Native template IDs identify the 23 source defaults; annual versions, venue instances and submitted records do not add definitions. The generic completion renderer is unused and creates no extra template identity; its missing caller/storage is explicit. Manager workflow review remains an unused form with unknown persistence.
- PasswordForm is one definition with Set, Change, Account and disabled design-preview modes. Reset/Profile are redirect usages, not extra identities. Facilities /forms is an alias of Forms & Procedures and is mapped to the same definitions.
- Event record editor and event catalogue template have different purposes/storage modes and remain separate definitions. Facility schedule is a nested part of Facility information.
- Organisation new/add intake variants have separately maintained fields and draft keys; sport quick-add mock modals differ from full league/team/coach forms and are retained separately. Repeated fields/rows within a wizard are not independent forms.
- HR week-pack creation is server/database linked; the WeekGridDemo cells remain Screen only. No form is labelled DATABASE_PERSISTED without a verified write/reopen round trip.
- Finance has zero implemented forms. Six Finance README routes remain planned candidates within the separate route-candidate ledger. A page action pointing at a missing route does not prove a form exists.
- A custom local definition is a candidate until reviewed identity/provenance resolves; source-ID matches are not automatically declared equivalent. No submissions, files, instructions, personal assignments or owner identifiers enter the manifest.

## Detailed exports

- [master-inventory.csv](master-inventory.csv): one row per usage/mode, full route/source/API/database/readiness notes.
- [facilities-source-defaults.csv](facilities-source-defaults.csv): 23 native definitions, separate expansion.
- [source-review.csv](source-review.csv): all reviewed UI sources, page/import/alias/exclusion dispositions and evidence hashes.

## Excluded auxiliary controls

| Source | Reason |
|---|---|
| components/app-shell/HeaderBar.tsx | Header search and mailbox badge; navigation/search is auxiliary, not a submitted form. |
| app/facilities/events-control/page.tsx | Venue/status/date search filters only; event create/edit forms live in EventEditor. |
| app/facilities/facilities-directory/page.tsx | View/action record selection only; FacilityForm is separately mapped. |
| app/human-resources/employees/page.tsx | Directory query/department/status filters; Add Employee route is README-only. |
| app/sports-development/reports/page.tsx | Sport/time range filter for charts; does not capture a business record. |
| components/facilities/SharedCalendarBoard.tsx | Date/venue/event filters; Add Event navigates to existing editor. |
| components/facilities/WorkflowAttachments.tsx | Nested attachment field control, inherited by host forms; not a separate submission definition. |
| components/facilities/FacilityScheduleEditor.tsx | Nested facility schedule/closure fields saved by FacilityForm; not a separate definition. |
| app/organisation/system/reminders/page.tsx | Search plus immediate Mark done demo action, no data-entry/editor. Create Reminder has no handler/form. |
| components/facilities/FacilityFormBlueprint.tsx | Unused informational field-list blueprint. Not mounted or editable; catalogue definitions represent current fields. |

Other information-only pages, redirects, display components, generic UI wrappers and owner inspection controls have explicit individual dispositions in source-review.csv. Placeholder form-shaped entry sections are included; simple navigation, search/filter selection and immediate action buttons without an entry form are excluded with reasons.

## Evidence maintenance

Run `node scripts/form-control/check-inventory.cjs --strict` before accepting a new source revision. Added/changed/removed sources cause review failures; never delete stale definitions silently. The pure assessSourceEvidence helper supports CURRENT/STALE/REMOVED states, and the UI retains tombstones with Open disabled. Definition fingerprints cover actual handler/template files outside TSX as well. Runtime does not crawl the repository. Different deployment/source commits show Inventory needs review until controller reconciliation.

Run `node scripts/form-control/export-review.cjs` after an approved manifest change. Readiness is independent of connection, lifecycle and intended use. Source-only evidence is not runtime persistence proof.
