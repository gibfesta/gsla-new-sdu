# GSLA-M1-021 — Playwright phase 2 (QA candidate)

Baseline: 4a355afb3488391abecffc4fdbaf803d73e92f83. Acceptance: pending independent Senior QA review and Project Controller decision. Never mark Done from this implementation.

## What changed
- Original tests/automated/catalogue.json and run.cjs remain intact, including AUTO-001 to AUTO-008.
- tests/browser/catalogue.json appends AUTO-009 to AUTO-020, never reuses or alters prior identifiers.
- tests/browser/run.cjs exercises only read-only Chromium page navigation / direct GET API checks against an explicitly authorised Preview. It does not prove RLS, write workflows, or browser-interaction coverage.
- tests/browser/self-test.cjs verifies permanent IDs and demonstrates PASS, FAIL, BLOCKED and NOT RUN (deliberate mismatch and missing-session simulation). This does not count as live-app acceptance.
- .github/workflows/gsla-test-catalogue.yml executes only isolated Node catalogue checks on untrusted PRs, with no secrets.

## Local installation and execution (requires approval)
Node 20+, Playwright pinned to 1.56.1 in tests/browser/package.json. From tests/browser execute npm install, then npx playwright install chromium. Package lock should be generated and reviewed before stable CI browser execution. No auth credentials may be supplied through shell history/chat.

Before a real target run, obtain written authorisation for exact Preview origin, deployment ID, commit, scope and synthetic account-role mapping. The following deliberately require matching origin variables and explicit deployment identity:

GSLA_TEST_BASE_URL=https://exact-approved-preview.example
GSLA_TEST_APPROVED_ORIGIN=https://exact-approved-preview.example
GSLA_TEST_COMMIT=exact-app-commit
GSLA_TEST_DEPLOYMENT=verified-deployment-id

Run: node tests/browser/run.cjs

Missing or mismatched approval produces BLOCKED results and exit code 3; no target requests. The test runner does not bypass Vercel Deployment Protection. A protected/login-wall or unavailable deployment must not be accepted as a GSLA PASS.

## Authenticated testing is OFF by default
Role execution requires separate review of isolated synthetic accounts and temporary Playwright storageState files, each with OS mode 0600, located OUTSIDE the repository:
- GSLA_TEST_STATE_ORGANISATION_ADMIN
- GSLA_TEST_STATE_FACILITIES_ADMIN
- GSLA_TEST_STATE_CENTRE_MANAGER
- GSLA_TEST_STATE_OPERATIONAL_OWNER

Approval gate: GSLA_TEST_AUTHORIZED_ROLE_RUN=YES_APPROVED_ROLE_TESTING. Do not enable this until independent QA/security review confirms approved role mapping, session provisioning and provenance, the exact target, least privileges, expiry/rotation/revocation, evidence access and ownership. The runner does not generate/log credentials or login responses. A nonempty storageState is NOT proof of role identity: human/independent verified role attestations and server-side access verification are prerequisites. Sessions are isolated by new context for each case. No role inherits another's session. Missing, weak-permissioned, malformed or repo-local states are BLOCKED. Never commit state files.

## Read-only request boundary
The browser route guard blocks off-origin resources and non-GET/HEAD requests. Consequently public app pages that require cross-origin CDN assets may not render fully; browser UI interaction is NOT yet accepted. GET operations that mutate state are out of scope and must not be included in catalogue. Navigation success is checked by observed final path and response, not by an unverified presence of the login page. A denial must be a true 401/403 or recognised denied page; 500/503 and deployment protection are not a successful denial.

## Sanitised reports / evidence policy
Reports are generated to ignored test-results/gsla-audit, mode 0600, with run ID, UTC time, static catalogue ID, purpose, read-only procedure, expected/actual response metadata, role label, environment commit/deployment, duration, status and reason. No response body, cookie, token, auth identifier, raw headers, network trace, downloaded response, video, screenshot or browser console is saved. Values are limited to status, final pathname, cache-control, vary and deployment-protection flag. Do not publish private reports by uploading to ordinary PR/Actions artifacts.

Proposed private retention: restricted storage accessible only to QA, Controller and designated security custodian; encryption at rest/in transit; separate role-based access; audit access logs; 30-day default evidence retention pending approved retention schedule; immediately revoke/rotate synthetic sessions after run; store consent/target attestation separately from test result; apply deletion/legal-hold rules as approved. No screenshots unless a separately reviewed redaction workflow is implemented. Never store authentication state in evidence.

## CI security boundary
Untrusted pull_request workflow: checkout with persisted credentials disabled; read-only contents permission; no secrets, no privileged tokens, no deploy access, no authenticated Preview calls. This is validation of code/test definitions, not GSLA acceptance.

Credentialed checks: NOT ENABLED. Proposed separate GitHub environment with required reviewers and restricted branch/ref, least-privilege short-lived credentials injected only during a trusted approved run. A private self-hosted runner or externally secured evidence store may be required to ensure logs/artifacts are access-restricted. Review fork policy, execution integrity, session hand-off, OIDC/secret broker, access logging, retention, and proof of exact deployment before implementation. Never run credentialed tests on arbitrary PR head code.

## Acceptance matrix
- Anonymous AUTO-009/010: direct Chromium route redirects to /sign-in.
- Anonymous AUTO-011/012: direct GET APIs denied and Owner privacy headers checked.
- Facilities Admin AUTO-013/014/017/019: permitted department page and API; denied Organisation Home and Owner API.
- Organisation Admin AUTO-015: permitted Organisation Home.
- Centre Manager AUTO-016: denied department-wide Facilities API.
- Operational Owner AUTO-018: permitted Owner API; verifies privacy headers.
- AUTO-020: NOT RUN explicit mutation gate.
Each scenario requires actual Preview evidence; self-test PASS is not an application PASS.

## Known limitations for independent QA
- No approved Preview origin/deployment evidence supplied in this Work Order; live app not exercised.
- No synthetic account/session files or mapping attestation supplied; role tests must be BLOCKED.
- No Playwright execution evidence from a browser-enabled environment has been established by the implementer.
- Site uses external resources/auth pathways: route guard may block those; browser render/interaction remains out of scope.
- Lockfile and package provenance review pending; npm install must not be treated as reproducible locked CI until lock is committed.
- Existing HTTP runner has a separate baseline and has not been independently reaccepted here.
- No Production writes or grants/RLS/behaviour changes undertaken.

## Handoff
Senior QA must review test threat model, immutable IDs, run self-test, run anonymous tests on explicitly approved Preview, deliberately exercise negative assertions and blocked session cases, independently attest role mapping (if authorised), inspect reports for leaks, and assess genuine positive/negative direct URL/API behaviour. Submit independent acceptance or defect list. Project Controller then decides whether GSLA-M1-021 can transition; until then remains open.
