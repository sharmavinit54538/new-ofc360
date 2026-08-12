import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileCode2,
  Search,
  Download,
  Filter,
  ShieldCheck,
  Building2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Lock
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
import { useSuperAdminStore } from "@/stores/superAdminStore";
import { toast } from "sonner";

export default function SuperAdminAuditLogsPage() {
  const { auditLogs, clearAuditLogs } = useSuperAdminStore();
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");

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

  const handleClearLogs = () => {
    if (confirm("Are you sure you want to clear the platform audit logs?")) {
      clearAuditLogs();
      toast.success("Audit logs archive cleared.");
    }
  };

  const filteredLogs = auditLogs.filter((l) => {
    const matchesSearch =
      !search ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      l.actor.toLowerCase().includes(search.toLowerCase()) ||
      l.actorEmail.toLowerCase().includes(search.toLowerCase()) ||
      l.resource.toLowerCase().includes(search.toLowerCase()) ||
      (l.targetCompany && l.targetCompany.toLowerCase().includes(search.toLowerCase()));

    const matchesResult = resultFilter === "ALL" || l.result === resultFilter;

    return matchesSearch && matchesResult;
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
            Cross-tenant system audit trail tracking administrative actions, RBAC assignments, security policy adjustments, and tenant events.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="h-9 text-xs gap-1.5 border-border/60"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearLogs}
            className="h-9 text-xs text-destructive hover:bg-destructive/10 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Archive</span>
          </Button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search action, actor, resource, tenant..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/40 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={resultFilter} onValueChange={setResultFilter}>
            <SelectTrigger className="h-9 text-xs w-[140px] bg-secondary/40">
              <SelectValue placeholder="Result" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Results</SelectItem>
              <SelectItem value="SUCCESS">SUCCESS</SelectItem>
              <SelectItem value="BLOCKED">BLOCKED</SelectItem>
              <SelectItem value="WARNING">WARNING</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold">Actor</TableHead>
                <TableHead className="text-xs font-semibold">Event Action</TableHead>
                <TableHead className="text-xs font-semibold">Resource Affected</TableHead>
                <TableHead className="text-xs font-semibold">Target Workspace</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Source IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No audit records match the current filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((l) => (
                  <TableRow key={l.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {l.timestamp}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-foreground">{l.actor}</p>
                        <p className="text-[11px] text-muted-foreground">{l.actorEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-semibold text-foreground">
                      {l.action}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {l.resource}
                    </TableCell>
                    <TableCell className="text-xs font-medium text-foreground">
                      {l.targetCompany || "Global Platform"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          l.result === "SUCCESS"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : l.result === "BLOCKED"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {l.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono text-right">
                      {l.ip}
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
