import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FileCode2, Search, Download, Filter } from "lucide-react";
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
import { useSuperAdminStore } from "@/stores/superAdminStore";
import { toast } from "sonner";

export default function AuditLogsPage() {
  const { auditLogs } = useSuperAdminStore();
  const [search, setSearch] = useState("");
  const [resultFilter, setResultFilter] = useState("ALL");

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((l) => {
      const matchesSearch =
        !search ||
        l.action.toLowerCase().includes(search.toLowerCase()) ||
        l.actor.toLowerCase().includes(search.toLowerCase()) ||
        (l.actorEmail && l.actorEmail.toLowerCase().includes(search.toLowerCase())) ||
        l.resource.toLowerCase().includes(search.toLowerCase()) ||
        (l.targetCompany && l.targetCompany.toLowerCase().includes(search.toLowerCase())) ||
        (l.ip && l.ip.includes(search));

      const matchesResult = resultFilter === "ALL" || l.result === resultFilter;

      return matchesSearch && matchesResult;
    });
  }, [auditLogs, search, resultFilter]);

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
    link.setAttribute("download", `ofc360_it_audit_logs_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("IT Audit logs exported successfully.");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-primary" />
            <span>Immutable System Audit Trail</span>
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Audit logging for administrative actions, authentication events, permission changes, and security events.
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
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search action, actor, resource, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs bg-secondary/30 h-9"
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

      {/* Audit Log Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground">Audit Log Stream</h3>
          <span className="text-xs text-muted-foreground">{filteredLogs.length} total records</span>
        </div>

        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-bold">Timestamp</TableHead>
                <TableHead className="text-xs font-bold">Actor</TableHead>
                <TableHead className="text-xs font-bold">Action Event</TableHead>
                <TableHead className="text-xs font-bold">Target Resource</TableHead>
                <TableHead className="text-xs font-bold">Result</TableHead>
                <TableHead className="text-xs font-bold text-right">IP Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-10 text-muted-foreground text-xs">
                    No audit logs found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="text-xs font-mono text-muted-foreground">{log.timestamp}</TableCell>
                    <TableCell className="font-bold text-xs text-foreground">
                      <div className="space-y-0.5">
                        <p>{log.actor}</p>
                        {log.actorEmail && <p className="text-[10px] text-muted-foreground font-normal">{log.actorEmail}</p>}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-primary font-semibold">{log.action}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{log.resource}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          log.result === "SUCCESS"
                            ? "bg-emerald-500/15 text-emerald-500 border-emerald-500/20 text-[10px]"
                            : log.result === "WARNING"
                            ? "bg-amber-500/15 text-amber-500 border-amber-500/20 text-[10px]"
                            : "bg-destructive/15 text-destructive border-destructive/20 text-[10px]"
                        }
                      >
                        {log.result}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground text-right">{log.ip}</TableCell>
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
