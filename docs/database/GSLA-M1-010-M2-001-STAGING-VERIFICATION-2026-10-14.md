# GSLA-M1-010 / GSLA-M2-001 — Isolated Supabase execution evidence (2026-10-14)

**Specialist:** OM-EMP-014 Senior Database Engineer
**Status:** successful staging schema and selected integrity checks; **not approved for main database rollout or full acceptance**.
**Connected main:** GSLA WebApp — Development `bbpikpmffwbzhxdoughh` (read-only verification, no schema modification).
**Isolated staging branch:** `gsla-phase1-db-acceptance` / ref `tvkqoijrxnyjdbxxhckl`, created with previously acknowledged $0.01344/hour branching cost. Only synthetic test data used. Branch intended for deletion after evidence capture.
**GitHub:** merged PR #49 (M1-010); draft PR #71 (generic submissions); draft PR #72 (structured Events/Issues/AM+PM Handovers).

## Reproducible test reconstruction

Supabase automatic branch bootstrap did not carry over the Prisma-owned baseline: `public."Facilities Table"` and `_prisma_migrations` were absent immediately after branch creation. This is the same limitation as the earlier test branch. Rather than change main, the specialist reconstructed staging schema via the Supabase staging migration API, applying repository SQL in this order:

1. `00000000000000_baseline_init` (Prisma file)
2. `20260116094602_hr_timesheets_init` (Prisma file)
3. `20260930112500_facility_information_fields` (Prisma file; same schema purpose as existing Supabase migration)
4. `20260930164000_facility_opening_schedule`
5. `20261012130000_facilities_approval_contract` (merged PR #49)
6. `20261014170000_facility_form_submissions` (draft PR #71)
7. `20261014193000_facilities_phase1_operational_records` (draft PR #72)
8. Corrected approval eligibility trigger function in two separate staging patches after real test failures. Latest PR #72 SQL source includes the final corrected function.

All these stages returned `success:true` using test-only staging migration labels. **This does not certify the automatic Supabase branch bootstrap, Prisma migration history, production upgrade order, or full Prisma schema validation.** In production use a *single* chosen migration runner after the two histories are reconciled.

## Tested synthetic records

Two pre-existing Facilities fixtures preserved exactly:
- `11111111-1111-4111-8111-111111111111`, status Operational
- `22222222-2222-4222-8222-222222222222`, status Closed

After M1 migration both retained UUID/status, obtained `LEGACY_UNVERIFIED`, and had NULL historical approver/request/approved-content evidence. No historical approval was invented.

For positive operational-path testing only, the first fixture was explicitly moved to APPROVED through a synthetic request/decision fixture (not a real Organisation Admin API test). This demonstrated relational integrity but **does not prove live role enforcement**.

Positive SQL writes and read-backs: 1 typed Event (state Draft), 1 typed Issue (state New), 1 AM Handover, 1 append-only operational audit event. A PM Handover was inserted within `BEGIN` then `ROLLBACK`; subsequent PM row count was 0.

## Negative tests (observed PostgreSQL errors)

- New Issue against LEGACY_UNVERIFIED venue: P0001 eligibility denial.
- Invalid Event initial state Approved: P0001, require Draft.
- Duplicate AM Handover for same venue/day: 23505 unique constraint.
- Unknown Facility UUID in Issue insert: P0001 eligibility denial.
- Physical Facility DELETE: P0001 forbidden (existing M1-010 trigger).
- Mutation of operational audit history: P0001 append-only denial.
- Re-use of operational `command_id`: 23505 unique constraint.
- Modification of submitted M1 approval snapshot: P0001 immutable evidence denial.
- Real role-switched `SET LOCAL ROLE anon` select on facility_events: 42501 permission denied.
- Real role-switched `SET LOCAL ROLE authenticated` select on facility_form_submissions: 42501 permission denied.
- RLS + grant inventory across eight new tables: RLS on, zero policies, no anon/authenticated SELECT/INSERT/UPDATE/DELETE grants.
- Conditional recordVersion update: expected 2 -> 3 succeeded; second expected 2 returned zero rows. Illustrates CAS support; **not** a concurrent two-session race test.

An initial domain guard test failed due to an invalid event-field reference in the shared trigger; corrected in PR #72 commit `ad00153f4c89c06092fd51563fda542fe03f09c4` and staging patch. Another function delimiter syntax defect was caught and corrected in source. Both were fixed before positive tests.

## Outstanding release gates

- Prisma v6 `prisma validate` and `migrate deploy` on a source-consistent environment.
- Reconcile main `_prisma_migrations` (two applied entries) with Supabase migration history (four entries, including overlapping Facilities fields) and matching repository files. Never run both migration engines independently against main.
- Full **verified backup restoration** rehearsal and before/after manifests on production-like data, including any non-FK references. Transaction rollback was demonstrated, not backup restore.
- Full multiconnection race tests, request lifecycle transitions, version updates, immutable approval evidence cross-request matching and initial approval/archive actor authorization.
- Authenticated server command enforcement, Centre Manager venue assignments, archive/new-use decisions, event approval/signoff governance, safe write freeze and feature flag for historical API endpoints.
- Complete per-form approved Phase 1 register coverage (FRM-041 excluded), including catalogue templates/assignments, files and live AM/PM handover UI mapping. Browser-only originals are not yet imported.
- Role-by-role API/runtime negative tests and independent QA.

## Release safety and referrals

**Do not merge PR #71/#72, apply these migrations to main, or call this Preview owner-testable yet.** The old Facilities POST/PATCH implementation does not enforce the accepted approval state machine; event data currently lives in browser localStorage. Applying a database migration alone would give a false impression of working end-to-end functionality.

Backend (GSLA-M1-011 and M2-001): implement authenticated version-aware approval/archive commands, request/decision audit, typed Event/Issue/Handover APIs, assigned-venue scope, positive/negative state transitions, idempotency and venue eligibility in the same transaction. DB schema disallows direct client access but privileged Prisma bypasses RLS, so backend owns role checks.

Frontend (M2-001): connect real Create/Edit Facility, Events, Issues, AM/PM Handovers to these APIs; do not treat preview/localStorage actions as persisted. Clarify approved AM/PM mapping separately from native legacy Afternoon/Night templates. Preserve owner-only Form Control and preview distinctions.

QA: independent authenticated acceptance on the exact Vercel Preview and associated database deployment after coordination.

**Main database remains unmodified by this test run.**
