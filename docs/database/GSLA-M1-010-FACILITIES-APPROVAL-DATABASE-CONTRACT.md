# GSLA-M1-010 — Facilities approval database contract and controlled migration

**Status:** implementation candidate for independent review; not production-deployed or certified.
**Owner:** Senior Database Engineer. **Source:** accepted M1-009 architecture, PR #44, merge `46141baf79b39995abc078161605ba6c7344753f`.
**Policy authority:** `docs/data-ownership-and-access.md` v0.2; no new role authority granted.

## Observed baseline (2026-10-12)

Connected Supabase **GSLA WebApp — Development**, project reference `bbpikpmffwbzhxdoughh`, PostgreSQL 17.
Read-only queries observed 0 Facilities rows, 0 distinct UUIDs, and 0 timesheet week packs.
The live Facilities primary key spans UUID, name, type, status, address, contacts, notes, creation and update timestamps.
RLS was enabled (not FORCE); `pg_policies` returned no Facilities policies. `anon`, `authenticated`, and `service_role` possessed broad Facilities table grants (including UPDATE/DELETE). Those grants alone do NOT establish effective RLS access. Service/owner connections can bypass RLS; backend boundary certification is separate.
The development inventory cannot establish production data safety.

## Migration ownership and rollout

Only one authoritative migration runner may control this database at cutover. Repository source is `prisma/migrations/20261012130000_facilities_approval_contract/migration.sql`; do not independently apply a second Supabase CLI/MCP DDL migration against the same database while Prisma migration history is authoritative.
1. Confirm Prisma migration baseline against `_prisma_migrations`; inspect current PK, referencing foreign keys, all dependent queries and role grants. Resolve drift before attempting migration.
2. Take and **verify restore** of a full environment backup. Inventory row counts, UUIDs, dependent tables and exact schemas; save hashed manifest in controlled release evidence without exposing personal data.
3. Run the migration on a cloned/staging database first with production-like sample legacy rows and references. The migration deliberately aborts if UUIDs duplicate or existing foreign keys reference the composite PK. Review any new referencing FK independently.
4. Coordinate a maintenance/write-freeze and backend release. Old POST/PATCH endpoints must never continue unrestricted after the schema is activated. Gate application writes until version-aware commands and read projections are live.
5. Deploy with the chosen **single** migration runner; generate Prisma client; compare migration checksums and introspected schema. Confirm all old UUIDs, rows, status values, timesheet relationships and historical activities are retained.
6. QA verifies exact approved lifecycle in staging, API permissions in its own work order, plus database invalid paths; release only after Controller sign-off.

## Physical data contract

`Facilities Table.id` is the canonical UUID PK; other identifying text is editable. Old facility IDs are preserved. Existing `status` remains operational status and is not mapped to approval.
`approval_state`: `DRAFT|PENDING_APPROVAL|CHANGES_REQUESTED|REJECTED|APPROVED|LEGACY_UNVERIFIED`.
`lifecycle_state`: `ACTIVE|ARCHIVED`. `record_version` starts at 1 and increments per command; `content_version` starts at 1 and increments on information edits only. Versions are **caller transaction obligations** and must use expected-version CAS locks, not a promise made by DEFAULT values.
New rows default DRAFT; rows present at migration time are tagged LEGACY_UNVERIFIED without creating approval evidence. On non-empty legacy databases obtain owner-level review and explicit subsequent preparation/approval; do not automatically alter operational selectors during rollout.
`facility_requests`: stable request UUID, immutable submission snapshot and submitter, distinct request kind, one partial-index-enforced PENDING request per facility, one terminal decision at most, command UUID uniqueness, decision reason on return/reject. Decision evidence is a final state on a durable request; its submitted evidence columns cannot be rewritten.
`facility_revisions`: unique facility/content version and attributable complete information snapshot; immutable via trigger.
`facility_audit_events`: immutable attributable event; optional request/revision linkage, command correlation; immutable via trigger.
All child-to-facility relations use RESTRICT. Actor IDs are retained as UUID evidence without cascade links to profile deletion. Archive attribution is stored on facility; immutable archive decision evidence belongs to the ARCHIVE request and audit event.
`pending_request_id` and `initial_approval_request_id` have composite foreign keys tying them to the same facility. The backend transaction is responsible for ensuring referenced request kind and status, and synchronizing request/facility states.

## Concurrency command sequence (required by Backend)

Run a command inside one PostgreSQL transaction. Lock facility `SELECT ... FOR UPDATE`, check expected `record_version` and, where relevant, submitted `content_version`, request UUID and request version. Check current authoritative roles at the API/session boundary. Make linked request/revision/audit/facility updates atomically; increment record_version exactly once, content_version exactly once only for information edits. Use `command_id` uniqueness to resolve exact retries. A rejected optimistic update returns conflict; do not auto-overwrite.
For archive review with content update: supersede the old pending request in the same transaction and clear pending request pointer. No backdoor approval via information PATCH or legacy status values.
SQL constraints alone cannot determine the identity/role of an API caller using a privileged Prisma database role. Backend must enforce authority on every command and suppress arbitrary Prisma updates to server-owned fields.

## Security/RLS and grants

The existing Facilities table has RLS enabled and **no policies** in the inspected development environment, so table grants to browser roles should not be mistaken for access authorization. Keep effective direct writes fail-closed. New request/revision/audit tables have RLS enabled, no generic policies, and explicit REVOKE from PUBLIC/anon/authenticated. Existing direct DELETE/TRUNCATE privileges on Facilities are revoked; a delete-blocking trigger protects even privileged ordinary DML delete.
Do not grant `authenticated` all-row access: M1-007 must design CM history/assigned-venue projections independently. No RLS policy is asserted for Facilities admin direct writes: administrative mutations go through the verified server and roles checked there.
Audit existing `postgres`/service-role/connection-string usage and any security-definer functions or views; service_role can bypass RLS, table-owner connections usually do also. Trigger/constraint protections remain valuable but cannot replace server authority. PostgreSQL superusers/table owners can modify/drop triggers; restrict operational credentials accordingly. Do not expose service credentials to clients.
Role grant queries, `pg_policies`, `relrowsecurity` and negative direct-access tests must be repeated after deployment. No complete RLS/grant certification is claimed from the source migration alone.

## Recovery and rollback

**Preferred recovery:** restore the verified database snapshot into an isolated instance, compare checksums, then controlled fail-forward. Preserve new approval/revision/audit evidence in any production fallback; do not redeploy unrestricted old write handlers.
**Before new workflow writes:** an isolated restore of the pre-migration backup can recover the old schema/data, but dropping workflow tables/columns is forbidden once new evidence exists. No destructive down migration is provided.
Migration DDL is inside a PostgreSQL transaction and should roll back atomically on an exception. Backup restore itself and production fail-forward have **not** been exercised here.

## Required verification register

- [x] Source architecture and Prisma schema inspected
- [x] Development Facilities count and UUID cardinality queried (0 / 0)
- [x] Live primary key, RLS enabled status, policies and direct grants inspected
- [x] Guarded SQL and Prisma contract committed in review branch
- [ ] Prisma validation and migration dry-run on isolated staging with realistic fixtures
- [ ] Pre/post row manifest, FK/PK integrity and migration checksum comparison
- [ ] Positive/negative request transitions, one-pending-index, idempotency, concurrency tests
- [ ] Legacy fixture migration without false historical approval
- [ ] Verified backup restore / write-frozen rollback rehearsal
- [ ] Post-migration RLS/grant negative tests and advisor findings
- [ ] Backend privileged path and version enforcement (Senior Backend Developer)
- [ ] Application UX/read projection and independent end-to-end QA

## Cross-specialist referrals

**Backend:** implement role-gated transactional commands, immutable snapshot creation, matching current request states, optimistic locking, command IDs and version increments; ensure all Prisma bypass paths use the command service.
**Software Architect/Project Controller:** approve any deviation necessitated by actual composite-key dependencies; determine legacy operational cutover/disposition and write-freeze fallback.
**QA:** independently test state and authority matrix, including stale/race cases and archived history.
**Documentation:** this contract supplements `docs/architecture/FACILITIES-APPROVAL-WORKFLOW.md` and `docs/data-ownership-and-access.md`; business permissions unchanged. Handbook should link this implementation record only after acceptance.
