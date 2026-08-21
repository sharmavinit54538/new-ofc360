import { motion } from "framer-motion";
import { RefreshCw, LogIn, Loader2, Clock } from "lucide-react";
import { toast } from "sonner";
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
import { AttendanceStats } from "../AttendanceStats";
import type { AttendanceKPIStats, PunchRecord, AttendanceTabType } from "../../types/attendance.types";

interface OverviewTabProps {
  stats: AttendanceKPIStats;
  isAnalyticsLoading: boolean;
  isLeavesLoading: boolean;
  isLiveStreamLoading: boolean;
  liveAttendanceList: PunchRecord[];
  onRefresh: () => void;
  onNavigateTab: (tab: AttendanceTabType) => void;
}

export function OverviewTab({
  stats,
  isAnalyticsLoading,
  isLeavesLoading,
  isLiveStreamLoading,
  liveAttendanceList,
  onRefresh,
  onNavigateTab,
}: OverviewTabProps) {
  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* KPI Cards */}
      <AttendanceStats
        variant="overview"
        stats={stats}
        isAnalyticsLoading={isAnalyticsLoading}
        isLeavesLoading={isLeavesLoading}
      />

      {/* Live Punch Table */}
      <div className="glass-card rounded-2xl p-5 border border-border/60 bg-card shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/40 pb-3">
          <div>
            <h3 className="font-bold text-sm text-foreground">
              Live Daily Attendance & Punch Stream
            </h3>
            <p className="text-xs text-muted-foreground">
              Real-time check-ins recorded via biometric stations, GPS and web kiosks.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                onRefresh();
                toast.success("Refreshed live attendance stream");
              }}
              className="h-8 text-xs font-medium border-border/60 gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </Button>
            <Button
              size="sm"
              onClick={() => onNavigateTab("checkin")}
              className="gradient-bg text-primary-foreground font-bold text-xs h-8"
            >
              <LogIn className="w-3.5 h-3.5 mr-1" /> Punch Station
            </Button>
          </div>
        </div>

        {isLiveStreamLoading ? (
          <div className="py-12 text-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="text-xs text-muted-foreground">Loading real-time attendance stream...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="text-xs font-bold">Employee</TableHead>
                <TableHead className="text-xs font-bold">Department</TableHead>
                <TableHead className="text-xs font-bold">Punch Time</TableHead>
                <TableHead className="text-xs font-bold">Action Type</TableHead>
                <TableHead className="text-xs font-bold">Verification Method</TableHead>
                <TableHead className="text-xs font-bold">Location</TableHead>
                <TableHead className="text-right text-xs font-bold">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {liveAttendanceList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground text-xs">
                    <Clock className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="font-bold text-sm text-foreground">No punches recorded today</p>
                    <p className="text-[11px] text-muted-foreground">
                      Go to the "Check In / Out Station" tab to test real-time punches.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                liveAttendanceList.map((p) => (
                  <TableRow key={p.id} className="hover:bg-secondary/30 transition-colors">
                    <TableCell className="font-bold text-xs text-foreground">
                      {p.employeeName}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.department}</TableCell>
                    <TableCell className="text-xs font-mono font-semibold">{p.timestamp}</TableCell>
                    <TableCell>
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-bold">
                        {p.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.method}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{p.location}</TableCell>
                    <TableCell className="text-right">
                      <Badge className="bg-emerald-500/15 text-emerald-500 border-emerald-500/30 text-[10px] font-bold">
                        {p.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </motion.div>
  );
}
