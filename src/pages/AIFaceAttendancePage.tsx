import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanFace,
  Camera,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Activity,
  Users,
  Video,
  Clock,
  MapPin,
  Sparkles,
  RefreshCw,
  Eye,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface RecognitionLog {
  id: string;
  employeeName: string;
  department: string;
  time: string;
  location: string;
  confidence: number;
  type: "Check-In" | "Check-Out";
  status: "Verified" | "Liveness Passed";
}

const initialFeeds = [
  { id: "CAM-01", name: "Main HQ Entrance", status: "LIVE", detected: "Alex Mercer", confidence: 99.2, liveness: true },
  { id: "CAM-02", name: "Floor 3 Tech Wing", status: "LIVE", detected: "Sophia Lin", confidence: 98.6, liveness: true },
  { id: "CAM-03", name: "Executive Suite", status: "LIVE", detected: "Elena Rostova", confidence: 97.8, liveness: true },
  { id: "CAM-04", name: "Cafeteria Entrance", status: "LIVE", detected: "Marcus Vance", confidence: 99.0, liveness: true },
];

export default function AIFaceAttendancePage() {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCam, setSelectedCam] = useState("CAM-01");
  const [logs, setLogs] = useState<RecognitionLog[]>([
    {
      id: "LOG-101",
      employeeName: "Alex Mercer",
      department: "Human Resources",
      time: new Date(Date.now() - 1000 * 60 * 4).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      location: "Main HQ Entrance (CAM-01)",
      confidence: 99.4,
      type: "Check-In",
      status: "Verified",
    },
    {
      id: "LOG-102",
      employeeName: "Sophia Lin",
      department: "Product & Engineering",
      time: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      location: "Floor 3 Tech Wing (CAM-02)",
      confidence: 98.9,
      type: "Check-In",
      status: "Verified",
    },
  ]);

  const handleSimulateScan = () => {
    setIsScanning(true);
    toast.info("Scanning face through biometric camera...", { duration: 1500 });

    setTimeout(() => {
      setIsScanning(false);
      const newLog: RecognitionLog = {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        employeeName: "Alex Mercer (HR / Admin)",
        department: "Human Resources",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        location: "Main HQ Entrance (CAM-01)",
        confidence: 99.6,
        type: "Check-In",
        status: "Liveness Passed",
      };

      setLogs((prev) => [newLog, ...prev]);
      toast.success("✅ Face Recognized! Biometric Check-In Recorded for Alex Mercer (99.6% Match)");
    }, 1800);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
              <ScanFace className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">AI Face Attendance & Biometric Vision</h1>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time contactless facial recognition attendance, 3D liveness detection & multi-camera telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-xs font-semibold gap-1.5 px-3 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 4 Live Biometric Feeds Active
          </Badge>
          <Button
            onClick={handleSimulateScan}
            disabled={isScanning}
            className="gradient-bg text-primary-foreground font-bold text-xs h-10 px-4 rounded-xl shadow-md gap-2"
          >
            <ScanFace className={`w-4 h-4 ${isScanning ? "animate-spin" : ""}`} />
            <span>{isScanning ? "Analyzing Face..." : "Scan My Face Now"}</span>
          </Button>
        </div>
      </div>

      {/* Main Scanner Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Camera Viewport */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-border/60 bg-card overflow-hidden shadow-sm flex flex-col">
          <div className="p-4 border-b border-border/40 bg-secondary/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-foreground">Optical Face Scanner Viewport</span>
            </div>
            <div className="flex items-center gap-2">
              {initialFeeds.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelectedCam(f.id)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    selectedCam === f.id
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {f.id}
                </button>
              ))}
            </div>
          </div>

          <div className="relative aspect-video sm:aspect-[16/9] bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center overflow-hidden">
            {/* Scanlines Effect */}
            <div className="absolute inset-0 opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,255,200,0.1)_50%)] bg-[length:100%_4px] pointer-events-none" />

            {/* AI Facial Recognition Reticle */}
            <div className="relative w-48 h-56 border-2 border-dashed border-teal-400/60 rounded-3xl flex items-center justify-center shadow-[0_0_30px_rgba(20,184,166,0.15)]">
              {/* Corner Brackets */}
              <div className="absolute -top-2 -left-2 w-5 h-5 border-t-3 border-l-3 border-teal-400" />
              <div className="absolute -top-2 -right-2 w-5 h-5 border-t-3 border-r-3 border-teal-400" />
              <div className="absolute -bottom-2 -left-2 w-5 h-5 border-b-3 border-l-3 border-teal-400" />
              <div className="absolute -bottom-2 -right-2 w-5 h-5 border-b-3 border-r-3 border-teal-400" />

              {/* Scanning Laser Animation */}
              <motion.div
                animate={{ top: ["10%", "85%", "10%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf]"
              />

              <div className="text-center space-y-1">
                <ScanFace className="w-12 h-12 text-teal-400/80 mx-auto animate-pulse" />
                <p className="text-[11px] font-mono text-teal-300 font-semibold tracking-wider">
                  {isScanning ? "PROCESSING 3D MESH..." : "LIVENESS ACTIVE"}
                </p>
                <p className="text-[10px] text-white/50 font-mono">1080p @ 60 FPS</p>
              </div>
            </div>

            {/* HUD Telemetry Overlay */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-white text-xs">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="font-mono font-bold">{selectedCam} — LIVE STREAM</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 text-white text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Anti-Spoofing: <strong className="text-emerald-400">PASSED</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-white/70" />
                <span className="font-mono">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Recognition Telemetry Panel */}
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>Real-Time Biometric Metrics</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Recognition Accuracy</span>
                  <span className="text-base font-extrabold text-foreground font-mono">99.8%</span>
                </div>
                <Badge className="bg-emerald-500/15 text-emerald-500 text-[10px] font-bold">Ultra High</Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-muted-foreground block">Average Match Latency</span>
                  <span className="text-base font-extrabold text-foreground font-mono">140 ms</span>
                </div>
                <Badge className="bg-primary/10 text-primary text-[10px] font-bold">Instant</Badge>
              </div>

              <div className="p-3.5 rounded-xl bg-secondary/30 border border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-muted-foreground block">3D Liveness Detection</span>
                  <span className="text-base font-extrabold text-emerald-500 font-mono">ACTIVE</span>
                </div>
                <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30">Secure</Badge>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-foreground">Camera Feeds Status</h4>
            <div className="space-y-2">
              {initialFeeds.map((f) => (
                <div key={f.id} className="flex items-center justify-between text-xs p-2 rounded-lg bg-secondary/20 border border-border/30">
                  <div className="flex items-center gap-2">
                    <Video className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{f.name}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono text-emerald-500 border-emerald-500/30">
                    {f.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Recognition Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <h3 className="font-bold text-base text-foreground">Live Face Recognition Attendance Stream</h3>
            <p className="text-xs text-muted-foreground">Automated punch logs recorded directly from optical sensors.</p>
          </div>
          <Badge variant="outline" className="text-xs font-mono font-bold bg-primary/10 text-primary border-primary/20">
            {logs.length} Recognized Punches
          </Badge>
        </div>

        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-bold text-foreground">Employee</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Department</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Time</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Camera Sensor Location</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Confidence Match</TableHead>
              <TableHead className="text-xs font-bold text-foreground">Action Type</TableHead>
              <TableHead className="text-right font-bold text-foreground">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id} className="hover:bg-secondary/30 transition-colors">
                <TableCell className="font-bold text-xs text-foreground flex items-center gap-2">
                  <Avatar className="h-8 w-8 border border-primary/20">
                    <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
                      {log.employeeName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <span>{log.employeeName}</span>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{log.department}</TableCell>
                <TableCell className="text-xs font-mono font-semibold">{log.time}</TableCell>
                <TableCell className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> {log.location}
                </TableCell>
                <TableCell className="text-xs font-mono text-emerald-500 font-bold">
                  {log.confidence}%
                </TableCell>
                <TableCell>
                  <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                    {log.type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {log.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
