# GSLA-M1-021 — QA correction handoff (candidate, NOT accepted)

Implementation baseline: merge 3456b93ec8240a8e1ec27c86dfb41f27fde18af8. Reference Preview: dpl_ArNiD7sNLp8h74qkufYqD15FEcAp (git commit 5ff3c6f194f9b6cbf326a3ad6933cb7306545357). Never confuse Vercel READY with test acceptance.

## Corrections applied
- tests/browser/attestation.cjs is a fail-closed **integration contract**, not an authentication authority. It requests a fixed same-origin /api/test/role-attestation endpoint using the session's own context; it requires response 200, JSON schemaVersion 1, authority=gsla-server-verified, authenticated=true, sessionValid=true, server role equal to expected, plus Cache-Control: no-store. Missing/expired/invalid 401/403 => BLOCKED; wrong verified role => FAIL. It never logs subject, cookies or response body.
- A secure backend endpoint does **not currently exist in this PR**. Authenticated tests can NEVER PASS until Senior Backend Developer designs/implements and QA independently verifies a server-validated user+role check from trusted GSLA role authority, without changing privileges or admitting a client-supplied role claim. Existing business APIs must not be repurposed as attestation.
- Runner requires a trusted Vercel API token in a restricted local environment, calls Vercel deployment API and requires exact deployment id, READY state, Git SHA, repo and canonical hostname to match. A string supplied in environment is never itself accepted as proof. Vercel verification failure blocks tests, not PASS.
- Self-test now covers valid, invalid, expired, wrong-role, synthetic secret non-disclosure and all four result states.

## Commands (independent QA must run from exact git checkout)
node --version
git rev-parse HEAD
node tests/browser/self-test.cjs
cd tests/browser
npm install --package-lock-only --ignore-scripts
# Until a reviewed package-lock.json is committed, npm ci is BLOCKED
npm ci
npx playwright install chromium
node run.cjs

No credentialed Actions enabled. Never paste Vercel API token or session files into chat, CLI command arguments, Git commits or public CI.

### Required application test environment
GSLA_TEST_BASE_URL=https://canonical-deployment-hostname
GSLA_TEST_APPROVED_ORIGIN=https://same-canonical-deployment-hostname
GSLA_TEST_DEPLOYMENT=dpl_...
GSLA_TEST_COMMIT=<exact Git SHA of deployed app>
GSLA_TEST_VERCEL_API_TOKEN=<provided out of band by security custodian>

Note: origin must be exact Vercel deployment URL; arbitrary aliases must not be used. The target must be independently authorised as safe for read-only testing. Old QA reference Preview is a reference, not automatically approved for new executions.

## Evidence
A prior PR CI catalogue test is not a browser test. Any real pass requires approved target identity, running Chromium and app-level response. No raw screenshots, response body, traces, HAR, tokens or usernames are saved. Synthetic redaction verifies attestation returns only fixed status/reason fields. Private storage artefacts remain local and untracked; review retention plan before sharing.

## Remaining gates
1. Backend/server-side attestation implementation and security/QA approval; this PR intentionally does not add a new application API endpoint.
2. Generation and review of npm package-lock.json using a network-enabled trusted environment; registry DNS was unavailable to implementer, so no lockfile is falsely claimed.
3. Exact-checkout independent QA tests.
4. Approved Preview read-only Chromium testing; Vercel API token and authorised target needed.
5. Authenticated role execution with server-confirmed identity; credentialed Actions OFF.
6. QA disposition and Controller closure decision. M1-021 remains In Progress.
