import { useState } from "react";
import { motion } from "framer-motion";
import {
  Key,
  Monitor,
  Smartphone,
  Laptop,
  ShieldCheck,
  Power,
  Globe,
  Clock,
  AlertTriangle,
  Trash2
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

export default function AdminSessionsPage() {
  const { sessions, terminateSession, terminateAllOtherSessions } = useSuperAdminStore();

  const handleTerminate = (id: string) => {
    terminateSession(id);
    toast.success("Session terminated. User will be forced to authenticate again on next request.");
  };

  const handleTerminateOthers = () => {
    terminateAllOtherSessions("SES-901");
    toast.success("All other administrator sessions have been revoked.");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Active Administrator Sessions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time tracking of active Super Administrator and HR Administrator sessions, IP endpoints, and device fingerprints.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="destructive"
            size="sm"
            onClick={handleTerminateOthers}
            className="h-9 text-xs gap-1.5 shadow-sm"
          >
            <Power className="w-3.5 h-3.5" />
            <span>Revoke All Other Sessions</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Active Admin Sessions</p>
            <div className="text-2xl font-bold text-foreground">
              {sessions.filter((s) => s.status === "Active").length}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">All authenticated via MFA</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Monitor className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Terminated Sessions</p>
            <div className="text-2xl font-bold text-muted-foreground">
              {sessions.filter((s) => s.status === "Terminated").length}
            </div>
            <p className="text-[11px] text-muted-foreground">Past 24 hours</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground">
            <Power className="w-5 h-5" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between"
        >
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Session Inactivity Policy</p>
            <div className="text-xl font-bold text-foreground">60 Minutes</div>
            <p className="text-[11px] text-muted-foreground">Automated expiration active</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Clock className="w-5 h-5" />
          </div>
        </motion.div>
      </div>

      {/* Sessions Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 space-y-4">
        <div className="rounded-xl border border-border/50 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-semibold">Administrator</TableHead>
                <TableHead className="text-xs font-semibold">Device & Browser</TableHead>
                <TableHead className="text-xs font-semibold">IP Address</TableHead>
                <TableHead className="text-xs font-semibold">Location</TableHead>
                <TableHead className="text-xs font-semibold">Signed In</TableHead>
                <TableHead className="text-xs font-semibold">Last Active</TableHead>
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((s) => (
                <TableRow key={s.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-foreground">{s.adminName}</p>
                      <p className="text-[11px] text-muted-foreground">{s.adminEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-0.5">
                      <p className="text-xs text-foreground font-medium">{s.browser}</p>
                      <p className="text-[11px] text-muted-foreground">{s.os} · {s.device}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {s.ipAddress}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.location}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-muted-foreground">
                    {s.loginTime}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {s.lastActivity}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`text-[10px] ${
                        s.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {s.status === "Active" && !s.ipAddress.includes("Current") ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTerminate(s.id)}
                        className="h-7 text-xs text-destructive hover:bg-destructive/10"
                      >
                        Revoke
                      </Button>
                    ) : s.ipAddress.includes("Current") ? (
                      <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                        Current Session
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Terminated</span>
                    )}
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
