# Facilities form operational status — 23 October 2026

Adds Operational between Form name and Actions, plus the same badge in Card view. Fixed widths preserve alignment across categories. Symbols and labels accompany colours: ✓ Live, ✕ Not live, ? Not verified.

This is reviewed verification metadata, not an automatic service health monitor. All forms initially show Not verified because no current end-to-end acceptance receipts have been supplied for this catalogue. Custom/local forms also default to Not verified. No example statuses are shipped as facts.

Maintain results in lib/facilityFormOperationalStatus.ts using immutable GSLA-FRM IDs. Live requires a dated receipt documenting submission, backend handling, database persistence, reload, applicable permissions and target deployment. Not live requires dated evidence of an incomplete or failing flow. Reassess results after relevant changes. These statuses are separate from lifecycle/readiness fields in Owner Form Control. No database queries or writes are introduced by the indicator.

Specialist role: Frontend Developer. Submission handlers, permissions, form identity and storage behaviour are preserved. Live authenticated visual inspection remains outstanding.

What happens next: review/merge the PR, then record end-to-end results as each form is verified.

Plain-English explanation: the new column shows whether each form has been proven to work all the way through. Unknown is not treated as a failure or success.

Copy/paste instructions for the next worker: verify Forms & Procedures List and Cards, including horizontal scrolling on narrow screens. Record dated end-to-end receipts before changing any form from Not verified.
