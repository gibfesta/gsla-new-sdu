# GSLA-M1-021 — PR #64 test attestation integration

Backend merged baseline: `5e18a2617c6b6aa74b5da74c7229811b1e652eda`.

Only an approved Preview may enable the role endpoint; credentialed GitHub Actions remains disabled. `GSLA_TEST_ATTESTATION_SECRET` must be provided privately to the test runner (not command-line arguments, checked-in files, or workflows). It must match the backend's approved Preview admission secret and contain 32+ characters. The runner sends it exclusively on the dedicated `/api/test/role-attestation` request; normal browser page/API requests receive no test-admission header.

Role identity is proved by backend Supabase Auth and trusted role mapping, never by cookies merely existing or a fixture role label. Expected-role mismatch => FAIL; missing, expired or invalid session => BLOCKED; missing/invalid admission or unavailable endpoint => BLOCKED. Browser navigation only proceeds if attestation returns valid expected role. No response payload, admission header, cookie, or identity is written to evidence.

Local reproduction (from exact checkout): `node tests/browser/self-test.cjs`; `cd tests/browser && npm ci --ignore-scripts && npx playwright install chromium`. No real authenticated tests until approval of session provisioning and private artifact handling. Execute read-only Preview tests using the approved identity, Vercel provenance and access-gate environment values from the prior testing guide. Production and business writes remain prohibited.

This is an implementation candidate awaiting independent QA and Project Controller decision. Do not close M1-021.
