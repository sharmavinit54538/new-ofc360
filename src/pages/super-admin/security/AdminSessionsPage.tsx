import {
  Monitor,
  Power,
  Clock,
  RefreshCw,
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
import {
  useGetSuperAdminSessionsQuery,
  useTerminateSuperAdminSessionMutation,
} from "@/services/api/superAdminApi";
import { toast } from "sonner";

export default function AdminSessionsPage() {
  const { data: sessions = [], isLoading, isFetching, refetch } = useGetSuperAdminSessionsQuery();
  const [terminateSession] = useTerminateSuperAdminSessionMutation();

  const handleTerminate = async (id: string) => {
    try {
      await terminateSession(id).unwrap();
      toast.success("Session terminated. User must re-authenticate on next request.");
    } catch (err: any) {
      toast.error(err?.data?.detail || "Failed to terminate session.");
    }
  };

  const handleTerminateOthers = async () => {
    try {
      for (const s of sessions) {
        if (!s.ipAddress.includes("Current") && s.id !== "sess_active_primary") {
          await terminateSession(s.id).unwrap();
        }
      }
      toast.success("All other administrator sessions have been revoked.");
    } catch (err: any) {
      toast.error("Failed to revoke sessions.");
    }
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
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-9 text-xs gap-1.5 border-border/60"
            disabled={isFetching}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </Button>
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
        <div className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Active Admin Sessions</p>
            <div className="text-2xl font-bold text-foreground">
              {sessions.filter((s) => s.status === "Active").length || sessions.length}
            </div>
            <p className="text-[11px] text-emerald-600 font-medium">All authenticated via MFA</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Monitor className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Session Security Standard</p>
            <div className="text-xl font-bold text-foreground">JWT RS256</div>
            <p className="text-[11px] text-muted-foreground">Cryptographically signed</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-muted border border-border/50 flex items-center justify-center text-muted-foreground">
            <Power className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-5 border border-border/60 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Session Inactivity Policy</p>
            <div className="text-xl font-bold text-foreground">60 Minutes</div>
            <p className="text-[11px] text-muted-foreground">Automated expiration active</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500">
            <Clock className="w-5 h-5" />
          </div>
        </div>
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
                <TableHead className="text-xs font-semibold">Status</TableHead>
                <TableHead className="text-xs font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-xs">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto text-primary mb-2" />
                    Loading active sessions from database...
                  </TableCell>
                </TableRow>
              ) : (
                sessions.map((s) => (
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
                      {s.loginTime ? new Date(s.loginTime).toLocaleTimeString() : "Active now"}
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
                      {s.status === "Active" && s.id !== "sess_active_primary" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleTerminate(s.id)}
                          className="h-7 text-xs text-destructive hover:bg-destructive/10"
                        >
                          Revoke
                        </Button>
                      ) : (
                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                          Current Session
                        </Badge>
                      )}
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