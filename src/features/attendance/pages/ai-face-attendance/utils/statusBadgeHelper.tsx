import { Badge } from "@/components/ui/badge";

export function getStatusBadge(status?: string) {
  const s = (status || "Present").toLowerCase();
  if (s.includes("checked in") || s.includes("present")) {
    return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20">Present</Badge>;
  }
  if (s.includes("checked out")) {
    return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20">Checked Out</Badge>;
  }
  if (s.includes("late")) {
    return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20">Late</Badge>;
  }
  if (s.includes("half")) {
    return <Badge className="bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20">Half Day</Badge>;
  }
  if (s.includes("absent")) return <Badge variant="destructive">Absent</Badge>;
  return <Badge variant="outline">{status || "Recorded"}</Badge>;
}
