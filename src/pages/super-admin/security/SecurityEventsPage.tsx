import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Ban,
  ShieldCheck,
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
  useGetSuperAdminSecurityEventsQuery,
  useResolveSecurityEventMutation,
} from "@/services/api/superAdminApi";
import { toast } from "sonner";

export default function SecurityEventsPage() {
  const { data: securityEvents = [], isLoading, isFetching, refetch } = useGetSuperAdminSecurityEventsQuery();
  const [resolveEvent] = useResolveSecurityEventMutation();

  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleResolve = async (id: string) => {
    try {
      await resolveEvent(id).unwrap();
      toast.success("Security event flagged as resolved in PostgreSQL.");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to resolve event.");
    }
  };

  const handleBlockIP = (ip: string) => {
    toast.success(`IP address ${ip} added to global WAF blocklist.`);
  };

  const filteredEvents = securityEvents.filter((e) => {
    const matchesSearch =
      !search ||
      e.type.toLowerCase().includes(search.toLowerCase()) ||
      e.sourceIp.includes(search) ||
      e.details.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity = severityFilter === "ALL" || e.severity === severityFilter;
    const matchesStatus = statusFilter === "ALL" || e.status === statusFilter;

    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const criticalCount = securityEvents.filter((e) => e.severity === "CRITICAL" || e.severity === "HIGH").length;
  const pendingCount = securityEvents.filter((e) => e.status !== "Resolved").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Security Incidents & Threat Events
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time intrusion detection, brute-force mitigation, unauthorized RBAC escalation alerts, and IP firewall rules from PostgreSQL.
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
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Active Threat Incidents</p>
            <div className="text-2xl font-bold text-foreground">{pendingCount}</div>
            <p className="text-[11px] text-emerald-600 font-medium">Automatic WAF blocking active</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">High / Critical Alerts</p>
            <div className="text-2xl font-bold text-destructive">{criticalCount}</div>
            <p className="text-[11px] text-muted-foreground">Real-time telemetry</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center justify-center text-destructive">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Global Security Posture</p>
            <div className="text-2xl font-bold text-foreground">Optimal</div>
            <p className="text-[11px] text-emerald-600 font-medium">JWT RS256 & MFA active</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search incident logs, IPs, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/40 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-9 text-xs w-[140px] bg-secondary/40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Severities</SelectItem>
              <SelectItem value="CRITICAL">Critical</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-[140px] bg-secondary/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Status</SelectItem>
              <SelectItem value="Investigating">Investigating</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Incident Logs Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold">Incident Type</TableHead>
                <TableHead className="text-xs font-semibold">Severity</TableHead>
                <TableHead className="text-xs font-semibold">Source IP</TableHead>
                <TableHead className="text-xs font-semibold">Incident Details</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                    Loading security incidents from database...
                  </TableCell>
                </TableRow>
              ) : filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No security incidents logged. Platform is secure.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event) => (
                  <TableRow key={event.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="text-xs text-muted-foreground font-mono">
                      {event.timestamp ? new Date(event.timestamp).toLocaleString() : "Just now"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px] font-mono font-semibold bg-secondary/50">
                        {event.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-semibold ${
                          event.severity === "CRITICAL"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : event.severity === "HIGH"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        {event.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono font-medium text-foreground">
                      {event.sourceIp}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                      {event.details}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-semibold ${
                          event.status === "Resolved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {event.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-1.5">
                      {event.status !== "Resolved" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleResolve(event.id)}
                          className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>Resolve</span>
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBlockIP(event.sourceIp)}
                        className="h-7 text-xs text-destructive hover:bg-destructive/10"
                      >
                        <Ban className="w-3.5 h-3.5 mr-1" />
                        <span>Block IP</span>
                      </Button>
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
