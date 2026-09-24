# GSLA WebApp

One Next.js application with separate areas for Facilities, Sports Development, Human Resources, Finance and Superuser. See [architecture and route migration](docs/architecture.md).

## Run locally

Use `npm ci`, then `npm run dev`. Check types with `npx tsc --noEmit`, lint with `npm run lint`, and build with `npm run build`. Database-backed features need the relevant environment variables and a compatible database.

## Current status

Several pages are demonstrations backed by fixed data or local browser storage. Finance and system health have entry pages but no connected workflows. The repository restructure does not implement role or venue-based access control. Do not treat menu visibility as permission enforcement.
