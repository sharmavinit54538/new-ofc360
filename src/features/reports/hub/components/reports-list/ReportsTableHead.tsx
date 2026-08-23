export function ReportsTableHead() {
  return (
    <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
      <tr>
        <th className="p-3.5">Report Name</th>
        <th className="p-3.5">Type</th>
        <th className="p-3.5">Format</th>
        <th className="p-3.5">Status</th>
        <th className="p-3.5">Schedule</th>
        <th className="p-3.5">Created At</th>
        <th className="p-3.5 text-right">Actions</th>
      </tr>
    </thead>
  );
}
