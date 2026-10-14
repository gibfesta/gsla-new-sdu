# GSLA-M1-021 — local Trusted Sources anonymous Chromium rerun

Status: IMPLEMENTATION CANDIDATE; no live run claimed. Baseline 7114b037c34b320e8f86572ebfbce82f3bc8613e, Preview deployment dpl_6peMrCQKby7QzfoT4DZuof42E9mW and hostname gsla-new-ba0fvaspz-founder-os6.vercel.app.

The approved Vercel Security Custodian must validate the temporary OIDC identity, expiry and permitted Trusted Sources header against this **exact origin**. This approval must happen out of band. No global SSO change, new share link, Production change or GitHub Actions credentialed job is allowed.

Run locally in an authorised environment:
1. Check out the implementation branch and record git rev-parse HEAD.
2. From tests/browser: npm ci --ignore-scripts --no-audit --no-fund; npx playwright install chromium.
3. Execute node tests/browser/trusted-oidc-self-test.cjs (requires no secrets).
4. Using the custodian's secure environment/session, let the local Vercel CLI provision VERCEL_OIDC_TOKEN, or an approved private mechanism securely inject that environment variable. Do NOT paste, print, export to chat, persist to shell history, or put it in GitHub secrets without separate approval. A Vercel CLI login or local OIDC issuance alone does NOT guarantee browser admission.
5. Set non-secret GSLA_APPROVED_LOCAL_ANON=APPROVED_DPL_6peMrCQKby7QzfoT4DZuof42E9mW only after actual custodian approval, then run node tests/browser/run-local-trusted-oidc.cjs. Do not enable publicly credentialed CI.
6. If the browser preflight cannot prove GET /api/facilities reaches middleware and yields a 401 JSON error exactly 'Authentication required' without edge challenge or redirects, all four application tests remain BLOCKED and should not issue further navigation.
7. If preflight proves the app boundary, run exclusively immutable IDs AUTO-009..012, checking sign-in redirects and owner cache/private Vary. New isolated anonymous Chromium context is used for every case.
8. Review local ignored test-results/gsla-audit/<runId>.json and .md. No cookie, token, response body, raw URL query, HAR, screenshot or trace is stored. Delete any temporary token/session and verify custodian-side expiry or revocation. Transfer only sanitised evidence to private QA/Controller review.

The runner uses x-vercel-trusted-oidc-idp-token only for same-origin GET/HEAD requests through Playwright routing. It forbids off-origin and mutating requests. No GSLA login cookies or roles are supplied. The in-memory 401 response body is compared to a literal non-sensitive app sentinel; only a boolean enters reports.

Evidence fields: UTC, run ID, deployment, immutable app commit, path, fixed expected outcome, allowlisted observed status/redirect/category/header booleans, per-test PASS/FAIL/BLOCKED and no-secret evidence record.

Important: classified PASS is an *implementer-observed app check*, not independent QA acceptance. Deployment origin metadata was independently checked before authoring; local execution should repeat signed deployment provenance verification with Vercel. If access is unavailable, no app PASS is claimed.

Independent QA: verify protection-layer bypass is tightly scoped, no secret flows to third-party origin or public output, real deployment provenance, preflight authenticity, complete redirect and owner cache evidence, and post-test revocation. Keep M1-021 In Progress until Project Controller accepts.
