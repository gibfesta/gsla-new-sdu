import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/**
 * REMINDERS SEED DATA
 * -------------------
 * This is temporary / placeholder data for the reminders list.
 * 
 * 🔧 Change this array when:
 * - You want to test different reminder types
 * - You add API-backed reminders later (this will likely be removed then)
 * - You want to adjust urgency wording ("7 days", "14 days", etc.)
 *
 * Expected shape:
 * - title: short description shown to the user
 * - due: human-readable time until due (currently static text)
 * - level: urgency level (used for visual badge only right now)
 */
const reminders = [
  { title: "First Aid Certificate renewal", due: "7 days", level: "High" },
  { title: "Safeguarding training expires", due: "14 days", level: "Medium" },
  { title: "Coach license check-in", due: "30 days", level: "Low" },
];

export default function RemindersPage() {
  return (
    <div>
      {/* PAGE TITLE
          ----------
          Main heading for the Reminders section.
          Change text here if this page gets renamed globally (e.g. "Alerts" instead of "Reminders") */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Reminders</h1>

      {/* PAGE DESCRIPTION
          ----------------
          Short explanatory text shown under the title.
          Useful for admins to understand scope of reminders across the system */}
      <p className="mt-2 text-slate-600">
        Deadlines, renewals, and alerts across all sports.
      </p>

      <div className="mt-6">
        {/* MAIN REMINDERS CARD
            -------------------
            Container for the upcoming reminders list.
            If you later split this into tabs (Upcoming / Completed),
            this Card will likely stay and the inner content will change. */}
        <Card>
          <CardContent>
            {/* CARD HEADER ROW
                ----------------
                Contains section title + primary action button */}
            <div className="flex items-center justify-between">
              {/* SECTION TITLE */}
              <div className="text-xl font-semibold">Upcoming</div>

              {/* CREATE REMINDER BUTTON
                  ----------------------
                  Currently non-functional.
                  Hook this up later to:
                  - Open a modal
                  - Navigate to a "Create Reminder" form
                  - Trigger a drawer / side panel */}
              <button className="rounded-xl bg-[#D81E27] px-4 py-2 text-sm font-semibold text-white hover:opacity-95">
                Create Reminder
              </button>
            </div>

            {/* REMINDERS LIST
                ---------------
                Iterates over the reminders array and renders each item.
                When converting to live data, this map will stay the same,
                only the data source will change. */}
            <div className="mt-4 divide-y divide-slate-200">
              {reminders.map((r) => (
                /* SINGLE REMINDER ROW
                   -------------------
                   Each row represents one reminder / deadline */
                <div
                  key={r.title} // Assumes titles are unique (fine for now, replace with ID later)
                  className="flex items-center justify-between py-4"
                >
                  {/* REMINDER DETAILS
                      -----------------
                      Left side: what the reminder is + when it’s due */}
                  <div>
                    <div className="font-semibold text-slate-900">
                      {r.title}
                    </div>
                    <div className="text-sm text-slate-600">
                      Due in: {r.due}
                    </div>
                  </div>

                  {/* REMINDER ACTIONS
                      -----------------
                      Right side: urgency + available actions */}
                  <div className="flex items-center gap-3">
                    {/* URGENCY BADGE
                        -------------
                        Currently visual-only.
                        Later you may:
                        - Color-code based on level
                        - Auto-calculate level from due date */}
                    <Badge>{r.level}</Badge>

                    {/* VIEW BUTTON
                        -----------
                        Intended for:
                        - Opening reminder details
                        - Showing linked user / document / certificate */}
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      View
                    </button>

                    {/* MARK DONE BUTTON
                        ----------------
                        Intended for:
                        - Marking reminder as completed
                        - Removing it from "Upcoming"
                        - Moving it to a "Completed" state */}
                    <button className="rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                      Mark done
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
