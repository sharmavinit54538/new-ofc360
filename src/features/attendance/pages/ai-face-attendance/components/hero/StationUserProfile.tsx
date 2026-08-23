import { Check, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StationStatusBadge } from "./StationStatusBadge";

export function StationUserProfile({ user, currentRole, myAttendance, isLoadingMe, isCheckedIn, isCheckedOut }: any) {
  return (
    <div className="flex items-start sm:items-center gap-4">
      <div className="relative">
        <Avatar className="w-16 h-16 border-2 border-primary/30 shadow-md"><AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">{user?.name?.slice(0, 2).toUpperCase() || "ME"}</AvatarFallback></Avatar>
        <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center ${isCheckedIn ? "bg-emerald-500 text-white" : isCheckedOut ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground"}`}>{isCheckedIn ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}</div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2"><h2 className="text-lg font-bold text-foreground">{user?.name || "Employee"}</h2><Badge variant="outline" className="text-[10px] capitalize">{currentRole.replace("_", " ")}</Badge></div>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /><span>{myAttendance?.location || "Headquarters • Biometric Station"}</span></p>
        <div className="flex items-center gap-2 pt-0.5"><span className="text-xs text-muted-foreground">Today's Status:</span><StationStatusBadge isLoadingMe={isLoadingMe} isCheckedIn={isCheckedIn} isCheckedOut={isCheckedOut} /></div>
      </div>
    </div>
  );
}