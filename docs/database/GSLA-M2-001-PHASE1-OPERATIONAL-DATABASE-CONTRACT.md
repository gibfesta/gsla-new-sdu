# GSLA-M2-001 — Structured Facilities Phase 1 Database Contract (implementation candidate)

**Source:** owner-authorised 2026-10-14 Phase 1, approved form register `docs/form-control/MASTER-INVENTORY.md`, `lib/eventPageStore.ts`, `lib/facilityWorkflows.ts`, and M1-009 approval policy v0.2. Not evidence of deployment.

## Objects
- `facility_events`: typed venue UUID, event fields and ordered timestamps, structured status and auxiliary documents/staffing JSON. **The string `state='Approved'` in existing demo form does not constitute authenticated Organisation Administrator approval evidence.** The Backend specialist must provide explicit verified transition commands, immutable decision evidence and deny direct status updates.
- `facility_issues`: typed issue title/category/location/description/priority, immediate action, actor/timestamps and status; must permit currently authorised Centre Manager creation only after verified assigned-venue scope. An unscoped global read is prohibited.
- `facility_handovers`: one AM and one PM handover per facility/day; summary/risks/actions/message/acknowledgement from existing handover template. Actor and optimistic version included; business permission and correction/overwrite policy are NOT invented here.
- `facility_operational_audit`: immutable append-only operation evidence with command UUID; server writes must bind actor, role, versions and before/after.
- `facility_form_submissions` remains separate in PR #71 for approved versioned catalogue responses; cannot replace records above.

Migration file: `prisma/migrations/20261014193000_facilities_phase1_operational_records/migration.sql`. Must apply **after** M1-010 canonical UUID PK and before corresponding backend APIs are enabled. Existing Prisma migration chain and actual Supabase applied migration history must be reconciled before any target rollout. No production/main-development changes made.

## Role constraints and integration gates
1. Organisation Administrator approval for Facilities and Events remains in force. No direct browser writes. Database tables have RLS enabled, no public policies and revoke PUBLIC/anon/authenticated.
2. Facilities Administrator may prepare/submit records as authorised, not self-approve required Organisation decisions. Centre Managers may create venue-scoped issues and handovers as approved, without new master-record/event authority.
3. Backend M1-011/M2-001 implements transaction/version guards, server user/session-derived actor identity, allowed transition logic, scoped read, audit on every mutation, error handling and idempotency. A static typed DB record does not by itself enforce those business authorities.
4. Frontend M2-001 switches browser local Events/Issues/Handovers to verified APIs and preserves unsaved drafts on errors. Forms catalogue remains editable browser-local until template/assignment persistence is explicitly approved.
5. Run isolated migration, before/after manifests, positive/negative constraints, RLS/grant checks, old/new version races, rollback/restore, Prisma validate and runtime smoke, then independent QA.

## Unresolved approved register questions
Native preview has "Afternoon" and "Night" handover templates, but Owner mandates two handovers **AM and PM**. Migration stores the **explicitly approved periods** AM/PM, not an invented mapping of legacy template identities. The Backend/Frontend specialist must agree a UI mapping with the owner or approved design before importing browser-local previews.
The source Event editor uses fake text sign-offs; these must never become approved decisions in DB. File attachments are not migrated into JSON as privileged binary data. Event attachments require separately approved storage.
The exact approved Phase 1 subset needs Controller's per-form record of the canonical register; do not auto-promote every source default into operational scope. Retired FRM-041 excluded.

## Status
Repository-only contract; live migrations NOT applied. Owner-testable Preview and independent QA NOT achieved. Maintain M1-010 and M2-001 open.
