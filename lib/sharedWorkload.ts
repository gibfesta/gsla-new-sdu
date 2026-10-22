export const WORKLOAD_KEY = "gsla-shared-workload-sample-v1";
export const TASK_TYPES = ["Routine duty", "Event", "Maintenance issue", "Handover", "Report", "Compliance"] as const;
export const TASK_STATUSES = ["Pending", "In progress", "Completed"] as const;
export const PRIORITIES = ["Low", "Medium", "High"] as const;
export type TaskType = typeof TASK_TYPES[number];
export type TaskStatus = typeof TASK_STATUSES[number];
export type Priority = typeof PRIORITIES[number];
export const MANAGERS = [
  { id: "sample-manager-a", name: "Manager A", venue: "Bayside Sports Complex", venueId: "sample-bayside", initials: "MA" },
  { id: "sample-manager-b", name: "Manager B", venue: "Lathbury Pool", venueId: "sample-lathbury", initials: "MB" },
  { id: "sample-manager-c", name: "Manager C", venue: "Europa Sports Complex", venueId: "sample-europa", initials: "MC" },
] as const;
export const DUTIES = [
  { id: "inspection", title: "Daily facility inspection", frequency: "Daily" },
  { id: "issues", title: "Review maintenance issues", frequency: "Daily" },
  { id: "events", title: "Check upcoming events", frequency: "Daily" },
  { id: "handovers", title: "Review AM / PM handovers", frequency: "Daily" },
  { id: "report", title: "Submit operational report", frequency: "Weekly" },
  { id: "compliance", title: "Review compliance requirements", frequency: "Monthly" },
] as const;
export type WorkloadTask = {
  id: string; title: string; managerId: string; type: TaskType; priority: Priority;
  dueDate: string; status: TaskStatus; dutyId?: string; notes: string; evidence: string;
};
export type WorkloadSnapshot = { version: 1; tasks: WorkloadTask[] };
export const today = () => new Date().toISOString().slice(0, 10);
export function overdue(task: WorkloadTask, asOf = today()) { return task.status !== "Completed" && task.dueDate < asOf; }
export function summary(tasks: WorkloadTask[], asOf = today()) {
  const completed = tasks.filter(t => t.status === "Completed").length;
  return { assigned: tasks.length, completed, outstanding: tasks.length - completed,
    overdue: tasks.filter(t => overdue(t, asOf)).length,
    rate: tasks.length ? Math.round(completed / tasks.length * 100) : null };
}
export function selectTasks(tasks: WorkloadTask[], month: string, managerId = "", venueId = "") {
  return tasks.filter(t => t.dueDate.startsWith(month + "-") && (!managerId || t.managerId === managerId) &&
    (!venueId || MANAGERS.some(m => m.id === t.managerId && m.venueId === venueId)));
}
export function recentMonths(month: string) {
  const [year, value] = month.split("-").map(Number);
  return Array.from({ length: 6 }, (_, i) => {
    const date = new Date(Date.UTC(year, value - 6 + i, 1));
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}
export function monthLabel(month: string) {
  return new Date(month + "-01T12:00:00Z").toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });
}
export function sampleWorkload(): WorkloadSnapshot {
  const tasks: WorkloadTask[] = [];
  recentMonths("2026-10").forEach((month, monthIndex) => {
    MANAGERS.forEach((manager, managerIndex) => {
      const assigned = [24, 20, 18][managerIndex];
      const complete = [18, 16, 8][managerIndex] - (5 - monthIndex);
      for (let i = 0; i < assigned; i++) {
        const routine = i < DUTIES.length;
        const type = routine ? "Routine duty" : TASK_TYPES[1 + (i % 5)];
        const titles: Record<TaskType, string> = { "Routine duty": "Routine duty", Event: "Coordinate event preparation", "Maintenance issue": "Review repair progress", Handover: "Review shift handover", Report: "Prepare venue activity report", Compliance: "Check inspection documents" };
        tasks.push({ id: `sample-${month}-${managerIndex}-${i}`, title: routine ? DUTIES[i].title : `${titles[type]} ${i - 5}`,
          managerId: manager.id, type, priority: PRIORITIES[i % 3], dueDate: `${month}-${String(2 + i % 27).padStart(2, "0")}`,
          status: (i * 7) % assigned < complete ? "Completed" : i % 2 ? "In progress" : "Pending", ...(routine ? { dutyId: DUTIES[i].id } : {}),
          notes: "Example task for layout and workload planning. Not a live operational record.", evidence: (i * 7) % assigned < complete ? "Sample completion note" : "" });
      }
    });
  });
  return { version: 1, tasks };
}
function dateValid(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(Date.parse(value + "T12:00:00Z")) && new Date(value + "T12:00:00Z").toISOString().slice(0, 10) === value;
}
export function validTask(value: unknown): value is WorkloadTask {
  if (!value || typeof value !== "object") return false;
  const t = value as WorkloadTask;
  return typeof t.id === "string" && /^[a-zA-Z0-9-]{1,120}$/.test(t.id) &&
    typeof t.title === "string" && t.title.trim().length > 0 && t.title.length <= 160 &&
    MANAGERS.some(m => m.id === t.managerId) && TASK_TYPES.includes(t.type) && TASK_STATUSES.includes(t.status) &&
    PRIORITIES.includes(t.priority) && dateValid(t.dueDate) && typeof t.notes === "string" && t.notes.length <= 2000 &&
    typeof t.evidence === "string" && t.evidence.length <= 1000 &&
    (t.dutyId === undefined || (t.type === "Routine duty" && DUTIES.some(d => d.id === t.dutyId)));
}
export function parseWorkload(raw: string): WorkloadSnapshot {
  if (raw.length > 5_000_000) throw new Error("Sample workspace is too large.");
  const value = JSON.parse(raw) as WorkloadSnapshot;
  if (!value || value.version !== 1 || !Array.isArray(value.tasks) || value.tasks.length > 5000 ||
      !value.tasks.every(validTask) || new Set(value.tasks.map(t => t.id)).size !== value.tasks.length) {
    throw new Error("Saved sample workspace is invalid.");
  }
  // Keep only defined structural fields; no arbitrary stored metadata is forwarded.
  return { version: 1, tasks: value.tasks.map(t => ({ id: t.id, title: t.title, managerId: t.managerId, type: t.type,
    priority: t.priority, dueDate: t.dueDate, status: t.status, notes: t.notes, evidence: t.evidence, ...(t.dutyId ? { dutyId: t.dutyId } : {}) })) };
}

export function workloadMonth(value: unknown): string {
  return typeof value === "string" && /^(20\d{2}|2100)-(0[1-9]|1[0-2])$/.test(value) ? value : "2026-10";
}
