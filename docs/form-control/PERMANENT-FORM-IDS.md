# Permanent owner-facing Form IDs

`config/form-control/form-ids.json` is the append-only assignment ledger. The first reviewed 66 definitions receive GSLA-FRM-001 through GSLA-FRM-066 once, in reviewed manifest order. Runtime sorting, routes, aliases and renderer reuse never generate identifiers. Each active register row must match its ledger assignment; canonical internal `formId` continues to identify detail/API routes.

Never change or delete an assignment. Retired/tombstoned definitions keep their assignment forever, even if their source or active register record disappears. A replacement definition with a genuinely new identity receives a new number. Do not give planned routes or unreconciled local candidates permanent IDs until semantic review establishes a canonical definition.

For a reviewed new identity, append an assignment with `assignedAt`, increase `highWatermark`, and add matching `ownerFormId` to the register. Allocate strictly above the old high-watermark; do not fill gaps. The three-digit range is 001–999; exhaustion requires a separately approved format migration, never rollover/reuse.

Before delivery, run:

```sh
node scripts/form-control/check-inventory.cjs --strict --identity-baseline <previous-accepted-delivery-commit>
```

This rejects historical assignment deletion/reassignment, duplicate internal/public IDs, number reuse and high-watermark rollback. The initial continuation introduces the ledger, so its accepted parent has no ledger to compare; subsequent deliveries must use this continuation as their earliest identity baseline. The server validator rejects inconsistent active mappings before exposing metadata, within the existing owner gate.

IDs appear first in Lists, on Cards/details, in searches and in metadata CSV exports. They are permanent definition references, never record IDs, workflow permissions or proof of operational readiness.
