# GSLA WebApp

> **New developer or system administrator?** Start with the [GSLA WebApp System Handbook](docs/GSLA-WEBAPP-SYSTEM-HANDBOOK.md). Changes must follow the [Documentation Maintenance Rule](docs/standards/DOCUMENTATION-MAINTENANCE-RULE.md).

> **Managing project work?** Start with the [Project Control Guide](docs/project-control/PROJECT-CONTROL-GUIDE.md). The Project Controller uses GitHub Issues and the GSLA WebApp Project Control board to track milestones, owners, dependencies, verification and completion.

One Next.js application with separate areas for Facilities, Sports Development, Human Resources, Finance and Organisation. See [architecture and route migration](docs/architecture.md).

## Run locally

Use `npm ci`, then `npm run dev`. Check types with `npx tsc --noEmit`, lint with `npm run lint`, and build with `npm run build`. Database-backed features need the relevant environment variables and a compatible database.

## Current status

Several pages are demonstrations backed by fixed data or local browser storage. Finance and system health have entry pages but no connected workflows. Initial role-based authentication and route guards have been implemented, but comprehensive API/database permission testing and facility-scoped access remain unfinished. Do not treat menu visibility as permission enforcement.

## Project control

Project work follows:

REQUEST → ASSESS → TASK → ASSIGN → WORK ORDER → EXECUTION → WORK RECEIPT → VERIFY → CLOSE / FOLLOW-UP

See:
- [Project Control Guide](docs/project-control/PROJECT-CONTROL-GUIDE.md)
- [Work Order Standard](docs/project-control/WORK-ORDER-STANDARD.md)
- [Work Receipt Standard](docs/project-control/WORK-RECEIPT-STANDARD.md)
- [Project Status & Reporting Rules](docs/project-control/PROJECT-STATUS-RULES.md)

GitHub is the permanent project record. ChatGPT conversations are execution environments and must not become competing sources of truth.
