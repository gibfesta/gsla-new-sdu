# WORK ORDER — SHARED-WORKLOAD-CONTROL

22 October 2026. Frontend Developer, explicitly requested by Project Owner with six-panel workload reference. Build /facilities/shared-workload-control and manager detail pages under Planning & Events, using the existing GSLA banner, tables, List default/Card toggle and tabs. Cover manager summary, trends, required duties, task lists and management analysis. Provide working browser-local sample task assignment/status/reassignment controls with clear sample/persistence identity. All counts derive from the same task records; outstanding includes overdue. Reuse department authorization. No database, permission, employee records or production data changes. No staff-performance conclusions inferred from sample counts. Verify calculations, scope/filter combinations, persistence validation, UI rendering, TypeScript/lint/build and provide PR/receipt. Budget: one coherent frontend Preview; shared backend integration is separate work, not a hidden dependency or false connection claim.

# WORK RECEIPT — SHARED-WORKLOAD-CONTROL

**Date / role:** 22 October 2026 · Frontend Developer. **Outcome:** frontend sample workspace implemented for review, not live shared operations. Accepted source parent: `3f5e853353ecd9cf4cfed173648a8d37f37868d0`. No merge, production deployment or project task closure performed.

## Delivered

- Facilities sidebar entry under **Planning & Events**.
- Main page `/facilities/shared-workload-control`: Overview, Manager workloads, Required duties, Tasks, Management analysis.
- Detail route `/facilities/shared-workload-control/managers/[managerId]`: Overview, Tasks, Required duties, Events, Maintenance & issues, Handovers, Reports. Validated sample-manager IDs; unknown IDs return notFound. Period remains on manager links and Back.
- Existing GSLA department banner/account area, navy/blue palette, rounded panels, standard tables, responsive overflow, List default and Card toggle.
- Due-month/facility/manager filters; task search/status/type/priority filters; task assignment, edit, reassignment, due dates, priorities, status and text completion notes. Native modal dialog handles form entry/cancellation. Counts refresh from the same task dataset.
- Completed/outstanding/overdue/completion summaries; required-duty completion; work breakdown; six-month trends; management comparison. Text labels, line patterns and exact chart values supplement colour. No employee rating or automatic performance judgement.
- Separate versioned browser-local store `gsla-shared-workload-sample-v1`. Three fictitious managers; 372 sample tasks across May–October 2026. No real user names, staff records or operational records seeded. The visible badge states **Sample workspace · Saved in this browser · Not shared with colleagues**.

## Definitions / boundaries

A task belongs to its assigned sample manager's sample venue. Counts and trend points group by **due month**, not completion timestamp. Outstanding = assigned minus completed; overdue is an outstanding task with due date before today. No assignment yields a blank completion rate, not a misleading 0%/100%. Required-duty frequency labels describe the examples; automatic daily recurrence/rota generation is not implemented.

Events/issues/handovers/report tabs show **related task categories**, not copies of live operational records. Evidence is text only; no upload/document download is implied. Existing Event Control, issues, handovers, staff/CM assignments, database tables and save handlers are untouched. Shared cross-user persistence, live staff assignments, operational record links, notifications, audit trail and recurrence require a separate approved integration. Existing department server layout/role checks remain in force; this is not a new CM venue route or an access-policy change.

Malformed/oversized/duplicate/unknown-manager/invalid-date saved data is rejected. Invalid existing browser data is preserved and saving disabled. Quota/unavailable storage preserves session changes and shows a warning. No silent migration, real record creation or business API call occurs.

## Form inventory / documentation

New canonical editor `facilities.workload-task` receives **GSLA-FRM-067**, appended above the existing high-watermark. All 66 previous assignments remain byte-for-byte values and are never reused. Assign/edit/reassign and inline-status modes across both routes are usages of one definition, not one form per task/manager/tab. Browser-local connection, Ready for sample-review intended use, Planned operational lifecycle and implemented existence are independent. No database connection claim.

Updated canonical metadata, source/usage mappings, definition fingerprints and generated inventory exports, route registry and handbook. The accepted PR75/76 Forms & Procedures source fingerprints were reconciled as ID-display-only changes with no definition change. Strict source check now reports 67 definitions, 23 Facilities defaults, 148 UI sources /90 pages and no added/missing/changed source gaps. Those source counts are not form totals. Other-device/browser custom forms remain unreconciled.

## Verification

| Check | Result |
|---|---|
| `npm run build` (Prisma generation + Next/Turbopack production build) | PASS; both new routes included |
| TypeScript | PASS, standalone and build |
| Scoped ESLint across feature/sidebar/routes/tests | PASS, no remaining warnings |
| `node tests/shared-workload.cjs` | PASS: count invariants, month scopes, overdue boundaries, empty periods, schema/date validation, create/reassign/status storage, reload, malformed preservation, quota fallback, zero business network calls |
| `node tests/shared-workload-ui.cjs` | PASS: actual components with synthetic dependencies; List/Card, main/detail sections, filters/search/empty state, assignment dialog entry, status update, period links, escaped content and manager route allowlist |
| Strict inventory drift + previous permanent ID comparison | PASS |
| `git diff --check` | PASS |
| Authenticated deployed browser / visual screenshots | NOT PERFORMED; no signed-in browser session supplied; isolated localhost check returned ERR_CONNECTION_REFUSED |

Synthetic dependencies replace account/router/store boundaries for component checks; they do not modify production guards or certify a live role session. Browser-native modal focus, mobile layout and visual spacing still require Preview review. No screenshot or authenticated runtime success is fabricated. Build/compiler deprecation and old Browserslist notices are inherited; no build failure remains.

## Specialist Role Compliance

**Specialist Worker / Role:** Frontend Developer, assigned by the explicit owner request before implementation.

**Role Specification Reference:** request/reference image, project Specialist Worker Verification Standard and the scoped Work Order above.

**Responsibilities exercised:** GSLA visual/component consistency; coherent routes/navigation; local interaction/state design; single-source metric calculations; stable accessible controls; safe text rendering; transparent persistence/status labels; inventory/documentation maintenance.

**Checks actually performed:** TypeScript/lint/build, pure calculation/store tests, actual component handler/SSR checks, invalid metadata/dynamic-route checks, source drift and permanent-ID preservation. Vercel React checklist applied: pure derived filtering, immutable updates, stable keys, bounded client storage, no unnecessary effect-derived state, named controls, reusable shell and no live editor mounted by owner previews.

**Evidence inspected/produced:** six-panel owner reference, existing Facilities sidebar/banner/layout, accepted main source, new components/routes/store, two verification suites, generated inventory/mappings, this receipt and PR.

**Authority boundaries respected:** no employee/GSLA permissions, owner designation/identifier, schema/RLS/grants, shared operational persistence or existing business form behavior changed. Frontend readiness is limited to the stated sample intended use. No task marked Done.

**Items referred to another specialist:** Project Controller / independent reviewer for acceptance and Preview visual checks. Backend/Database/Architect specialists only for separately authorized real shared-task and live-operational integration; no claim they executed this work.

**Conclusion:** source implementation and isolated checks complete; Preview review pending. Shared operational capability is not represented as connected.

## What happens next

Review the PR and Preview, including desktop/mobile layout, tabs, manager navigation and native dialog keyboard behavior. Merge through the normal approved process. Agree the real staff/task/integration contract separately before treating this as a shared operational service.

## Plain-English explanation

The new pages let you try the workload layout, assign sample tasks and see the totals change. These tasks stay in the browser you use. They do not yet appear for colleagues or change real venue records.

## Copy/paste instructions for the next worker

Review Shared Workload Control on feat/facilities-shared-workload-control. Check Planning & Events placement, standard banner/account/table styling, List default/Card toggle, all main and detail sections, month/facility/manager/task filters, native dialog create/edit/reassignment/status, persistence after reload and invalid-manager 404. Verify sample/local identity stays clear and no real event/issue/handover/staff record is changed. Review responsive spacing and keyboard focus in Preview; no authenticated visual PASS is claimed. GSLA-FRM-067 maps only to facilities.workload-task; retain old IDs forever. Do not infer staff performance from counts or label this shared database-connected. Review the receipt/tests/inventory and apply the established merge/release process; any live integration needs its own approved backend/database scope.
