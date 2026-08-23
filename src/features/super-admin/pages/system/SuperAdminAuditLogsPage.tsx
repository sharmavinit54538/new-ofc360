import { useState } from "react";
import {
  FileCode2,
  Search,
  Download,
  ShieldCheck,
  Building2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetSuperAdminAuditLogsQuery,
  useClearSuperAdminAuditLogsMutation,
} from "@/features/super-admin/api/superAdminApi";
import { toast } from "sonner";

export default function SuperAdminAuditLogsPage() {
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");

  const {
    data: auditLogs = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetSuperAdminAuditLogsQuery({
    search: search || undefined,
  });

  const [clearAuditLogs] = useClearSuperAdminAuditLogsMutation();

  const handleExportCSV = () => {
    if (auditLogs.length === 0) {
      toast.error("No logs available to export.");
      return;
    }

    const headers = "ID,Timestamp,Actor,Email,Action,Resource,Target,Result,IP Address\n";
    const rows = auditLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.actorEmail}","${l.action}","${l.resource}","${l.targetCompany || "Global"}","${l.result}","${l.ip}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ofc360_platform_audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Platform audit trail exported as CSV.");
  };

  const handleClearLogs = async () => {
    if (confirm("Are you sure you want to maintain/prune the platform audit logs?")) {
      try {
        await clearAuditLogs().unwrap();
        toast.success("Audit logs archive maintained.");
      } catch (err: any) {
        toast.error(err?.data?.detail || "Failed to prune audit logs.");
      }
    }
  };

  const filteredLogs = auditLogs.filter((l) => {
    const matchesResult = resultFilter === "ALL" || l.result === resultFilter;
    return matchesResult;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Master Audit Logs
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cross-tenant system audit trail tracking administrative actions, RBAC assignments, security policy adjustments, and tenant events from PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 text-xs gap-1.5 border-border/60"
            disabled={isFetching}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
          <Button onClick={handleExportCSV} variant="outline" size="sm" className="h-9 text-xs gap-1.5 border-border/60">
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>
          <Button onClick={handleClearLogs} variant="outline" size="sm" className="h-9 text-xs gap-1.5 text-destructive border-destructive/20 hover:bg-destructive/10">
            <Trash2 className="w-3.5 h-3.5" />
            <span>Prune Logs</span>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by action, actor, or details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/40 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="h-9 text-xs w-[140px] bg-secondary/40">
              <SelectValue placeholder="All Outcomes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Outcomes</SelectItem>
              <SelectItem value="SUCCESS">SUCCESS</SelectItem>
              <SelectItem value="BLOCKED">BLOCKED</SelectItem>
              <SelectItem value="WARNING">WARNING</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold">Actor / Email</TableHead>
                <TableHead className="text-xs font-semibold">Action Triggered</TableHead>
                <TableHead className="text-xs font-semibold">Target</TableHead>
                <TableHead className="text-xs font-semibold">Result</TableHead>
                <TableHead className="text-xs font-semibold">Client IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                    Loading audit trail from database...
                  </TableCell>
                </TableRow>
              ) : filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                    No platform audit log entries matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {log.timestamp ? new Date(log.timestamp).toLocaleString() : "Just now"}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{log.actor}</p>
                        <p className="text-[11px] text-muted-foreground font-mono">{log.actorEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono font-semibold bg-secondary/50">
                        {log.action}
                      </Badge>
                      {log.details && (
                        <p className="text-[11px] text-muted-foreground mt-0.5 max-w-xs truncate">{log.details}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs text-foreground">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="font-mono">{log.targetCompany || "Global Platform"}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-semibold ${
                          log.result === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : log.result === "WARNING"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {log.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {log.ip || log.ip_address || "127.0.0.1"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}