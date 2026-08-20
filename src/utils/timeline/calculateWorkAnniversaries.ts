import type { TimelineEvent } from "./timelineEvent";

export function calculateWorkAnniversaries(empId: string, name: string, joinDateStr: string): TimelineEvent[] {
  if (!joinDateStr) return [];
  const joinDate = new Date(joinDateStr);
  const now = new Date();
  if (isNaN(joinDate.getTime()) || joinDate > now) return [];
  const events: TimelineEvent[] = [{ id: `ANNIV-JOIN-${empId}`, employeeId: empId, employeeName: name, category: "Anniversaries", title: "Joined Company", date: joinDate.toISOString().split("T")[0], badge: "Day 1", description: `${name} joined OFC360.`, details: { yearsCompleted: 0 } }];
  [1, 2, 3, 5, 10].forEach((y) => {
    const anniv = new Date(joinDate);
    anniv.setFullYear(joinDate.getFullYear() + y);
    if (anniv <= now) {
      events.push({ id: `ANNIV-${y}YR-${empId}`, employeeId: empId, employeeName: name, category: "Anniversaries", title: `${y} Year Work Anniversary`, date: anniv.toISOString().split("T")[0], badge: `${y} Yrs`, description: `${y} yrs service.`, details: { yearsCompleted: y } });
    }
  });
  return events;
}
