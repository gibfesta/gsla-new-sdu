import { Card, CardContent } from "@/components/ui/Card";
import StatsLineChart from "@/components/stats/StatsLineChart";

export default function StatsPage() {
  return (
    <div>
      <h1 className="text-4xl font-extrabold text-[#0C2F57]">Stats</h1>
      <p className="mt-2 text-slate-600">Participation Trends</p>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="bg-[#0C2F57]/10">
            <div className="text-5xl font-extrabold">1,250</div>
            <div className="mt-2 text-slate-700">Total Participants</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="bg-[#D81E27]/10">
            <div className="text-5xl font-extrabold text-[#7F1D1D]">630</div>
            <div className="mt-2 text-slate-700">New Participants</div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardContent>
            <div className="text-xl font-semibold text-slate-900">Participants Over Time</div>
            <div className="mt-4">
              <StatsLineChart />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
