// app/admin/manage/page.tsx

// NOTE: This page is a Server Component by default (no "use client").
// We keep it that way and use <Link> for navigation (no client-side hooks needed).

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Manage (Add / Edit / Delete)
|--------------------------------------------------------------------------
| Route:
| - /admin/manage
|
| Purpose:
| - High-level entry point for CRUD-style admin flows.
| - Each card represents an entity “area” (Sports, Associations, Teams, People, etc).
|
| How navigation works (today):
| - Most buttons are still UI-only placeholders.
| - Only the "Users" card is wired to routes:
|     - Add  -> /admin/manage/users/add
|     - Edit -> /admin/manage/users   (future list/search screen)
|
| Where to add more wiring later:
| - Add routes per entity, then update the `href` values inside the map below.
|--------------------------------------------------------------------------
*/

export default function ManagePage() {
  // ENTITY SEED LIST
  // - Add/remove entity cards by editing this array.
  // - If you later want unique descriptions/actions per entity, switch this to objects.
  const entities = ["Sports", "Associations", "Teams", "Coaches", "Volunteers", "Users"] as const;

  return (
    <div>
      {/* Page title — change if you want to rename the section in the admin UI */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Add / Edit / Delete</h1>

      {/* Short description explaining the purpose of this page */}
      <p className="mt-2 text-slate-600">Manage sports, associations, teams, and people records.</p>

      {/* 
        Grid layout for management cards
        - 1 column on mobile
        - 3 columns on medium+ screens
      */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {entities.map((x) => {
          // ROUTING RULES (TEMP)
          // - Only the Users card is wired right now.
          // - Everything else stays as a non-functional button until those routes exist.
          const isUsers = x === "Users";

          const addHref = isUsers ? "/admin/manage/users/add" : undefined;
          const editHref = isUsers ? "/admin/manage/users" : undefined;

          return (
            <Card key={x} className="transition hover:shadow-md">
              <CardContent>
                {/* Entity title */}
                <div className="text-lg font-semibold">{x}</div>

                {/* Generic description for all entities */}
                <div className="mt-2 text-sm text-slate-600">Create, edit, deactivate, and audit.</div>

                {/* Action buttons */}
                <div className="mt-4 flex gap-2">
                  {/* 
                    Add button
                    - Users: navigates to the Add User wizard
                    - Others: placeholder button (no route yet)
                  */}
                  {addHref ? (
                    <Link
                      href={addHref}
                      className="rounded-xl bg-[#0C2F57] px-3 py-2 text-sm font-semibold text-white"
                    >
                      Add
                    </Link>
                  ) : (
                    <button className="rounded-xl bg-[#0C2F57] px-3 py-2 text-sm font-semibold text-white">
                      Add
                    </button>
                  )}

                  {/* 
                    Edit button
                    - Users: navigates to a future Users list/search page
                    - Others: placeholder button (no route yet)
                  */}
                  {editHref ? (
                    <Link
                      href={editHref}
                      className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50"
                    >
                      Edit
                    </Link>
                  ) : (
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      Edit
                    </button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
