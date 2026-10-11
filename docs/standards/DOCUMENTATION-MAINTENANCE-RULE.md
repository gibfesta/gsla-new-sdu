# GSLA WebApp — Documentation Maintenance Rule

Status: Approved baseline, 2026-10-11. Applies to all departments and new development.

## Mandatory change rule
For every meaningful code, route, permission, form, schema, deployment or operational change:
1. Identify the affected authoritative documents **before** changing code.
2. Update the matching departmental register, route registry, standard or runbook in the same development task. Do not duplicate descriptions across multiple owners.
3. Update the [System Handbook](../GSLA-WEBAPP-SYSTEM-HANDBOOK.md) when system behaviour, onboarding, architecture or supported workflows change; otherwise verify it remains accurate.
4. Cite actual code/SQL/deployment evidence, status, date and commit. Distinguish `Implemented`, `Deployed`, `Tested`, `Planned`, and `On hold`.
5. Never place passwords, secret keys, access tokens, personal health information, or real employee-sensitive records in documentation.
6. Run appropriate validation and do not declare a feature production-ready solely because a commit or build succeeded.

## Periodic review
Recommended cadence: **weekly lightweight drift check**, **monthly full documentation review**, and **immediate update after material changes**.

For recurring review:
- Compare current GitHub `main`, migrations, relevant Supabase schema/security findings, and actual Vercel deployment against recorded docs.
- Check unresolved TODOs, dead links, inaccurate route paths and undocumented dependencies.
- Produce a short change summary and list evidence/gaps.
- Safe editorial corrections can be proposed as commits; changes to security, DB schema, deployment or architectural rules require explicit approval.
- If the reviewer lacks access to a source, mark it `Not verified` rather than assume.

## Ownership
A development worker implementing a feature is responsible for updating the corresponding documentation. The project controller/reviewer checks consistency and prevents duplicate documents. The System Handbook is the entry point, not a second competing source for every technical detail.

## Recommended review completion note
Record date, baseline/current commit SHAs, docs examined, edits, source links, test/deployment status, and open decisions.
