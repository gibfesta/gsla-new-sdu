# Owner Form Control — verified Live status policy

Updated 2026-10-14 · Task GSLA-M1-023 · PR #73

## Meaning of Live
Live is **not** synonymous with rendered UI, an API endpoint, a merged PR or source-level `DATABASE_PERSISTED`. A form is marked **Live — verified** only when the exact deployed workflow has independent positive save-and-retrieve evidence, role/negative-path evidence, and a reference to the evidence with environment and verification timestamp. No successful source build alone qualifies.

The canonical register is `config/form-control/register.json`. Optional `liveVerification` records are owned by acceptance verification, not inferred by the UI. Form ID values remain immutable.

## Categories
- Live — verified: valid database-persisted form with CURRENT source evidence and explicit attestation.
- Connected in code — not live-verified: server/API or database connection recorded but runtime evidence absent.
- Not live: UI-only, browser-local, planned, deprecated, removed.
- Unverified / needs review: source evidence stale or unknown.

## Owner surfaces
`/owner/form-control` List/Card, filter, counters; `/owner/form-control/[formId]` Detail; `/api/owner/form-control/export` CSV share one pure status calculation in `lib/form-control/presentation.ts`. They must remain owner-gated and private/no-store. Export includes both connection and derived Live Status, plus evidence reference.

## 2026-10-14 source baseline
66 reviewed forms; 0 explicitly verified Live; 0 currently flagged DATABASE_PERSISTED in the static register. These are metadata counts, **not live operational verification**. Do not promote records to Live based on PR #71 until database migration, deployed API, authenticated save/read and independent permissions evidence have passed.

## Acceptance
Run TypeScript, lint, build, List/Card/filter/CSV/detail consistency checks, owner positive and other-role direct URL/API denials. Attach run/deployment ID and commit, then independent QA decision. Until PASS, PR #73 remains draft and the source changes are not accepted as a verified Preview.
