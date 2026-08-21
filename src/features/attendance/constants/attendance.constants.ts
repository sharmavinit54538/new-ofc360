import {
  Clock,
  LogIn,
  Sun,
  CalendarDays,
  CalendarOff,
  CheckCircle,
  Timer,
  Calendar,
  Award,
  BarChart3,
} from "lucide-react";
import type { NavModule } from "../types/attendance.types";

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

export const DEPARTMENT_OPTIONS = [
  "Engineering",
  "Sales",
  "Support",
  "Operations",
  "Human Resources",
  "Marketing",
  "Finance",
] as const;

export const SHIFT_OPTIONS = [
  "General Shift [9AM - 6PM]",
  "Morning Shift [6AM - 3PM]",
  "Night Shift [9PM - 6AM]",
] as const;

export const DAY_OF_WEEK_OPTIONS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export const HOLIDAY_TYPES = [
  "National",
  "Public",
  "Optional Floating",
  "Regional",
] as const;

export const BRANCH_OPTIONS = [
  "Headquarters (HQ)",
  "Bengaluru",
  "Mumbai",
  "Delhi NCR",
] as const;

export const REGULARIZATION_PUNCH_TYPES = [
  { label: "Check-In Swipe", value: "Check-In" },
  { label: "Check-Out Swipe", value: "Check-Out" },
  { label: "Both (Full Day On-Duty)", value: "Both" },
] as const;

export const LEAVE_TYPE_OPTIONS = [
  "Casual Leave (CL)",
  "Sick Leave (SL)",
  "Earned / Privilege Leave (EL)",
  "Compensatory Off (Comp-Off)",
] as const;

export const OVERTIME_MULTIPLIER_OPTIONS = [
  { label: "1.5x (Weekday OT)", value: "1.5x (Weekday)" },
  { label: "2.0x (Weekend/Holiday)", value: "2.0x (Weekend/Holiday)" },
] as const;
