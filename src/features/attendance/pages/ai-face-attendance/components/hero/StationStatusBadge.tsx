import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export function StationStatusBadge({ isLoadingMe, isCheckedIn, isCheckedOut }: any) {
  if (isLoadingMe) return <Skeleton className="h-5 w-24 rounded-full" />;
  if (isCheckedIn) return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-semibold gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />Checked In (On Duty)</Badge>;
  if (isCheckedOut) return <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 font-semibold">Attendance Completed</Badge>;
  return <Badge variant="secondary" className="font-semibold text-muted-foreground">Not Checked In</Badge>;
}