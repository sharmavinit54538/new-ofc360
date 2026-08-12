/**
 * OFC360 Real-Time Employee Timeline Engine
 * Calculates work anniversaries, aggregates career milestones, recognition awards,
 * project achievements, skill growth logs, and system audit logs.
 */

export type TimelineCategory =
  | "Career"
  | "Recognition"
  | "Anniversaries"
  | "Projects"
  | "Skills"
  | "Audit";

export interface TimelineEvent {
  id: string;
  employeeId: string;
  employeeName: string;
  category: TimelineCategory;
  title: string;
  date: string; // YYYY-MM-DD or ISO
  badge?: string;
  description: string;
  details?: {
    previousRole?: string;
    newRole?: string;
    previousDepartment?: string;
    newDepartment?: string;
    previousSalary?: string;
    newSalary?: string;
    givenBy?: string;
    awardType?: string;
    yearsCompleted?: number;
    skillName?: string;
    previousLevel?: string;
    newLevel?: string;
    source?: string;
    projectName?: string;
    impact?: string;
    actor?: string;
  };
}

/**
 * Dynamically calculates employee work anniversaries from joining date
 */
export function calculateWorkAnniversaries(
  employeeId: string,
  employeeName: string,
  joiningDateStr: string
): TimelineEvent[] {
  if (!joiningDateStr) return [];

  const joiningDate = new Date(joiningDateStr);
  if (isNaN(joiningDate.getTime())) return [];

  const now = new Date();
  if (joiningDate > now) return [];

  const events: TimelineEvent[] = [];

  // Initial Joining Event
  events.push({
    id: `ANNIV-JOIN-${employeeId}`,
    employeeId,
    employeeName,
    category: "Anniversaries",
    title: "Joined Company",
    date: joiningDate.toISOString().split("T")[0],
    badge: "Day 1",
    description: `${employeeName} officially joined OFC360 enterprise workforce.`,
    details: { yearsCompleted: 0 }
  });

  const milestoneYears = [1, 2, 3, 5, 10];
  milestoneYears.forEach((years) => {
    const annivDate = new Date(joiningDate);
    annivDate.setFullYear(joiningDate.getFullYear() + years);

    if (annivDate <= now) {
      events.push({
        id: `ANNIV-${years}YR-${employeeId}`,
        employeeId,
        employeeName,
        category: "Anniversaries",
        title: `${years} Year Work Anniversary`,
        date: annivDate.toISOString().split("T")[0],
        badge: `${years} Yrs Service`,
        description: `Celebrated ${years} year(s) of dedicated service, contributions, and loyalty at OFC360.`,
        details: { yearsCompleted: years }
      });
    }
  });

  return events;
}
