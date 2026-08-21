import {
  Clock, LogIn, Sun, CalendarDays, CalendarOff,
  CheckCircle, Timer, Calendar, Award, BarChart3,
} from "lucide-react";
import type { NavModule } from "../types/navModule";

export const NAV_MODULES: NavModule[] = [
  { id: "overview", label: "Live Overview", icon: Clock },
  { id: "checkin", label: "Check In / Out Station", icon: LogIn },
  { id: "shifts", label: "Shifts Management", icon: Sun },
  { id: "rosters", label: "Rosters & Scheduling", icon: CalendarDays },
  { id: "holidays", label: "Holidays Calendar", icon: CalendarOff },
  { id: "regularization", label: "Regularization", icon: CheckCircle },
  { id: "timesheets", label: "Timesheets", icon: Timer },
  { id: "leaves", label: "Leaves & Time-Off", icon: Calendar },
  { id: "overtime", label: "Overtime (OT)", icon: Award },
  { id: "analytics", label: "Attendance Analytics", icon: BarChart3 },
];
