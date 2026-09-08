"use client";

// app/admin/manage/users/page.tsx

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Manage → Users (UI-only)
|--------------------------------------------------------------------------
| Route:
| - /admin/manage/users
|
| Purpose:
| - List/search all user profiles in the system
| - Entry point to:
|     → View user
|     → Edit user
|     → Deactivate user
|
| Notes:
| - Users are global identities (not owned by associations)
| - Associations/Teams link to users via memberships & roles
|
| Backend later:
| - Fetch users from DB
| - Add filters (role, association, status)
|--------------------------------------------------------------------------
*/

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Plus } from "lucide-react";

/*
|--------------------------------------------------------------------------
| SEED DATA (TEMP)
|--------------------------------------------------------------------------
*/
const users = [
  {
    id: "u1",
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    roles: ["User", "Volunteer"],
    status: "Active",
  },
  {
    id: "u2",
    name: "Jamie Costa",
    email: "jamie.costa@example.com",
    roles: ["User", "Association Admin"],
    status: "Active",
  },
  {
    id: "u3",
    name: "Chris Silva",
    email: "chris.silva@example.com",
    roles: ["User"],
    status: "Inactive",
  },
];

export default function UsersPage() {
  return (
    <div>
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0C2F57]">Users</h1>
          <p className="mt-2 text-slate-600">
            Manage system user profiles and access.
          </p>
        </div>

        <Link href="/admin/manage/users/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* LIST */}
      <div className="mt-6 grid grid-cols-1 gap-6">
        <Card>
          <CardContent>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-[#0C2F57]" />
              <div className="text-xl font-semibold">All Users</div>
            </div>

            <div className="mt-4 divide-y divide-slate-200">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">
                      {u.name}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {u.email}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {u.roles.map((r) => (
                        <Badge key={r}>{r}</Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Badge>{u.status}</Badge>

                    <Link href={`/admin/manage/users/${u.id}`}>
                      <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                        View
                      </button>
                    </Link>

                    <button className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100">
                      Deactivate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
