export type TimelineCategory = "Career" | "Recognition" | "Anniversaries" | "Projects" | "Skills" | "Audit";

export interface TimelineEventDetails {
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
}
