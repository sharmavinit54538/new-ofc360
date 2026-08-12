import { Shield, ShieldAlert, Trash2, FileText, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useATSStore } from "@/stores/atsStore";
import { toast } from "sonner";

export function ComplianceAuditLogs() {
  const { auditLogs } = useATSStore();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Compliance & Immutable Audit Logs</h2>
          <p className="text-sm text-muted-foreground">
            GDPR right-to-be-forgotten erasure, EEOC compliance metrics, and immutable action trail.
          </p>
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={() => toast.success("GDPR Right-to-be-forgotten candidate request executed!")}
          className="gap-1.5 text-xs text-destructive border-destructive/30"
        >
          <Trash2 className="w-3.5 h-3.5" /> Execute GDPR Erasure Request
        </Button>
      </div>

      <div className="glass-card rounded-xl p-5 border border-border/50 space-y-4">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" /> Immutable Security Audit Logs
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-secondary/40 border-b border-border/40 text-muted-foreground">
              <tr>
                <th className="p-3">Log ID</th>
                <th className="p-3">Action Details</th>
                <th className="p-3">User</th>
                <th className="p-3">Module</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3 font-mono">{log.id}</td>
                  <td className="p-3 font-semibold text-foreground">{log.action}</td>
                  <td className="p-3 text-muted-foreground">{log.user}</td>
                  <td className="p-3"><Badge variant="outline" className="text-[10px]">{log.module}</Badge></td>
                  <td className="p-3 font-mono text-[10px] text-muted-foreground">{log.ipAddress}</td>
                  <td className="p-3 text-muted-foreground font-mono">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
