import type { PeopleAuditEntry } from "./peopleAiTypes";
import type { SystemRole } from "@/features/auth/authTypes";

export class PeopleAuditService {
  private static auditLogs: PeopleAuditEntry[] = [
    {
      id: "aud-init-1",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      actorId: "system_ai",
      actorName: "OFC360 People AI Engine",
      actorRole: "super_admin",
      action: "TELEMETRY_INDEXED",
      details: "Synchronized workforce attendance, goal completion, and department staffing telemetry.",
      aiGenerated: true,
      status: "SUCCESS",
      confidence: "HIGH",
    },
    {
      id: "aud-init-2",
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      actorId: "system_ai",
      actorName: "PeopleDetectionEngine",
      actorRole: "super_admin",
      action: "DATA_QUALITY_AUDIT_PASSED",
      details: "Evaluated 100% of employee profiles for field consistency and reporting hierarchy validity.",
      aiGenerated: true,
      status: "SUCCESS",
      confidence: "HIGH",
    },
  ];

  static logAction(entry: Omit<PeopleAuditEntry, "id" | "timestamp">): PeopleAuditEntry {
    const fullEntry: PeopleAuditEntry = {
      ...entry,
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
    };
    this.auditLogs.unshift(fullEntry);
    return fullEntry;
  }

  static getAuditLogs(filter?: {
    actorRole?: SystemRole;
    action?: string;
    targetId?: string;
  }): PeopleAuditEntry[] {
    let logs = [...this.auditLogs];
    if (filter?.actorRole) {
      logs = logs.filter((l) => l.actorRole === filter.actorRole);
    }
    if (filter?.action) {
      logs = logs.filter((l) => l.action.toLowerCase().includes(filter.action!.toLowerCase()));
    }
    if (filter?.targetId) {
      logs = logs.filter((l) => l.targetId === filter.targetId);
    }
    return logs;
  }
}
