export function CreateReportFormFields({ name, setName, desc, setDesc, type, setType, format, setFormat, sched, setSched }: any) {
  return (
    <>
      <div><label className="block text-slate-300 font-medium mb-1">Report Name *</label><input type="text" required placeholder="e.g. Q3 Headcount & Compliance Audit" value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500" /></div>
      <div><label className="block text-slate-300 font-medium mb-1">Description</label><textarea rows={2} placeholder="Optional report context or notes..." value={desc} onChange={(e) => setDesc(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500" /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className="block text-slate-300 font-medium mb-1">Report Type</label><select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"><option value="employee">Employee</option><option value="payroll">Payroll</option><option value="attendance">Attendance</option><option value="leave">Leave</option><option value="recruitment">Recruitment</option><option value="travel">Travel</option><option value="compliance">Compliance</option><option value="audit">Audit</option><option value="ai-insights">AI Insights</option></select></div>
        <div><label className="block text-slate-300 font-medium mb-1">Export Format</label><select value={format} onChange={(e) => setFormat(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"><option value="pdf">PDF Document</option><option value="csv">CSV Spreadsheet</option><option value="excel">Excel Workbook</option></select></div>
      </div>
      <div><label className="block text-slate-300 font-medium mb-1">Automation Schedule</label><select value={sched} onChange={(e) => setSched(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-indigo-500"><option value="none">One-time Execution (None)</option><option value="daily">Daily Schedule</option><option value="weekly">Weekly Schedule</option><option value="monthly">Monthly Schedule</option></select></div>
    </>
  );
}
