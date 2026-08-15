import { motion } from "framer-motion";
import { Camera, ScanFace, AlertTriangle, ShieldCheck, Activity, Users } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const cameras = [
  { id: "CAM-01", loc: "Main Entrance", status: "live", detected: "Sarah Chen", confidence: 98 },
  { id: "CAM-02", loc: "Reception", status: "live", detected: "Marcus Lee", confidence: 95 },
  { id: "CAM-03", loc: "3rd Floor Lobby", status: "live", detected: "Unknown", confidence: 42 },
  { id: "CAM-04", loc: "Server Room", status: "idle", detected: "—", confidence: 0 },
  { id: "CAM-05", loc: "Cafeteria", status: "live", detected: "Priya Nair", confidence: 99 },
  { id: "CAM-06", loc: "Parking Bay B", status: "live", detected: "Unknown", confidence: 38 },
];

const timeline = [
  { time: "09:42", text: "Sarah Chen checked in via CAM-01", level: "ok" },
  { time: "09:38", text: "Unknown person flagged at CAM-03", level: "warn" },
  { time: "09:32", text: "Marcus Lee checked in via CAM-02", level: "ok" },
  { time: "09:21", text: "Tailgating detected at CAM-01", level: "warn" },
  { time: "09:10", text: "System integrity check passed", level: "ok" },
];

export default function AICCTVPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-3">
        <div>
          <h1 className="page-header">AI CCTV Attendance</h1>
          <p className="page-subheader">Real-time face recognition & security monitoring</p>
        </div>
        <Badge className="bg-success/15 text-success border-success/20 gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" /> 5 live feeds</Badge>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Faces Recognized" value="312" change="+18 today" changeType="up" icon={ScanFace} />
        <StatCard title="Active Cameras" value="5/6" change="1 idle" changeType="neutral" icon={Camera} />
        <StatCard title="Unknown Alerts" value="4" change="2 unresolved" changeType="down" icon={AlertTriangle} />
        <StatCard title="Coverage" value="94%" change="High" changeType="up" icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cameras.map((c) => (
            <motion.div key={c.id} whileHover={{ y: -2 }} className="glass-card rounded-xl overflow-hidden">
              <div className="relative aspect-video bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[linear-gradient(transparent_50%,rgba(0,255,200,0.05)_50%)] bg-[length:100%_4px]" />
                <div className="absolute inset-6 border border-primary/40 rounded-md">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary" />
                  <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary" />
                </div>
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === "live" ? "bg-destructive animate-pulse" : "bg-muted-foreground"}`} />
                  <span className="text-[10px] font-mono text-white/80">{c.id}</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-end justify-between text-white/90">
                  <span className="text-xs font-medium">{c.detected}</span>
                  {c.confidence > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${c.confidence > 80 ? "bg-success/30" : "bg-destructive/30"}`}>
                      {c.confidence}%
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <span className="text-sm font-medium">{c.loc}</span>
                <Button size="sm" variant="ghost" className="h-7 text-xs">View</Button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-primary" />
            <h3 className="font-semibold">Security Timeline</h3>
          </div>
          <div className="space-y-3">
            {timeline.map((t, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground pt-0.5">{t.time}</span>
                <span className={`w-1.5 h-1.5 rounded-full mt-1.5 ${t.level === "warn" ? "bg-warning" : "bg-success"}`} />
                <span className="flex-1">{t.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-primary" />
              <h4 className="font-semibold text-sm">Heatmap (today)</h4>
            </div>
            <div className="grid grid-cols-12 gap-1">
              {Array.from({ length: 84 }).map((_, i) => {
                const intensity = Math.random();
                return <div key={i} className="aspect-square rounded-xs" style={{ background: `rgba(99, 102, 241, ${0.15 + intensity * 0.75})` }} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}