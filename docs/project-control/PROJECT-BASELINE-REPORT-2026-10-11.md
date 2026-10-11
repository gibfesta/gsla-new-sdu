# GSLA WebApp — Project Baseline Report

**Control task:** GSLA-M0-002  
**Milestone:** M0 — Project Control & Baseline  
**Status:** Draft reconciliation for Project Controller review  
**Baseline date:** 2026-10-11  
**Repository:** gibfesta/gsla-new-sdu

## Purpose

This report reconciles the current repository, merged pull-request history, route tree and authoritative project documentation into a single verified baseline.

It does **not** treat a merged PR, successful build or existing page as automatically Done. Where runtime, security, data, role or acceptance testing remains outstanding, the item is classified accordingly.

## Evidence reviewed

- Current `main` repository tree
- 84 current `app/**/page.tsx` pages
- 4 current `app/api/**/route.ts` endpoints
- Merged PRs #1–#16 and #21
- GSLA WebApp System Handbook
- Page & Route Registry
- Facilities Forms Integration Register
- Data Ownership and Access draft
- Legacy Admin / SuperUser Redirect Audit
- Documentation Maintenance Rule
- Existing Project Control Issues #17–#20

## Reconciliation principles

- **Verified Complete**: evidence supports the intended scope and no known acceptance criterion remains for that historical scope.
- **Implemented / Needs Verification**: code exists, but runtime, security, permissions, data round-trip, visual or acceptance evidence is incomplete.
- **Outstanding**: required work is clearly not implemented.
- **Blocked**: work cannot proceed until a named dependency/decision is resolved.
- **On Hold**: work is deliberately paused.
- **Planned / Backlog**: known future work not yet scheduled.

---

# 1. Project Control

| Area | Baseline status | Evidence / note |
| --- | --- | --- |
| Project Control Guide | Verified Complete | Merged through PR #21 and verified on main |
| Work Order Standard | Verified Complete | Merged through PR #21 |
| Work Receipt Standard | Verified Complete | Merged through PR #21 |
| Status / Reporting Rules | Verified Complete | Merged through PR #21 |
| Controlled GitHub Issue template | Verified Complete | Present on main |
| Interactive GitHub Project board | Superseded | Built and used during M0, then replaced by Breeze as the operational control board on 2026-10-11. GitHub remains the technical record. |
| Historical project reconciliation | In Progress | GSLA-M0-002 |
| Exhaustive Page & Route Registry | Outstanding | Existing registry explicitly states it is not exhaustive; GSLA-M0-003 |

---

# 2. Architecture, Routes and Documentation

| Area | Baseline status | Evidence / note |
| --- | --- | --- |
| Department-based application restructuring | Verified Complete for structural scope | PR #5 reorganised routes and documented migration; later route work preserved canonical department structure |
| Organisation rename / route ownership | Implemented | Current tree uses `/organisation`; technical docs updated |
| Authentication route-group consolidation | Implemented / Needs Runtime Verification | Current source is under `app/(auth)/`; Page & Route Registry explicitly requires production/account-flow verification |
| Compatibility redirects | Implemented / Needs Audit | 31 legacy Admin/SuperUser rules retained; removal not approved |
| Page & Route Registry | Outstanding | Current registry is only a verified subset |
| Legacy redirect dependency audit | Implemented / Incomplete | Read-only audit exists; exhaustive dependency/runtime verification remains |
| System Handbook | Verified Complete as baseline document | Present and linked from README |
| Continuous Documentation Rule | Verified Complete | Approved baseline on 2026-10-11 |

Current source inventory at this baseline:
- **84 UI pages**
- **4 API route files**
- Multiple README-reserved planned areas; these must not be treated as implemented features.

---

# 3. Authentication, Roles and Permissions — M1

| Capability | Baseline status | Evidence / note |
| --- | --- | --- |
| Supabase authentication foundation | Implemented | Handbook records current Supabase Auth use |
| Sign-in / password recovery route organisation | Implemented / Needs Runtime Verification | Current auth route group and recent consolidation commits |
| Organisation Administrator role routing | Implemented / Needs Negative Testing | Handbook states initial role-based routing exists but requires comprehensive testing |
| Facilities Administrator role routing | Implemented / Needs Negative Testing | Same |
| Facilities API role guards | Implemented / Needs Security Verification | Handbook notes initial guards exist; current security not signed off |
| Centre Manager authentication | Implemented / Partial | Can authenticate and reach awaiting-assignment |
| Centre Manager facility-scoped assignment/access | On Hold / Outstanding | Handbook explicitly says venue-scoped assignment/access remains future work until real facilities exist |
| Data Ownership & Access policy | Blocked by business approval | `docs/data-ownership-and-access.md` is REVIEW DRAFT v0.1 and says no access decision is approved |
| Full server/database authorisation accreditation | Outstanding | Security not signed off; runtime role/API/database tests remain |
| Supabase RLS / public-schema security review | Outstanding | Legacy audit records unresolved RLS and function-security findings |

### Key M1 dependency

The **Data Ownership & Access Matrix must be approved** before permission implementation can be considered authoritative across departments.

---

# 4. Facilities — M2 / M3

## Facilities foundation

| Capability | Baseline status | Evidence / note |
| --- | --- | --- |
| Facilities department/venue workspace separation | Verified Complete for UI structural scope | PR #14 |
| Facilities Home / Directory route structure | Implemented | Current tree and architecture docs |
| Create Facility form | Implemented / Needs Full Acceptance | API-backed; handbook says create/edit/read require full acceptance testing |
| Edit Facility form | Implemented / Needs Full Acceptance | Shared FacilityForm and API path documented |
| Facility database/API foundation | Implemented / Needs Security & CRUD Verification | Prisma/PostgreSQL integration exists |
| Complete facility information fields | Implemented in source / Needs Production Verification | PR #16 plus later docs; historical PR warned live migration/display integration was incomplete |
| Directory/venue information reading saved records | Implemented | Current architecture documentation says current directory/venue information read saved Prisma records |
| Facility archival | Implemented page exists / Needs Behaviour Verification | Current tree includes archive page; not certified operational by baseline evidence |

## Facilities forms

| Capability | Baseline status | Evidence / note |
| --- | --- | --- |
| Forms & Procedures UI | Implemented | Existing component and route |
| Predefined Facilities forms catalogue | Implemented locally | 23 templates documented |
| Form editing/assignment persistence | Partial / Browser localStorage only | Not shared production persistence |
| Export/reconcile local browser forms | Outstanding | Required before migration |
| Persistent form templates database | Outstanding | Proposed only |
| Persistent venue form assignments | Outstanding | Proposed only |
| Persistent submissions/history | Outstanding | Proposed only |
| Form attachments | Outstanding | Proposed only |
| Form role/permission enforcement | Blocked / Outstanding | Requires approved access model plus backend implementation |
| Master form register | Planned / Missing authoritative document | Handbook points to planned document |
| Form development standard | Planned / Missing authoritative document | Handbook points to planned document |
| Form-to-database mapping document | Planned / Missing authoritative document | Handbook points to planned document |

## Facilities operations

| Capability | Baseline status | Evidence / note |
| --- | --- | --- |
| Events Control UI/routes | Implemented | Current route tree |
| Event new/edit/archive/detail pages | Implemented pages / Needs Workflow Verification | Pages exist; persistence/role behaviour not certified |
| Shared Calendar | Implemented UI / Demo-data risk | Architecture notes current calendar has sports-focused sample events |
| Maintenance & Issues | Implemented UI / Needs live workflow verification | Route exists; production data status not certified |
| Compliance | Implemented UI / Needs live workflow verification | Route exists |
| Procedures & SOP | Implemented UI / Needs live workflow verification | Route exists |
| Reports & History | Implemented UI / Needs live workflow verification | Route exists |
| CM Assignments | Implemented page / Business workflow incomplete | Centre Manager assignment remains out of scope until real facilities exist |
| Duty Team | Preview / Outstanding | Controls disabled; no DB persistence |
| Shift Black/Grey/White assignment | Outstanding | Planned build gate |
| Operational audit history | Outstanding | Proposed data model only |
| Full Facilities release accreditation | Outstanding | Depends on auth, permissions, CRUD, forms, ops and negative testing |

---

# 5. Human Resources — M4

| Capability | Baseline status | Evidence / note |
| --- | --- | --- |
| HR dashboard and styling | Implemented | PR #11 and PR #15 |
| Employee pages | Implemented UI / Demo-data risk | Current routes exist; handbook does not certify production persistence |
| Leave page | Implemented UI / Demo-data risk | Current routes exist |
| Timesheet pages | Implemented / Partial live DB | Handbook records three timesheet tables retained |
| HR access/data implementation | On Hold | Handbook explicitly states HR development is on hold |
| Direct anon/authenticated DB access | Restricted | Handbook records RLS enabled/revoked direct access for timesheet tables |
| Full HR permissions and production accreditation | On Hold / Outstanding | Requires future HR resumption and approved data-access decisions |

---

# 6. Sports Development Unit — M5

| Capability | Baseline status | Evidence / note |
| --- | --- | --- |
| SDU dashboard and navigation | Implemented | PR #10 |
| SDU styling consistency | Implemented for covered pages | PR #15 |
| Sports directory/routes | Implemented UI | Current route tree |
| Associations/forms routes | Implemented UI | Current route tree |
| Leagues / teams routes | Implemented UI | Current route tree |
| Ranking page | Implemented page | Current tree contains `sports-development/ranking/page.tsx` |
| Reports | Implemented UI | Current route tree |
| Association submodule planned pages | Planned / Outstanding | Multiple README-only areas |
| Compliance / programmes / settings | Planned / Outstanding | README-only areas |
| Live production data integration | Outstanding / Mixed demo | Handbook/readme state several pages remain demo/local |
| Department permissions | Outstanding | Access matrix not approved |

---

# 7. Finance — M6

| Capability | Baseline status | Evidence / note |
| --- | --- | --- |
| Finance dashboard and sidebar | Implemented | PR #13 |
| Finance operational records/workflows | Outstanding | PR #13 explicitly states records/workflows not connected |
| Budget creation | Planned | README-only new route |
| Expenditure creation | Planned | README-only new route |
| Invoice creation | Planned | README-only new route |
| Supplier creation | Planned | README-only new route |
| Reports/settings | Planned | README-only areas |
| Finance permissions/data policy | Outstanding / Blocked by policy approval | Access decisions not approved |

---

# 8. Organisation & WebApp Health — M7

| Capability | Baseline status | Evidence / note |
| --- | --- | --- |
| Organisation Home | Implemented | Current route and docs |
| Organisation Health page | Implemented | Current route; earlier PR #12 created health dashboard under previous ownership |
| Organisation users/system tools | Implemented pages | Current route tree |
| Health monitoring completeness | Outstanding | Handbook says security not signed off; historical health scope explicitly left integrations/services unmonitored |
| Organisation reports | Implemented pages / Needs live-data verification | Current route tree |
| Production hardening/security accreditation | Outstanding | Explicit handbook gap |
| Final handover certification | Outstanding | Handbook exists but operational certification is not complete |

---

# 9. On-Hold Work

The following are deliberately not active development at this baseline:

1. **Human Resources development** — explicit handbook on-hold status.
2. **Centre Manager venue-scoped assignment/access** — deferred until real facilities exist.
3. **On-Hold-Pages** login/profile/signup area — repository explicitly retains an On-Hold area; do not silently reactivate.
4. Legacy redirect removals — no removal is approved until dependency/runtime audits pass.

---

# 10. Current Blockers / Decisions

## B1 — Data Ownership & Access approval
The developer-facing access document is a draft. Business decisions for create/read/edit/approve/archive/export scope must be approved before they become implementation requirements.

## B2 — Facilities production security
Facilities APIs/database flows require comprehensive role, venue-scope and negative security testing before production accreditation.

## B3 — LocalStorage Facilities forms
Browser-only custom forms/assignments may contain user edits. They must be exported/reconciled before switching storage.

## B4 — Real facilities / Centre Manager assignments
Venue-scoped Centre Manager access should not be finalised against preview/demo facilities.

## B5 — Page/route inventory
The registry is not exhaustive. Route cleanup and legacy redirect decisions depend on GSLA-M0-003.

---

# 11. Proposed Controlled Task Set

**Do not create these Issues until Project Controller presents them for approval.**

## M1 — Core Platform, Authentication & Permissions

- **GSLA-M1-001 — Verify authentication and password-recovery flows end-to-end**
- **GSLA-M1-002 — Approve Data Ownership & Access Matrix**
- **GSLA-M1-003 — Verify Organisation Administrator access boundaries**
- **GSLA-M1-004 — Verify Facilities Administrator access boundaries**
- **GSLA-M1-005 — Audit and harden current API/database authorisation**
- **GSLA-M1-006 — Review Supabase RLS, grants and public-schema security findings**
- **GSLA-M1-007 — Define Centre Manager venue-assignment security model** — On Hold until real facilities

## M2 — Facilities Data & Forms

- **GSLA-M2-001 — Acceptance-test Create/Edit Facility full data round-trip**
- **GSLA-M2-002 — Complete Facilities form inventory and development standard**
- **GSLA-M2-003 — Export and reconcile browser-local Facilities forms**
- **GSLA-M2-004 — Approve Facilities form database model and mappings**
- **GSLA-M2-005 — Implement persistent form catalogue and assignments**
- **GSLA-M2-006 — Implement form submissions, history and attachments**

## M3 — Facilities Operations & Release

- **GSLA-M3-001 — Verify Events Control persistence and role behaviour**
- **GSLA-M3-002 — Define and connect Shared Calendar live-data ownership**
- **GSLA-M3-003 — Verify Maintenance & Issues live workflow**
- **GSLA-M3-004 — Verify Compliance / Procedures / Reports workflows**
- **GSLA-M3-005 — Implement Duty Team and Black/Grey/White shift persistence**
- **GSLA-M3-006 — Implement Centre Manager venue assignments** — On Hold pending M1-007 / real facilities
- **GSLA-M3-007 — Facilities end-to-end operational acceptance and release gate**

## M4 — Human Resources

- **GSLA-M4-001 — Resume and re-baseline HR module** — On Hold
- Further HR tasks should not be expanded until M4-001 is intentionally resumed.

## M5 — Sports Development Unit

- **GSLA-M5-001 — Audit SDU demo/live data and workflow completeness**
- **GSLA-M5-002 — Complete association submodule planned pages**
- **GSLA-M5-003 — Implement SDU permissions and approved data access**
- **GSLA-M5-004 — Verify Ranking methodology/data integration**

## M6 — Finance

- **GSLA-M6-001 — Define Finance data model and permissions**
- **GSLA-M6-002 — Implement Budget workflow**
- **GSLA-M6-003 — Implement Expenditure / Purchase Request workflow**
- **GSLA-M6-004 — Implement Invoice workflow**
- **GSLA-M6-005 — Implement Supplier workflow**

## M7 — Organisation, Health & Production Hardening

- **GSLA-M7-001 — Define WebApp Health monitoring coverage**
- **GSLA-M7-002 — Complete security accreditation / negative test programme**
- **GSLA-M7-003 — Complete legacy redirect disposition after route audit**
- **GSLA-M7-004 — Production readiness, rollback and handover acceptance**

---

# 12. Recommended Immediate Sequence

After M0 reconciliation:

1. **GSLA-M0-003 — Complete Page & Route Registry**
2. **GSLA-M1-002 — Approve Data Ownership & Access Matrix**
3. **GSLA-M1-001 — Verify auth/password flows**
4. **GSLA-M1-003 / M1-004 / M1-005 — role and API security verification**
5. **GSLA-M2-001 — Facility CRUD/data round-trip acceptance**
6. Then proceed into Facilities forms and operations in dependency order.

This sequence deliberately prevents us from wiring more production data before access boundaries and route ownership are controlled.

## Baseline conclusion

The project is not “starting from scratch.” A substantial frontend, route architecture, authentication foundation and Facilities database foundation already exist.

The main project-management correction is to stop treating **implemented pages** as equivalent to **completed production workflows**.

The next phase should concentrate on:
- exhaustive route control;
- permission decisions and security verification;
- Facilities data/forms persistence;
- operational acceptance;
- then controlled expansion into the later departments.


---

## Post-baseline control migration — Breeze

**Date:** 2026-10-11

After this baseline was produced, the operational control layer was migrated from GitHub Projects to the Breeze project **GSLA WebApp — Project Control**.

Current responsibility split:

- **Breeze:** operational task board, milestone swimlanes, workflow stages, dependencies, blockers/on-hold state, verification and day-to-day sequencing.
- **GitHub:** permanent technical record for source code, Issues, pull requests, commits and source-controlled documentation.
- **GitHub Projects:** superseded and no longer required for GSLA WebApp operational control.

The historical references in this report to the initial GitHub Project setup remain evidence of what was built during M0; they must not be interpreted as the current control architecture.
