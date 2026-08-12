import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, User, Lock, Key, Power, Search, ShieldAlert, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuthStore, SystemRole, roleLabels } from "@/stores/authStore";
import { toast } from "sonner";

interface ActiveSession {
  id: string;
  user: string;
  role: SystemRole;
  ip: string;
  device: string;
  loginTime: string;
}

export default function AccessPage() {
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");

  // Initialize active session dynamically from authenticated user state
  const [sessions, setSessions] = useState<ActiveSession[]>(() => {
    if (!user) return [];

    const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
    let deviceName = "Browser Session";
    if (ua.includes("Windows")) deviceName = "Windows Workstation";
    else if (ua.includes("Mac")) deviceName = "macOS Workstation";
    else if (ua.includes("Linux")) deviceName = "Linux Workstation";
    else if (ua.includes("Android")) deviceName = "Android Device";
    else if (ua.includes("iPhone") || ua.includes("iPad")) deviceName = "iOS Device";

    const hostIp = typeof window !== "undefined" ? window.location.hostname : "127.0.0.1";

    return [
      {
        id: `sess_${user.id || "active"}`,
        user: `${user.name} (${user.email})`,
        role: user.role || "it_admin",
        ip: hostIp === "localhost" ? "127.0.0.1" : hostIp,
        device: deviceName,
        loginTime: "Active Session",
      },
    ];
  });

  const filteredSessions = useMemo(() => {
    if (!search.trim()) return sessions;
    const q = search.toLowerCase();
    return sessions.filter(
      (s) =>
        s.user.toLowerCase().includes(q) ||
        (roleLabels[s.role] && roleLabels[s.role].toLowerCase().includes(q)) ||
        s.ip.toLowerCase().includes(q) ||
        s.device.toLowerCase().includes(q)
    );
  }, [sessions, search]);

  const handleTerminateSession = (id: string, name: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
    toast.success(`Terminated active session for ${name}`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="pb-2 border-b border-border/40">
        <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-primary" />
          <span>Identity Access Management & Active Sessions</span>
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Centralized Role-Based Access Control (RBAC) governance, session revocation, and account security.
        </p>
      </div>

      {/* Active Sessions Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-foreground">Active User Sessions & RBAC Privileges</h3>
            <Badge variant="outline" className="text-xs font-mono border-primary/20 text-primary">
              {sessions.length} Active Sessions
            </Badge>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search user, role, IP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 text-xs bg-muted/40 border-border/60"
            />
          </div>
        </div>

        <div className="rounded-xl border border-border/60 overflow-hidden">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-bold">Authenticated User</TableHead>
                <TableHead className="text-xs font-bold">Assigned Role</TableHead>
                <TableHead className="text-xs font-bold">IP Address</TableHead>
                <TableHead className="text-xs font-bold">Client Device</TableHead>
                <TableHead className="text-xs font-bold">Login Timestamp</TableHead>
                <TableHead className="text-right text-xs font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.length > 0 ? (
                filteredSessions.map((sess) => (
                  <TableRow key={sess.id}>
                    <TableCell className="font-bold text-xs text-foreground">{sess.user}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary text-[10px] font-semibold border-primary/20">
                        {roleLabels[sess.role] || sess.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-muted-foreground">{sess.ip}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{sess.device}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{sess.loginTime}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleTerminateSession(sess.id, sess.user)}
                        className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive/10 gap-1 font-semibold"
                      >
                        <Power className="w-3.5 h-3.5" /> Terminate Session
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center space-y-1 text-muted-foreground">
                      <ShieldAlert className="w-8 h-8 opacity-40 text-muted-foreground mb-1" />
                      <p className="text-sm font-semibold text-foreground">No Active Sessions Found</p>
                      <p className="text-xs">
                        {search ? "No sessions match your search criteria." : "There are currently no active user sessions."}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

