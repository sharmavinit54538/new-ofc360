import type { PeopleAuditEntry } from "./peopleAiTypes";
import type { SystemRole } from "@/features/auth/authTypes";

export class PeopleAuditService {
  private static auditLogs: PeopleAuditEntry[] = [];


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
