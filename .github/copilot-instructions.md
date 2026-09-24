# GSLA repository guidance

Read [docs/architecture.md](../docs/architecture.md) before changing routes or assigning shared ownership. This is a Next.js App Router application with Supabase authentication and Prisma data access. Keep department-specific pages and components in their department areas. Keep reusable UI in `components/shared` or `components/ui` only when reuse is real.

Do not assume a screen is connected to the database: many use demo data or localStorage. Server-side role and venue checks have not yet been completed. Check the route map and compatibility redirects when renaming a route. Use `npm run lint`, `npx tsc --noEmit`, and `npm run build` before proposing a merge.
