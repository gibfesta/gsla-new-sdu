# WORK ORDER — FACILITIES-FORM-ID-COLUMN

Date: 22 October 2026. Worker: Frontend Developer. Authority: Project Owner request to add a small Form ID column beside the name on /facilities/forms-and-procedures.

Smallest outcome: reuse existing GSLA-FRM IDs in the catalogue List and Cards. Source: immutable M1-016 ledger at 7fd2c6451a99ba0cf1853c48a79be91013d04f59. Preserve all assignments. Unregistered custom definitions show Not registered and their existing catalogue ID; never invent a permanent number. Scope excludes persistence, permissions, form fields, business actions and production deployment. Verify mappings, scoped lint and TypeScript; return a reviewable PR. Budget: one bounded UI change and proportionate checks.

# WORK RECEIPT — FACILITIES-FORM-ID-COLUMN

Outcome: source change ready for review. List has Form name / Form ID / Actions using the existing gsla-data-table style; Cards show the same ID. Unknown custom catalogue IDs display Not registered plus their local ID. Existing create/edit/assign/preview/delete/undo callbacks remain unchanged.

Files: FormsAndProcedures.tsx, lib/facilityFormIds.ts, config/form-control/form-ids.json. The immutable ledger is copied byte-for-byte from M1-016 commit 7fd2c64 because it was not present on current main; no numbers newly allocated or altered. The lookup matches canonical facilities.template.<native catalogue ID>, never title or row position. The helper imports identity assignments only, not the owner-only inventory, access configuration or server code.

Evidence: all 23 source-factory defaults match existing assignments; ledger byte comparison PASS. Actual List component rendered with synthetic data/dependency stubs: column order and all 23 IDs/23 Edit controls present, no save call during render. Scoped ESLint PASS. TypeScript result recorded in PR. git diff --check PASS. No live signed-in browser screenshot or production deployment claimed. This small display change adds no new test infrastructure.

Specialist Role Compliance: Frontend Developer under the explicit owner scope above; checks cover GSLA styling, table caption/column and row headers, stable native identity lookup, React text escaping, horizontal overflow on small screens, List default, Card parity and unchanged business handlers. Vercel React checklist applied. No permissions, connections, persistence or IDs changed. Project Controller/independent reviewer retains acceptance; deployment/merge not performed by this receipt.

## What happens next
Review the PR/Preview and merge through the established release process. This change is not yet on production.

## Plain-English explanation
Forms show their permanent number beside their name, making them easier to identify. Custom forms keep their local ID until registered.

## Copy/paste instructions for the next worker
Review feat/facilities-catalogue-form-id. Confirm Form name / Form ID / Actions order on /facilities/forms-and-procedures, standard GSLA-FRM-001–023 assignments, Card parity and unknown-custom fallback. Preserve all existing storage/actions and IDs. Verify CI/Preview and use the approved merge/release process; do not conflate source checks with signed-in runtime acceptance.
