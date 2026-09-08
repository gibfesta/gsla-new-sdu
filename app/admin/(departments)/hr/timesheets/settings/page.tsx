export default function TimesheetsSettingsPage() {
  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <a href="/admin/hr/timesheets" style={{ textDecoration: "underline" }}>
        ← Back to Timesheets
      </a>

      <h1 style={{ fontSize: 22, fontWeight: 800, marginTop: 14 }}>Timesheets Settings</h1>
      <p style={{ marginTop: 6, opacity: 0.8 }}>
        Placeholder settings page. Next we’ll connect these to the database.
      </p>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 800, marginTop: 0 }}>Week rules</h2>
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.85 }}>
          <li>Payroll week: Saturday → Saturday</li>
          <li>Facility submission: 1 centre manager approval required</li>
          <li>After Accounts lock: no edits (only adjustments)</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: 16,
          padding: 14,
          border: "1px solid #eee",
          borderRadius: 12,
          background: "#fff",
        }}
      >
        <h2 style={{ fontSize: 16, fontWeight: 800, marginTop: 0 }}>Reason codes</h2>
        <p style={{ marginTop: 6, opacity: 0.8 }}>
          These will become editable (add/remove/rename) once wired to DB.
        </p>
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.85 }}>
          <li>As rota</li>
          <li>Rota change</li>
          <li>Overtime</li>
          <li>Sick cover</li>
          <li>Sick leave</li>
          <li>Annual leave</li>
          <li>Unpaid leave</li>
          <li>Other</li>
        </ul>
      </div>
    </div>
  );
}
