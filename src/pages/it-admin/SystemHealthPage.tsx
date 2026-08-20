import { motion } from "framer-motion";
import { Server, Activity, Cpu, CheckCircle2, Zap, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SystemHealthPage() {
  const services = [
    { name: "Core API Gateway", status: "Healthy", latency: "24ms", uptime: "99.99%", load: "14%" },
    { name: "PostgreSQL Database Cluster", status: "Healthy", latency: "12ms", uptime: "99.98%", load: "22%" },
    { name: "Redis In-Memory Cache Cluster", status: "Healthy", latency: "2ms", uptime: "100%", load: "8%" },
    { name: "Authentication & JWT Token Verifier", status: "Healthy", latency: "18ms", uptime: "99.99%", load: "11%" },
    { name: "Background Async Worker Queue", status: "Healthy", latency: "45ms", uptime: "99.95%", load: "19%" },
    { name: "Integration Webhook Gateway", status: "Healthy", latency: "35ms", uptime: "99.90%", load: "15%" },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Server className="w-5 h-5 text-primary" />
          <span>System Infrastructure Health Telemetry</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Real-time service availability, response latency, error rate metrics, and microservices status.
        </p>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Overall System Status</span>
          <p className="text-xl font-extrabold text-emerald-500 font-mono">100% Operational</p>
          <span className="text-[11px] text-muted-foreground">All Microservices Healthy</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Service Uptime (30 Days)</span>
          <p className="text-xl font-extrabold text-primary font-mono">99.98%</p>
          <span className="text-[11px] text-muted-foreground">Zero Unplanned Downtime</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Average API Response</span>
          <p className="text-xl font-extrabold text-purple-500 font-mono">24 ms</p>
          <span className="text-[11px] text-muted-foreground">P99 Latency &lt; 50ms</span>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-1">
          <span className="text-xs text-muted-foreground font-semibold">Error Rate</span>
          <p className="text-xl font-extrabold text-teal-500 font-mono">0.01%</p>
          <span className="text-[11px] text-muted-foreground">Normal Operational Bounds</span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <h3 className="font-bold text-sm text-foreground">Microservice Cluster Telemetry</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {services.map((svc) => (
            <div key={svc.name} className="p-4 rounded-xl border border-border/60 bg-secondary/20 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>{svc.name}</span>
                </div>
                <p className="text-[11px] text-muted-foreground font-mono">
                  Latency: {svc.latency} · Uptime: {svc.uptime} · Pool Load: {svc.load}
                </p>
              </div>

              <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">
                {svc.status}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}