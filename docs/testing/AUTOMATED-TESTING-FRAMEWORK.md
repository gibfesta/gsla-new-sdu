# GSLA WebApp — Automated Testing Framework

**Status:** M1-021 initial implementation candidate; NOT independently accepted.  
**Owner:** Project Controller; independent acceptance by Senior QA & Independent Verification Specialist.

## Why this exists
Instead of asking the Project Owner to manually test every screen, we execute repeatable checks. Each check has a stable ID and tells the Project Owner: *why it matters*, *what we attempted*, *what success would look like*, *what actually happened*, *the evidence*, and *whether the test passed*.

## Process — auditable from start to finish
1. An approved Work Order identifies the feature, rules and test scope.
2. A reviewer approves test definitions in `tests/automated/catalogue.json`. **Definitions are not results.**
3. Run against a specified environment, commit and deployment.
4. The runner generates a unique run ID and a dated Markdown + JSON report.
5. A failed check gets an evidence-backed defect; a missing role session becomes BLOCKED.
6. Senior QA independently evaluates the results and produces a **WORK RECEIPT — <Task ID>**.
7. The Project Controller separately decides whether the work can be accepted.

## Results explained
- **PASS**: the test actually ran and its predeclared result matched the observed response.
- **FAIL**: it ran and the observed result did not match.
- **BLOCKED**: a technical or authorisation prerequisite prevented testing; never treat as success.
- **NOT RUN**: the scenario was defined but not executed, with reason.

## Current initial coverage
The M1-004 catalogue includes eight examples: anonymous denial, Owner API privacy headers, sign-in redirect, Facilities Admin positive page/API access, Facilities Admin Organisation denial, Organisation Admin positive access and Centre Manager API denial. The first runner performs **only anonymous HTTP GET checks**. Authenticated definitions stay BLOCKED until secure role-session support is implemented and independently reviewed. This runner does **not** test browser interactions, database RLS, expired sessions, storage mutations or true end-to-end role flows yet.

## Running the initial non-destructive smoke checks
Requires Node.js 20+; no new npm packages.
```bash
GSLA_TEST_BASE_URL=https://YOUR-APP-PREVIEW.example \
GSLA_TEST_COMMIT=EXACT_COMMIT_SHA \
GSLA_TEST_DEPLOYMENT=VERIFIED_DEPLOYMENT_ID \
node tests/automated/run.cjs
```
Only test an approved deployment. Set no raw auth cookies, bearer tokens, passwords, keys or personal data in the command. Vercel deployment protection may prevent direct testing; a protection-layer response is not an application-level PASS.

Results are created under `test-results/gsla-audit/` as:
- `<run-id>.json`: machine-readable audit
- `<run-id>.md`: full plain-English record for the Project Owner

Output fields include date/time (UTC), test ID, purpose, steps, role, expected response, observed HTTP status/redirect/security headers, PASS/FAIL/BLOCKED, test environment, commit, deployment and reason. Raw response bodies, cookies and credentials are intentionally omitted.

## Security and evidence policy
Do not run writes or destructive operations in Production. Do not commit test sessions, cookies, auth storage states or downloaded personal responses. Use synthetic test accounts/data only, subject to explicit authority. No unattended account creation, role mutation or Owner impersonation. Authenticated tests require a separate secure provisioning procedure; no credentials in chat, GitHub, Breeze, screenshots or report files. Retain artifacts only within an approved private evidence store.

## Next implementation/acceptance gates
1. Independently run and review the initial anonymous tests against a target that permits application-level HTTP requests.
2. Add Playwright browser support on a dedicated test branch with secure session handling, screenshot redaction and network/storage comparison.
3. Automate the approved four-role M1-004 matrix, including negative direct URL/API checks.
4. Add CI and private evidence retention only after the security model is approved.
5. Obtain an independent QA Work Receipt and Project Controller acceptance; M1-021 must remain open until then.

## Owner quick explanation
A row saying “Facilities Administrator can read the Facilities API” is only a *planned check* until the test actually runs using an authorised Facilities Administrator session. If the session does not exist, the report will say **BLOCKED**, and we will explain why rather than claiming success.

This guide is an operational testing reference, not evidence that all GSLA security requirements are certified.
