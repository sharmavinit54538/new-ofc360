import type { TimelineEvent } from "./timelineEvent";

export function calculateWorkAnniversaries(empId: string, name: string, joinDateStr: string): TimelineEvent[] {
  if (!joinDateStr) return [];
  const joinDate = new Date(joinDateStr);
  const now = new Date();
  if (isNaN(joinDate.getTime()) || joinDate > now) return [];
  const events: TimelineEvent[] = [{
    id: `ANNIV-JOIN-${empId}`, employeeId: empId, employeeName: name, category: "Anniversaries",
    title: "Joined Company", date: joinDate.toISOString().split("T")[0], badge: "Day 1",
    description: `${name} officially joined OFC360 enterprise workforce.`, details: { yearsCompleted: 0 }
  }];
  [1, 2, 3, 5, 10].forEach((years) => {
    const anniv = new Date(joinDate);
    anniv.setFullYear(joinDate.getFullYear() + years);
    if (anniv <= now) {
      events.push({
        id: `ANNIV-${years}YR-${empId}`, employeeId: empId, employeeName: name, category: "Anniversaries",
        title: `${years} Year Work Anniversary`, date: anniv.toISOString().split("T")[0], badge: `${years} Yrs Service`,
        description: `Celebrated ${years} year(s) of dedicated service at OFC360.`, details: { yearsCompleted: years }
      });
    }
  });
  return events;
}
