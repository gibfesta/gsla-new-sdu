// app/admin/manage/page.tsx

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";

/*
|--------------------------------------------------------------------------
| PAGE: Admin — Super User Management
|--------------------------------------------------------------------------
| Route:
| - /admin/manage
|
| Purpose:
| - Central management hub for Super Users
| - Clearly separates structure, operations, people, and governance
|--------------------------------------------------------------------------
*/

type Entity =
  | "Add a Sport"
  | "Add an Association"
  | "Add a Facility"
  | "Create a League or Competition"
  | "Create a Team"
  | "Users"
  | "Coaches"
  | "Volunteers"
  | "Form A"
  | "Form B"
  | "Form C";

type EntityConfig = {
  key: Entity;
  description: string;
};

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good";
}) {
  const toneCls =
    tone === "good"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : "border-slate-200 bg-slate-50 text-slate-700";

  return (
    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${toneCls}`}>
      {children}
    </span>
  );
}

export default function ManagePage() {
  /*
    ENTITY GROUPS
    - Layout only (no business logic)
    - Reorder or expand safely as the system grows
  */

  const coreStructure: EntityConfig[] = [
    { key: "Add a Sport", description: "Define sports and governing rulesets." },
    { key: "Add an Association", description: "Manage associations and ownership." },
    { key: "Add a Facility", description: "Facilities, venues, and locations." },
  ];

  const competitionOps: EntityConfig[] = [
    {
      key: "Create a League or Competition",
      description: "Competitions, seasons, and registrations.",
    },
    {
      key: "Create a Team",
      description: "Teams participating in competitions.",
    },
  ];

  const people: EntityConfig[] = [
    { key: "Users", description: "System access and identity profiles." },
    { key: "Coaches", description: "Coach records and assignments." },
    { key: "Volunteers", description: "Volunteer roles and compliance." },
  ];

  const governance: EntityConfig[] = [
    { key: "Form A", description: "Governance and compliance Form A." },
    { key: "Form B", description: "Governance and compliance Form B." },
    { key: "Form C", description: "Governance and compliance Form C." },
  ];

  function getRoutes(x: Entity) {
    /*
      ROUTING STATUS
      - Wired: Users, Teams, Leagues, Forms A/B/C
      - Others are placeholders until implemented
    */

    const addHref =
      x === "Users"
        ? "/admin/manage/users/add"
        : x === "Create a Team"
        ? "/admin/manage/teams/add"
        : x === "Create a League or Competition"
        ? "/admin/manage/leagues/add"
        : x === "Form A"
        ? "/admin/manage/governance/forms/a/add"
        : x === "Form B"
        ? "/admin/manage/governance/forms/b/add"
        : x === "Form C"
        ? "/admin/manage/governance/forms/c/add"
        : undefined;

    const editHref =
      x === "Users"
        ? "/admin/manage/users"
        : x === "Create a Team"
        ? "/admin/manage/teams"
        : x === "Create a League or Competition"
        ? "/admin/manage/leagues"
        : x === "Form A"
        ? "/admin/manage/governance/forms/a"
        : x === "Form B"
        ? "/admin/manage/governance/forms/b"
        : x === "Form C"
        ? "/admin/manage/governance/forms/c"
        : undefined;

    const wired = Boolean(addHref || editHref);

    return { addHref, editHref, wired };
  }

  function EntityCard({ x }: { x: EntityConfig }) {
    const { addHref, editHref, wired } = getRoutes(x.key);

    return (
      <Card className="transition hover:shadow-md">
        <CardContent>
          {/* Title + status */}
          <div className="flex items-start justify-between gap-3">
            <div className="text-lg font-semibold text-slate-900">{x.key}</div>
            <Pill tone={wired ? "good" : "neutral"}>
              {wired ? "Wired" : "Coming soon"}
            </Pill>
          </div>

          {/* Description */}
          <div className="mt-2 text-sm text-slate-600">{x.description}</div>

          {/* Actions */}
          <div className="mt-4 flex gap-2">
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
  }

  return (
    <div>
      {/* PAGE HEADER */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">
        Super User – Management
      </h1>

      <p className="mt-2 text-slate-600">
        Configure system structure, competition operations, people, and governance.
      </p>

      {/* CORE STRUCTURE */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold text-slate-900">Core Structure</h2>
        <p className="mt-1 text-sm text-slate-600">
          Foundational entities required before competitions can be created.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {coreStructure.map((x) => (
            <EntityCard key={x.key} x={x} />
          ))}
        </div>
      </section>

      {/* COMPETITION OPERATIONS */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900">
          Competition Operations
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Manage leagues, competitions, and participating teams.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {competitionOps.map((x) => (
            <EntityCard key={x.key} x={x} />
          ))}
        </div>
      </section>

      {/* PEOPLE & ROLES */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900">
          People & Roles
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          System users, staff, and volunteer role management.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {people.map((x) => (
            <EntityCard key={x.key} x={x} />
          ))}
        </div>
      </section>

      {/* ADMINISTRATION & GOVERNANCE */}
      <section className="mt-10">
        <h2 className="text-sm font-semibold text-slate-900">
          Administration & Governance
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Super User–only governance, compliance, and official forms.
        </p>

        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {governance.map((x) => (
            <EntityCard key={x.key} x={x} />
          ))}
        </div>
      </section>
    </div>
  );
}
