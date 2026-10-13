# GSLA-M1-021 — Restricted authenticated role-session operating procedure

Status: **proposed; security/independent QA approval required**. No credentialed GitHub Actions or Production use.

1. Project Controller approves exact Vercel Preview deployment, immutable commit SHA, canonical hostname, scope, read-only routes and synthetic accounts. Verify deployment identity using Vercel API; READY alone is not application acceptance.
2. Security custodian provisions four separate least-privilege synthetic accounts representing organisation_admin, facilities_admin, centre_manager and operational_owner, with separately documented owner designation. Never create/change privileges through the test suite. Retain account mappings outside GitHub, reports and chat.
3. Provision unique private Playwright storageState files outside the checkout, mode 0600, via reviewed interactive login; no credentials or state in repository, screenshots, CI logs or artifacts. Files must be short-lived and revoked after the run.
4. Custodian configures the server's preview-only GSLA_TEST_ATTESTATION_ENABLED and high-entropy GSLA_TEST_ATTESTATION_SECRET. Supply admission secret privately as a process environment variable, never inline in shell commands/arguments. Keep GSLA_TEST_AUTHORIZED_ROLE_RUN disabled without separate written approval.
5. The runner passes X-GSLA-Test-Admission only to same-origin GET /api/test/role-attestation. Backend validates Supabase session and trusted GSLA role or separate Operational Owner gate. Verify 200/expected role before continuing with independent page/API assertions. Wrong verified role => FAIL; missing/invalid/expired session or disabled/incorrect admission => BLOCKED. Never infer authorisation from cookie count or role labels.
6. Ensure responses are private/no-store; no trace, video, HAR, page screenshots, headers, sensitive bodies or storageState are exported. Audit JSON/Markdown contains only safe status, static paths, metadata and aggregate counts. Inspect outputs with synthetic sensitive markers before approval.
7. Collect private evidence in separately secured encrypted access-controlled storage with approved retention and deletion; do not upload authenticated artifacts to ordinary GitHub Actions.
8. Independent QA reviews approvals, verifies the exact deployment and role matrix, tests both accepted and rejected cases, records defects, then provides its disposition to the Project Controller. Credentials rotated/revoked afterward.

Anonymous Chromium requires approved Preview and its origin/commit/deployment metadata plus private Vercel API provenance access. A Vercel deployment marked READY is not sufficient. Application access restrictions/SSO may yield BLOCKED. Never convert them to PASS.

**Lint scope:** The Node-specific CommonJS require exemption applies to tests/**/*.cjs only. Application TypeScript lint protections remain unchanged; repository-wide pre-existing findings are logged separately and do not become test-infrastructure exemptions.

M1-021 remains In Progress; this document does not authorise secrets or sessions.
