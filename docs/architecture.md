# Department structure and route migration

The repository remains **one Next.js application**. `app/` owns URLs and route handlers. Each department owns its pages. `components/ui` contains basic controls; `components/shared` contains actual reusable screens; `components/human-resources` and `components/sports-development` contain department components. `lib/supabase` and `lib/prisma.ts` are integrations. `prisma/` owns the database schema and migrations.

## Current structure

```text
app/
  (auth)/                  login, signup, callback; reset flows planned
  (public)/join/           public demonstration form
  facilities/              dashboard, directory, venue, booking, calendar, events
  sports-development/      dashboard, sports, associations, leagues, teams, reports
  human-resources/         dashboard, employees, leave, timesheets
  finance/                 dashboard; other workflows planned
  superuser/               dashboard, health, users, system, reports
  api/                     existing facilities and profile endpoints
components/                shell, UI, shared, department components
lib/                       Prisma, Supabase, future auth and validation
prisma/                    schema and migrations
docs/                      architecture notes
```

Folders marked `Planned area` reserve ownership; they do not expose a page or promise completed functionality. `.next` is generated and ignored. `.env.local` is local and ignored.

## Migration map

| Previous URL | New URL / owner |
| --- | --- |
| `/admin/facilities/...` | `/facilities/facilities/...` |
| `/admin/bookings`, `/admin/calendar`, `/admin/events/...` | `/facilities/bookings`, `/facilities/shared-calendar`, `/facilities/events/...` |
| `/admin/hr/...`, `/admin/human-resources/...` | `/human-resources/...` (home redirects to `/human-resources/dashboard`) |
| `/admin/sports-development-unit/[sport]`, `/admin/sports/[sport]` | `/sports-development/sports/[sport]` |
| `/admin/association/registration`, `/admin/forms`, `/admin/form-b`, `/admin/form-c` | `/sports-development/associations/...` |
| `/admin/manage/leagues/...`, `/admin/manage/teams/...`, `/admin/statistics` | `/sports-development/leagues/...`, `/sports-development/teams/...`, `/sports-development/reports` |
| `/admin/manage/users/...`, `/admin/users/new` | `/superuser/users/...` |
| `/admin/superuser-dashboard`, `/admin/manage`, `/admin/mail`, `/admin/reminders` | `/superuser/dashboard`, `/superuser/system/manage`, `/superuser/system/mail`, `/superuser/system/reminders` |
| `/admin/profile`, `/auth/callback` | `/profile`, `/callback` |

Compatibility redirects in `next.config.ts` keep prior bookmarks usable during migration. New pages should link to canonical URLs.

## Boundaries and follow-up work

- Route and UI grouping is complete; data models and API endpoints have not been renamed.
- The Facilities directory still uses fixed data while its create route writes to Prisma; the venue dashboard is a fixed demonstration. HR, sports and calendar screens also contain demo workflows.
- The current middleware refreshes Supabase sessions but does not enforce department roles. Facilities API endpoints and some server actions lack server-side role and venue checks. Auth, authorization and venue assignment need dedicated work before operational use.
- The current calendar has sports-focused sample events. Decide ownership of a truly shared calendar contract before wiring live data.
- Existing `documents/` source material and `accelerate.txt` remain in place pending a separate content/repository hygiene review.
