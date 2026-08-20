import type { AIToolItem } from "@/types/ai";

export const aiModel_22: AIToolItem = {
  "id": "wf-anomaly",
  "title": "Attendance Anomaly Detection",
  "category": "Workforce & Shift AI",
  "description": "Flags irregular punch-in/out stamps, missed swipes, biometric mismatches, and chronic tardiness.",
  "badge": "Anomaly",
  "iconName": "AlertTriangle",
  "demoPrompt": "Run anomaly scanner on monthly attendance logs",
  "defaultOutput": "Detected 4 Anomalies: 2 Proxy punch attempts flagged | 2 Repeated late check-ins (>45m) flagged."
};
