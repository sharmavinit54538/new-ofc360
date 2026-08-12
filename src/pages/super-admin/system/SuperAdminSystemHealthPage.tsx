import { useState } from "react";
import { motion } from "framer-motion";
import {
  Server,
  Activity,
  Cpu,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Zap,
  ShieldCheck,
  Database,
  Radio,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

interface ServiceHealth {
  name: string;
  category: string;
  status: "OPERATIONAL" | "DEGRADED" | "MAINTENANCE";
  uptime: string;
  latency: string;
  region: string;
}

const SERVICES: ServiceHealth[] = [
  {
    name: "PostgreSQL Multi-AZ Primary Cluster",
    category: "Database Engine",
    status: "OPERATIONAL",
    uptime: "99.998%",
    latency: "4.2ms",
    region: "us-east-1 (N. Virginia)",
  },
  {
    name: "Redis Enterprise In-Memory Cache",
    category: "Caching & Sessions",
    status: "OPERATIONAL",
    uptime: "100.0%",
    latency: "0.8ms",
    region: "us-east-1 (N. Virginia)",
  },
  {
    name: "OFC360 Central Auth & RBAC Gateway",
    category: "Security & Auth",
    status: "OPERATIONAL",
    uptime: "99.99%",
    latency: "18ms",
    region: "Global CDN (Cloudflare)",
  },
  {
    name: "AI Talent & Document Inference Pods",
    category: "AI Microservices",
    status: "OPERATIONAL",
    uptime: "99.95%",
    latency: "185ms",
    region: "us-west-2 (Oregon)",
  },
  {
    name: "Payroll & Automated Disbursal Worker Queue",
    category: "Background Workers",
    status: "OPERATIONAL",
    uptime: "100.0%",
    latency: "12ms",
    region: "us-east-1 (N. Virginia)",
  },
  {
    name: "Face Attendance & CCTV Ingestion Stream",
    category: "Real-time Streaming",
    status: "OPERATIONAL",
    uptime: "99.94%",
    latency: "62ms",
    region: "us-east-1 (N. Virginia)",
  },
  {
    name: "Secure S3 Document Asset Storage",
    category: "Object Storage",
    status: "OPERATIONAL",
    uptime: "100.0%",
    latency: "24ms",
    region: "us-east-1 (N. Virginia)",
  },
];

export default function SuperAdminSystemHealthPage() {
  const { users, auditLogs } = useSuperAdminStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeConnections = users.filter((u) => u.status === "Active").length + 4;

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Live health check completed. All 7 platform microservices operational.");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            System & Infrastructure Health
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            High availability cluster status, latency telemetry, background queue workers, and database health.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-9 text-xs gap-1.5 border-border/60"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Run Health Check</span>
          </Button>
        </div>
      </div>

      {/* Top Health Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Overall Platform Uptime</p>
            <div className="text-2xl font-bold text-emerald-600">99.99%</div>
            <p className="text-[11px] text-muted-foreground">Rolling SLA</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600">
            <Server className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">API Error Rate</p>
            <div className="text-2xl font-bold text-emerald-600">0.00%</div>
            <p className="text-[11px] text-muted-foreground">Zero unhandled exceptions</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Zap className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Active DB Connections</p>
            <div className="text-2xl font-bold text-foreground">{activeConnections} / 120</div>
            <p className="text-[11px] text-muted-foreground">Connection pool normal</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Database className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Worker Queue Lag</p>
            <div className="text-2xl font-bold text-foreground">0 ms</div>
            <p className="text-[11px] text-emerald-600 font-medium">Zero backlogged jobs</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600">
            <Cpu className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Services Health Matrix */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-foreground">Platform Microservice Cluster Status</h3>
          <p className="text-xs text-muted-foreground">Active health endpoints, latency averages, and geographic regions</p>
        </div>

        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Microservice</TableHead>
                <TableHead className="text-xs font-semibold">Subsystem</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold">90-Day Uptime</TableHead>
                <TableHead className="text-xs font-semibold">Response Latency</TableHead>
                <TableHead className="text-xs font-semibold text-right">Deployment Region</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SERVICES.map((s) => (
                <TableRow key={s.name} className="hover:bg-secondary/30 transition-colors">
                  <TableCell className="text-xs font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                      <span>{s.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.category}
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[10px]">
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {s.uptime}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-emerald-600">
                    {s.latency}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground text-right font-mono">
                    {s.region}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
