import { useState, useMemo } from "react";
import { FileCode2, Search, Download, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetSuperAdminAuditLogsQuery } from "@/services/api/superAdminApi";
import { toast } from "sonner";

export default function AuditLogsPage() {
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

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((l) => {
      const matchesResult = resultFilter === "ALL" || l.result === resultFilter;
      return matchesResult;
    });
  }, [auditLogs, resultFilter]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      toast.error("No audit logs available to export.");
      return;
    }

    const headers = "ID,Timestamp,Actor,Email,Action,Resource,Target,Result,IP Address\n";
    const rows = filteredLogs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.actor}","${l.actorEmail || ""}","${l.action}","${l.resource}","${l.targetCompany || "Global"}","${l.result}","${l.ip}"`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ofc360_audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Audit logs exported to CSV successfully.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            System & Security Audit Logs
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable activity and security event trail across system configurations, user actions, and permissions.
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
        </div>
      </div>

      {/* Filter and Search Bar */}
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

      {/* Audit Logs Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold">Actor / Email</TableHead>
                <TableHead className="text-xs font-semibold">Action Triggered</TableHead>
                <TableHead className="text-xs font-semibold">Resource</TableHead>
                <TableHead className="text-xs font-semibold">Outcome</TableHead>
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
                    No audit records found matching your filters.
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
                    <TableCell className="text-xs text-foreground font-mono">
                      {log.resource}
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