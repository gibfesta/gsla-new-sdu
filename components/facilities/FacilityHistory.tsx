"use client";
import { useEffect, useState } from "react";

type HistoryEvent = {
  id: string; action: string; actor_role: string | null; occurred_at: string;
  record_version: number; content_version: number; reason: string | null;
  revision: { information: unknown } | null;
  request: { kind: string; state: string; snapshot: unknown; submitted_at: string; decided_at: string | null; decision_reason: string | null } | null;
};

export default function FacilityHistory({ facilityId }: { facilityId: string }) {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<{ events: HistoryEvent[]; hasMore: boolean } | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/facilities/${facilityId}/history?page=${page}`, { cache: "no-store", signal: controller.signal })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load history");
        if (!controller.signal.aborted) setResult(data);
      }).catch((err: Error) => { if (!controller.signal.aborted) setError(err.message); });
    return () => controller.abort();
  }, [facilityId, page]);
  function changePage(next: number) { setResult(null); setError(""); setPage(next); }
  return <section className="rounded-2xl border border-slate-200 bg-white p-6" aria-label="Facility history">
    <h2 className="text-lg font-bold text-[#0C2F57]">Facility history</h2>
    {error ? <p role="alert">{error}</p> : !result ? <p role="status">Loading history...</p> : <>
      {result.events.length === 0 ? <p className="mt-4">No recorded history.</p> : <ol className="mt-4 space-y-4">{result.events.map(event => <li key={event.id} className="rounded-xl border border-slate-200 p-4">
        <p className="font-semibold">{event.action.replaceAll("_", " ")}</p>
        <p className="text-sm">{new Date(event.occurred_at).toLocaleString()} · {event.actor_role || "Recorded migration"}</p>
        <p className="text-sm">Record version {event.record_version} · Content version {event.content_version}</p>
        {event.reason && <p className="mt-2 whitespace-pre-wrap text-sm">Reason: {event.reason}</p>}
        {event.request && <p className="mt-2 text-sm">{event.request.kind.replaceAll("_", " ")} request: {event.request.state} · Submitted {new Date(event.request.submitted_at).toLocaleString()}{event.request.decided_at ? ` · Decided ${new Date(event.request.decided_at).toLocaleString()}` : ""}{event.request.decision_reason ? ` · Decision reason: ${event.request.decision_reason}` : ""}</p>}
        {(event.revision || event.request) && <details className="mt-3"><summary className="cursor-pointer font-semibold text-[#155ca7]">View preserved snapshot</summary><pre className="mt-2 max-h-96 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-slate-50 p-3 text-xs">{JSON.stringify(event.revision?.information ?? event.request?.snapshot, null, 2)}</pre></details>}
      </li>)}</ol>}
      <div className="mt-4 flex items-center gap-4"><button type="button" disabled={page === 1} onClick={() => changePage(page - 1)} className="font-semibold text-[#155ca7] disabled:opacity-40">Previous</button><span>Page {page}</span><button type="button" disabled={!result.hasMore} onClick={() => changePage(page + 1)} className="font-semibold text-[#155ca7] disabled:opacity-40">Next</button></div>
    </>}
  </section>;
}
