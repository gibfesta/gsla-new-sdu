# GSLA WebApp — Specialist Worker Verification Standard

Status: Approved operating standard  
Owner: Project Controller  
Applies to: Every task assigned to, reviewed by, or credited to a specialist worker

## Purpose

Specialist titles must represent real specialist execution, not decorative labels.

A task may only be credited to a specialist when the work can be traced to that specialist's approved role definition, specialist-specific checks, scope boundaries and evidence.

A chat title, task category or Project Controller assumption is **not** proof that a specialist performed the work.

## Core rule

**No specialist attribution without specialist evidence.**

The Project Controller must not write “Completed by Senior Backend Developer”, “Reviewed by Senior Database Engineer”, or equivalent unless that specialist actually performed the relevant work under a defined specialist scope.

If work was performed generally, record it accurately as **Project Controller / implementation support**, **general implementation support**, or the actual non-specialist executor.

Retrospective specialist attribution is prohibited.

## Required specialist identity

Before specialist execution begins, the Work Order must identify:

1. **Specialist Worker / Role**
2. **Role Specification Reference** — the approved worker specification, role brief, or explicit approved scope
3. **Specialist Responsibilities Used**
4. **Specialist Checks Required**
5. **Authority Boundaries / Out of Scope**
6. **Other Specialists Required**, if the task crosses disciplines

If no approved role specification is available, the Work Order must state the specialist's approved scope explicitly before work starts.

## Specialist execution rules

The specialist must:

- perform only work that belongs to the assigned specialist scope;
- carry out the specialist-specific checks listed in the Work Order;
- identify files, systems, records or evidence actually inspected;
- state decisions or certifications they are **not** qualified or authorised to make;
- route cross-discipline questions to the appropriate specialist;
- avoid claiming implementation, verification or certification that was not performed;
- return a formally titled **WORK RECEIPT — <Task ID>** containing a Specialist Role Compliance section.

For QA and independent verification specialists, a verification report, findings note, test matrix, PASS/FAIL/BLOCKED verdict or handoff is supporting evidence only. It does **not** replace the formal Work Receipt.

A specialist may implement adjacent mechanical changes only when they are necessary to complete the assigned specialist work and do not require another discipline's judgement.

## Mandatory auditable specialist handoff

Every specialist assignment must be auditable from the original Work Order through the evidence to the final or interim Work Receipt. The minimum trace is:

**Task ID → Work Order → named specialist → specialist checks → evidence → WORK RECEIPT — <Task ID> → Project Controller verification**

If execution becomes blocked or is placed on hold after work has started, the specialist must issue **INTERIM WORK RECEIPT — <Task ID>** before handoff.

This applies equally to implementation and verification specialists.

## Mandatory Specialist Role Compliance section

Every Work Receipt credited to a specialist must contain:

### Specialist Role Compliance

**Specialist Worker / Role:**  
**Role Specification Reference:**  
**Specialist responsibilities exercised:**  
**Specialist checks actually performed:**  
**Evidence inspected / produced:**  
**Authority boundaries respected:**  
**Items referred to another specialist:**  
**Specialist conclusion:**  

If this section is absent or unsupported by evidence, the task cannot be credited to that specialist and cannot pass specialist verification.

## Project Controller verification gate

Before moving specialist work to Done, the Project Controller must verify:

- the named specialist was identified before or during execution, not invented afterwards;
- the work performed matches that specialist's approved role;
- required specialist checks were actually completed;
- the Work Receipt contains specialist-specific evidence;
- the specialist clearly states what remains outside their authority;
- cross-specialist dependencies were routed correctly;
- no specialist is credited for another discipline's judgement;
- any unresolved specialist requirement becomes a follow-up task or blocker.

The Project Controller Verification comment must state whether **Specialist Role Compliance = PASS**.

## Multi-specialist tasks

Some tasks legitimately need more than one specialist.

Example: authentication hardening may require:

- **Senior Backend Developer** — application authentication, sessions, middleware, API/server authorisation;
- **Senior Database Engineer** — PostgreSQL/Supabase RLS, grants, constraints, migrations and data-boundary enforcement;
- **Software Architect** — architecture or system-boundary review where the task changes architecture.

Each specialist must provide evidence for their own scope. One specialist's receipt does not certify another specialist's discipline.

The Project Controller coordinates the combined result.

## General work versus specialist work

General implementation support may:

- make straightforward code/documentation changes;
- collect evidence;
- run defined tests;
- implement an already-approved design.

General implementation support must **not** be relabelled as specialist work afterwards.

Where specialist judgement is required, the task remains incomplete until the relevant specialist has performed and evidenced that part.

## Example specialist boundaries

### Senior Backend Developer
Typical scope:
- authentication/session logic;
- middleware and server routes;
- API authorisation;
- server-side validation;
- backend integration behaviour.

Must not independently certify:
- PostgreSQL RLS/grants;
- database integrity architecture;
- business permission policy;
- frontend design decisions outside implementation needs.

### Senior Database Engineer
Typical scope:
- PostgreSQL/Supabase schema;
- RLS and grants;
- migrations;
- constraints, indexes and integrity;
- query/database performance;
- database testing.

Must not independently decide:
- business permission policy;
- HR/Facilities domain semantics;
- UI/UX design.

### Software Architect
Typical scope:
- system structure;
- component/service boundaries;
- dependency design;
- architectural patterns;
- cross-system trade-offs.

Must not claim:
- code was implemented unless implementation evidence exists;
- database security was certified unless the database specialist performed it;
- business policy was approved unless the project owner approved it.

## Existing and historical tasks

This standard applies immediately to all active and future work.

For historical tasks:
- do not rewrite history to add specialist attribution;
- preserve existing evidence;
- if actual specialist execution cannot be demonstrated, describe the work as general/project implementation rather than specialist-certified work;
- re-open or create a verification task if specialist certification is materially required for release or security.

## Failure rule

If a specialist Work Receipt does not prove specialist role compliance:

**RETURN FOR CORRECTION → In Progress**

If the required specialist has not yet performed the work:

**Do not credit the specialist. Assign or create the required specialist task.**

A merged PR, successful deployment or visually correct result does not substitute for specialist verification.
