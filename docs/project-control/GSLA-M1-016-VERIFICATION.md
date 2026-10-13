# GSLA-M1-016 — Frontend Verification Evidence

2026-10-13 · Frontend Developer · baseline `175354cafe27c7c810de5493d23ade7baae2d743`.

## Performed checks

- TypeScript `tsc --noEmit`: PASS after owner UI/type changes.
- Scoped ESLint: PASS for `components/form-control`, `lib/form-control`, `app/owner/form-control`.
- `node tests/form-control/acceptance.cjs`: PASS. Actual presentation/parser/inspector code tested, using synthetic metadata. See [machine results](evidence/GSLA-M1-016-automated-checks.json).
- `node scripts/form-control/check-inventory.cjs --strict`: PASS, 66 distinct definition IDs; exactly 23 native defaults; 143 reviewed UI sources / 88 pages; no unexplained added/changed/removed source gaps in current working tree.
- Passive inspector SSR: no form submit tag, all inputs disabled, no file picker, no network request, escaped malicious labels and notes.
- Parser returns only ID/title/version/field structural metadata. Answers, files, data URLs, instructions, owners, assignments and private notes are omitted. Malformed/oversized metadata produces a visible unreconciled warning.
- Dynamic/external/encoded/traversal/query/unallowlisted routes cannot become Open links. Original pages retain their domain guards.
- Synthetic test checks Screen only + Ready + On hold independently; mixed modes; DB-linked-unverified classification; stale/removed retained evidence.
- Owner gate, middleware/cache policy, business components, existing forms, APIs/save handlers, database/schema/RLS/config and permission policy not modified.

## Honest runtime limits

Local Next production build was attempted twice but this restricted executor reports `ENOENT: uv_resident_set_memory`; it cannot provide the OS memory metric needed by the build worker. Prisma generation with a writable temporary directory works. This is an environment limitation, not a claimed successful local build. TypeScript/lint/tests are separate passing checks.

Vercel connector project inspection returns 403 for the project team. No credentials, scope permissions or owner designation were altered. Build/deployment evidence from the GitHub integration is recorded in the final receipt if available.

A synthetic interactive harness was successfully compiled from the actual UI components with non-production fixture metadata, preserving normal production guard code. Cloud Browser cannot reach the executor's localhost (`ERR_CONNECTION_REFUSED`). No authenticated Operational Owner browser session is available. Actual List/Card/filter/preview/local-read screenshots and signed-in runtime network/storage comparisons remain for secure owner-session verification. Synthetic checks are not reported as live runtime PASS.

No actual browser-local custom definitions are declared reconciled. The UI has explicit Local candidates / not yet reconciled coverage. Other devices/origins remain unknown.

## Controller checklist

Verify the exact PR/deployment commit and independent owner admission first. In an authorised owner session, compare storage/network before and after opening register, changing views/filters, inspecting a definition, previewing fields and refreshing. No business mutations, invitations, uploads, local writes or migrations may occur. Inspect this browser's definitions is the only explicit local read, and must not alter any original storage. Capture List, Cards, detail preview, empty Finance, local coverage, stale and tombstone states. Do not supply a fake domain record or grant a GSLA role just for Open verification.
