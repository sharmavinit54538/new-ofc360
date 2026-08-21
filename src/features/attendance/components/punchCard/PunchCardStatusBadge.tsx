import { Badge } from "@/components/ui/badge";

export function PunchCardStatusBadge({ isCheckedIn, isCheckedOut }: { isCheckedIn: boolean; isCheckedOut: boolean }) {
  if (isCheckedOut) {
    return <Badge variant="secondary" className="text-xs bg-muted text-muted-foreground">Checked Out for Today</Badge>;
  }
  if (isCheckedIn) {
    return <Badge className="text-xs bg-emerald-600 text-white">Currently Checked In</Badge>;
  }
  return <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Not Checked In</Badge>;
}
