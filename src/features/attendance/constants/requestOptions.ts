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
