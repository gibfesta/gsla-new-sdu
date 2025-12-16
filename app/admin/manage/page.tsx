// UI card components used to visually group each management area (Sports, Teams, Users, etc.)

import { Card, CardContent } from "@/components/ui/card";

// Main admin page for managing core system entities
// This page acts as a high-level entry point into CRUD-style flows
export default function ManagePage() {
  return (
    <div>
      {/* Page title — change this text if you want to rename the section in the admin UI */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">
        Add / Edit / Delete
      </h1>

      {/* Short description explaining the purpose of this page */}
      <p className="mt-2 text-slate-600">
        Manage sports, associations, teams, and people records.
      </p>

      {/* 
        Grid layout for management cards
        - 1 column on mobile
        - 3 columns on medium+ screens
        - Each card represents a "manageable entity" in the system
      */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {[
          // List of entity types shown on this page
          // Edit this array to add/remove management sections
          "Sports",
          "Associations",
          "Teams",
          "Coaches",
          "Volunteers",
          "Users",
        ].map((x) => (
          // Individual management card for each entity
          <Card
            key={x}
            // Hover styling purely for visual affordance (no functional impact)
            className="hover:shadow-md transition"
          >
            <CardContent>
              {/* Entity title — driven directly from the array above */}
              <div className="text-lg font-semibold">{x}</div>

              {/* 
                Generic description for all entities
                If different entities need custom descriptions later,
                this text will likely become conditional or data-driven
              */}
              <div className="mt-2 text-sm text-slate-600">
                Create, edit, deactivate, and audit.
              </div>

              {/* 
                Action buttons for this entity
                NOTE: These are currently visual only
                Future logic would route to:
                - Add: creation flow
                - Edit: list / search / edit flow
              */}
              <div className="mt-4 flex gap-2">
                {/* Primary action — typically "Add New" */}
                <button className="rounded-xl bg-[#0C2F57] px-3 py-2 text-sm font-semibold text-white">
                  Add
                </button>

                {/* Secondary action — typically opens existing records */}
                <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                  Edit
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
