export function SecurityAuditLogCard({ securityAuditRes }: { securityAuditRes: any }) {
  const list = securityAuditRes?.data;
  if (!list || list.length === 0) return null;
  return (
    <div className="bg-slate-800/40 border border-slate-700/60 rounded-xl p-5">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Security Audit Trail Log</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/80 text-slate-400"><tr><th className="p-3">User</th><th className="p-3">Action</th><th className="p-3">Resource</th><th className="p-3">IP</th><th className="p-3">Time</th></tr></thead>
          <tbody className="divide-y divide-slate-800">{list.map((log: any, idx: number) => (
            <tr key={idx} className="hover:bg-slate-800/30"><td className="p-3 font-medium text-slate-200">{log.user_email}</td><td className="p-3 font-mono text-indigo-400">{log.action}</td><td className="p-3">{log.resource}</td><td className="p-3 font-mono text-slate-400">{log.ip_address}</td><td className="p-3 text-slate-500">{log.timestamp}</td></tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
