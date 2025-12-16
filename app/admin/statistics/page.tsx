import { Card, CardContent } from "@/components/ui/card";
// Line chart component responsible for rendering participation trends over time
// Edit this component if you need to change chart data, labels, or visualization style
import StatsLineChart from "@/components/stats/StatsLineChart";

export default function StatsPage() {
  return (
    <div>
      {/* ============================================================
          PAGE HEADER
          ------------------------------------------------------------
          Purpose:
          - High-level title and context for the statistics section
          - This is the entry point for admins viewing participation data

          Edit here if:
          - You want to rename the page
          - You want to adjust the subtitle or add explanatory copy
         ============================================================ */}
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Statistics</h1>
      <p className="mt-2 text-slate-600">Participation Trends</p>

      {/* ============================================================
          KPI / SUMMARY CARDS
          ------------------------------------------------------------
          Purpose:
          - Quick-glance headline numbers (KPIs)
          - Typically totals, deltas, or key metrics for leadership

          Edit here if:
          - You want to add/remove KPIs
          - You want to wire these values to real data later
          - You want to adjust card colors to match meaning
         ============================================================ */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Total Participants KPI */}
        <Card>
          <CardContent className="bg-[#0C2F57]/10">
            {/* Static placeholder value — replace with dynamic data when backend is connected */}
            <div className="text-5xl font-extrabold">1,250</div>
            <div className="mt-2 text-slate-700">Total Participants</div>
          </CardContent>
        </Card>

        {/* New Participants KPI */}
        <Card>
          <CardContent className="bg-[#D81E27]/10">
            {/* Highlighted color implies change or growth */}
            <div className="text-5xl font-extrabold text-[#7F1D1D]">630</div>
            <div className="mt-2 text-slate-700">New Participants</div>
          </CardContent>
        </Card>
      </div>

      {/* ============================================================
          CHART / DATA VISUALIZATION SECTION
          ------------------------------------------------------------
          Purpose:
          - Show trends over time rather than static numbers
          - Helps identify growth, drop-off, or seasonality

          Edit here if:
          - You want to add filters (date range, sport, region)
          - You want multiple charts on the same page
          - You want to change section titles or layout
         ============================================================ */}
      <div className="mt-6">
        <Card>
          <CardContent>
            {/* Section title for the chart */}
            <div className="text-xl font-semibold text-slate-900">
              Participants Over Time
            </div>

            {/* Chart container */}
            <div className="mt-4">
              {/* 
                StatsLineChart:
                - Handles all chart rendering internally
                - Data source and config live inside the component
                - Swap or extend this component for different chart types
              */}
              <StatsLineChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
