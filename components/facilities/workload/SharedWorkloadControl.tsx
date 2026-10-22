"use client";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, LayoutGrid, List, Plus, Search } from "lucide-react";
import FacilitiesDepartmentBanner from "@/components/facilities/FacilitiesDepartmentBanner";
import { MANAGERS, PRIORITIES, TASK_TYPES, monthLabel, overdue, selectTasks, workloadMonth, type TaskStatus, type WorkloadTask } from "@/lib/sharedWorkload";
import { useWorkload, saveWorkloadTask } from "./useWorkload";
import { Analysis, Empty, ManagerRegister, MetricCards, RequiredDuties, TaskCollection, Trends, WorkBreakdown, button, input, panel, type View } from "./WorkloadViews";
import TaskDialog from "./TaskDialog";
const mainTabs = [{ id: "overview", label: "Overview" }, { id: "managers", label: "Manager workloads" }, { id: "duties", label: "Required duties" }, { id: "tasks", label: "Tasks" }, { id: "analysis", label: "Management analysis" }];
const detailTabs = [{ id: "overview", label: "Overview" }, { id: "tasks", label: "Tasks" }, { id: "duties", label: "Required duties" }, { id: "events", label: "Events" }, { id: "issues", label: "Maintenance & issues" }, { id: "handovers", label: "Handovers" }, { id: "reports", label: "Reports" }];
const typeForTab: Record<string, string> = { events: "Event", issues: "Maintenance issue", handovers: "Handover", reports: "Report" };
export default function SharedWorkloadControl({ managerId = "", initialMonth = "2026-10" }: { managerId?: string; initialMonth?: string }) {
 const { data, notice } = useWorkload();
 const manager = MANAGERS.find(m => m.id === managerId);
 const [month, setMonth] = useState(initialMonth);
 const [tab, setTab] = useState("overview");
 const [view, setView] = useState<View>("list");
 const [venue, setVenue] = useState("");
 const [managerFilter, setManagerFilter] = useState("");
 const [query, setQuery] = useState("");
 const [status, setStatus] = useState("");
 const [type, setType] = useState("");
 const [priority, setPriority] = useState("");
 const [editor, setEditor] = useState<{ task: WorkloadTask; creating: boolean } | null>(null);
 const [message, setMessage] = useState("");
 const effectiveManager = managerId || managerFilter;
 const managers = MANAGERS.filter(m => (!effectiveManager || m.id === effectiveManager) && (!venue || m.venueId === venue));
 const tasks = selectTasks(data.tasks, month, effectiveManager, venue);
 const trendTasks = data.tasks.filter(t => managers.some(m => m.id === t.managerId));
 const listed = tasks.filter(t => (!query || [t.title, t.notes, t.evidence, t.id, MANAGERS.find(m => m.id === t.managerId)?.name].join(" ").toLowerCase().includes(query.toLowerCase())) &&
   (!status || (status === "Overdue" ? overdue(t) : t.status === status)) && (!(typeForTab[tab] || type) || t.type === (typeForTab[tab] || type)) && (!priority || t.priority === priority))
   .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title));
 const tabs = manager ? detailTabs : mainTabs;
 const taskTab = tab === "tasks" || Boolean(typeForTab[tab]);
 function assign() {
  const assignee = managers[0] || MANAGERS[0];
  setEditor({ creating: true, task: { id: crypto.randomUUID(), title: "", managerId: assignee.id, type: (typeForTab[tab] || "Routine duty") as WorkloadTask["type"], dueDate: month + "-22", priority: "Medium", status: "Pending", notes: "", evidence: "" } });
 }
 function updateStatus(task: WorkloadTask, next: TaskStatus) {
  try { saveWorkloadTask({ ...task, status: next }); setMessage(`Updated “${task.title}” in this sample workspace.`); }
  catch (err) { setMessage(err instanceof Error ? err.message : "Task could not be updated."); }
 }
 return <div className="space-y-5 text-[#112d56]">
  <FacilitiesDepartmentBanner title={manager ? `${manager.name} — Workload` : "Shared Workload Control"} description={manager ? `${manager.venue}. Review assigned work, required duties and operational follow-up.` : "Plan work across your venues. Review assignments, routine duties, overdue tasks and workload balance."}/>
  {manager && <Link className={button} href={`/facilities/shared-workload-control?month=${month}`}><ArrowLeft size={16} aria-hidden="true"/>Back to Shared Workload Control</Link>}
  <div className="flex flex-wrap items-center justify-between gap-3"><p className="rounded-full border border-[#cfdff2] bg-[#eef5fd] px-3 py-1.5 text-xs font-semibold text-[#35557f]">Sample workspace · Saved in this browser · Not shared with colleagues</p><button type="button" className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#155ca7] px-4 py-2 text-sm font-semibold text-white hover:bg-[#104b89]" onClick={assign}><Plus size={17} aria-hidden="true"/>Assign task</button></div>
  {notice && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">{notice}</p>}
  {message && <p role="status" className="rounded-xl border border-[#d5e4f6] bg-white p-3 text-sm">{message}</p>}
  <div className={panel + " flex flex-wrap items-end justify-between gap-4"}><div className="flex flex-wrap items-end gap-3"><label className="text-xs font-semibold text-[#60799f]">Due month<input type="month" min="2000-01" max="2100-12" value={month} onChange={e => { if (workloadMonth(e.target.value) === e.target.value) setMonth(e.target.value); }} className={input + " mt-1 block"}/></label>{!manager && <><label className="text-xs font-semibold text-[#60799f]">Facility<select value={venue} onChange={e => { setVenue(e.target.value); setManagerFilter(""); }} className={input + " mt-1 block"}><option value="">All sample facilities</option>{MANAGERS.map(m => <option key={m.venueId} value={m.venueId}>{m.venue}</option>)}</select></label><label className="text-xs font-semibold text-[#60799f]">Manager<select value={managerFilter} onChange={e => setManagerFilter(e.target.value)} className={input + " mt-1 block"}><option value="">All sample managers</option>{MANAGERS.filter(m => !venue || m.venueId === venue).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></label></>}</div><div role="group" aria-label="Workload view" className="flex rounded-lg bg-slate-100 p-1">{(["list", "cards"] as const).map(value => <button key={value} type="button" aria-pressed={view === value} onClick={() => setView(value)} className={`inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold ${view === value ? "bg-[#0c2f57] text-white" : "text-[#35557f]"}`}>{value === "list" ? <List size={16} aria-hidden="true"/> : <LayoutGrid size={16} aria-hidden="true"/>}{value === "list" ? "List" : "Cards"}</button>)}</div></div>
  <MetricCards tasks={tasks}/>
  <p className="text-xs text-[#60799f]">{monthLabel(month)} · Tasks due in this month · Overdue means past its due date and not completed. Outstanding includes overdue.</p>
  <nav aria-label="Workload sections" className="flex flex-wrap gap-1 rounded-xl border border-[#d5e4f6] bg-white p-1">{tabs.map(item => <button key={item.id} type="button" aria-pressed={tab === item.id} onClick={() => { setTab(item.id); setQuery(""); setStatus(""); setType(""); setPriority(""); }} className={`min-h-10 rounded-lg px-4 py-2 text-sm font-semibold ${tab === item.id ? "bg-[#155ca7] text-white" : "text-[#35557f] hover:bg-blue-50"}`}>{item.label}</button>)}</nav>
  {tab === "overview" && <div className="space-y-5">{manager ? <><WorkBreakdown tasks={tasks}/><section className={panel}><h2 className="mb-4 text-xl font-bold">Outstanding work</h2><TaskCollection tasks={tasks.filter(t => t.status !== "Completed").sort((a, b) => a.dueDate.localeCompare(b.dueDate)).slice(0, 5)} view={view} onOpen={task => setEditor({ task, creating: false })} onStatus={updateStatus}/></section></> : <section className="space-y-3"><h2 className="text-xl font-bold">Facilities manager workload</h2><ManagerRegister tasks={tasks} managers={managers} month={month} view={view}/></section>}<Trends tasks={trendTasks} month={month} managers={managers}/></div>}
  {tab === "managers" && <div className="space-y-5"><ManagerRegister tasks={tasks} managers={managers} month={month} view={view}/><Trends tasks={trendTasks} month={month} managers={managers}/></div>}
  {tab === "duties" && <RequiredDuties tasks={tasks} managers={managers} view={view} onOpen={task => setEditor({ task, creating: false })}/>}
  {taskTab && <section className="space-y-4"><div className={panel + " flex flex-wrap items-end gap-3"}><label className="text-xs font-semibold text-[#60799f]"><span className="flex items-center gap-1"><Search size={14} aria-hidden="true"/>Search tasks</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="Task, note or manager…" className={input + " mt-1 block"}/></label><label className="text-xs font-semibold text-[#60799f]">Status<select value={status} onChange={e => setStatus(e.target.value)} className={input + " mt-1 block"}>{["", "Pending", "In progress", "Completed", "Overdue"].map(s => <option key={s} value={s}>{s || "All statuses"}</option>)}</select></label>{!typeForTab[tab] && <label className="text-xs font-semibold text-[#60799f]">Type<select value={type} onChange={e => setType(e.target.value)} className={input + " mt-1 block"}><option value="">All types</option>{TASK_TYPES.map(t => <option key={t}>{t}</option>)}</select></label>}<label className="text-xs font-semibold text-[#60799f]">Priority<select value={priority} onChange={e => setPriority(e.target.value)} className={input + " mt-1 block"}><option value="">All priorities</option>{PRIORITIES.map(p => <option key={p}>{p}</option>)}</select></label></div><p role="status" className="text-sm text-[#60799f]">{listed.length} matching task{listed.length === 1 ? "" : "s"}. Filters apply to this task list.</p>{listed.length ? <TaskCollection tasks={listed} view={view} onOpen={task => setEditor({ task, creating: false })} onStatus={updateStatus}/> : <Empty/>}</section>}
  {tab === "analysis" && <Analysis tasks={tasks} managers={managers} month={month} view={view}/>}
  {editor && <TaskDialog key={editor.task.id} initial={editor.task} creating={editor.creating} onClose={() => setEditor(null)} onSaved={() => { setEditor(null); setMessage("Sample task saved. Summary totals and charts have been updated. Check the manager, month and task filters if it is outside this selection."); }}/>}
 </div>;
}
