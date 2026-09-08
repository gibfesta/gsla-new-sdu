/**
 * INLINE DEV NOTES (Visible in code only — not shown in the UI)
 * ------------------------------------------------------------
 * Page purpose:
 * - Acts as a central "Information / Documentation" hub inside the admin system
 * - High-level guidance for how the GSLA system works (roles, data, rules, etc.)
 *
 * Safe to change:
 * - Text content (titles/descriptions)
 * - Number of cards
 *
 * Do NOT change unless intentional:
 * - Overall layout/grid
 * - Card structure (keeps consistency with other admin pages)
 */

import { Card, CardContent } from "@/components/ui/card";

/**
 * INFO CARDS DATA
 * ----------------
 * Each object here represents one information card on the page.
 *
 * 👉 To ADD a new card:
 *    - Add a new object to this array
 *
 * 👉 To RENAME a card:
 *    - Change `title`
 *
 * 👉 To change the short description:
 *    - Change `desc`
 *
 * Note:
 * - `title` is also used as the React `key`, so it should remain unique.
 */
const items = [
  { title: "About GSLA System", desc: "How data is collected and used." },
  { title: "Roles & Permissions", desc: "Who can see what and why." },
  { title: "Data Quality", desc: "Guidance on keeping entries consistent." },

  // TODO (future): Replace this placeholder with a real system topic
  { title: "Add New Info Here?", desc: "Guidance on living life." },
];

export default function InfoPage() {
  return (
    <div>
      {/* PAGE TITLE
          ----------
          Change this only if the section name changes globally */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">
        Information
      </h1>

      {/* PAGE DESCRIPTION
          ----------------
          Short explanation shown under the title */}
      <p className="mt-2 text-slate-600">
        System information, guidance, and documentation.
      </p>

      {/* INFO CARDS GRID
          ----------------
          - Responsive grid (1 column mobile, 3 columns desktop)
          - Automatically grows/shrinks based on `items` array */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {items.map((it) => (
          <Card
            key={it.title}
            className="hover:shadow-md transition"
          >
            <CardContent>
              {/* CARD TITLE
                  ----------
                  Comes from items[].title */}
              <div className="text-lg font-semibold">
                {it.title}
              </div>

              {/* CARD DESCRIPTION
                  ----------------
                  Comes from items[].desc */}
              <div className="mt-2 text-sm text-slate-600">
                {it.desc}
              </div>

              {/* ACTION BUTTON
                  --------------
                  Currently non-functional placeholder
                  Future idea:
                  - Could link to a dedicated info page
                  - Could open a modal
                  - Could route to /info/[slug] */}
              <button className="mt-4 rounded-xl border border-slate-200 px-3 py-2 text-sm hover:bg-slate-50">
                Open
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
