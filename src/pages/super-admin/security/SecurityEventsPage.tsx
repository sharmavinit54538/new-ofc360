import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Search,
  CheckCircle2,
  AlertTriangle,
  Ban,
  ShieldCheck,
  Lock,
  Globe,
  Radio
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

export default function SecurityEventsPage() {
  const { securityEvents, resolveSecurityEvent, blockIpAddress } = useSuperAdminStore();
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const handleResolve = (id: string) => {
    resolveSecurityEvent(id);
    toast.success("Security event flagged as resolved.");
  };

  const handleBlockIP = (ip: string) => {
    blockIpAddress(ip);
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Platform Security Incidents & Threat Events
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time intrusion detection, brute-force mitigation, unauthorized RBAC escalation alerts, and IP firewall rules.
          </p>
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
            <p className="text-xs font-medium text-muted-foreground">Threats Mitigated (24h)</p>
            <div className="text-2xl font-bold text-foreground">1,248</div>
            <p className="text-[11px] text-emerald-600 font-medium">Automatic WAF blocking</p>
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
            <p className="text-xs font-medium text-muted-foreground">Active High-Risk Events</p>
            <div className="text-2xl font-bold text-amber-600">
              {securityEvents.filter((e) => e.severity === "HIGH" && e.status !== "Resolved").length}
            </div>
            <p className="text-[11px] text-muted-foreground">Under investigation</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Global Firewall Status</p>
            <div className="text-lg font-bold text-emerald-600">Active Shielding</div>
            <p className="text-[11px] text-muted-foreground">Cloudflare & AWS WAF sync</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Lock className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search events, IPs, payload details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-secondary/40 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-9 text-xs w-[130px] bg-secondary/40">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Severities</SelectItem>
              <SelectItem value="CRITICAL">CRITICAL</SelectItem>
              <SelectItem value="HIGH">HIGH</SelectItem>
              <SelectItem value="MEDIUM">MEDIUM</SelectItem>
              <SelectItem value="LOW">LOW</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-9 text-xs w-[130px] bg-secondary/40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              <SelectItem value="Blocked">Blocked</SelectItem>
              <SelectItem value="Investigating">Investigating</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Events Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Timestamp</TableHead>
                <TableHead className="text-xs font-semibold">Threat Category</TableHead>
                <TableHead className="text-xs font-semibold">Severity</TableHead>
                <TableHead className="text-xs font-semibold">Source IP</TableHead>
                <TableHead className="text-xs font-semibold">Incident Details</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    No security events recorded matching criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((e) => (
                  <TableRow key={e.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="text-xs font-mono text-muted-foreground">
                      {e.timestamp}
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      {e.type.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] font-semibold ${
                          e.severity === "CRITICAL" || e.severity === "HIGH"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : e.severity === "MEDIUM"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : "bg-blue-500/10 text-blue-600 border-blue-500/20"
                        }`}
                      >
                        {e.severity}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-foreground font-medium">
                      {e.sourceIp}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-xs">
                      {e.details}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`text-[10px] ${
                          e.status === "Blocked"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : e.status === "Resolved"
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                        }`}
                      >
                        {e.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {e.status !== "Resolved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleResolve(e.id)}
                            className="h-7 text-xs text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                          >
                            Resolve
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleBlockIP(e.sourceIp)}
                          className="h-7 text-xs text-destructive hover:bg-destructive/10"
                        >
                          Block IP
                        </Button>
                      </div>
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
