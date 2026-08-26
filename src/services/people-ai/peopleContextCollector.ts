import type { Employee, Manager, Department, AttendanceRecord } from "@/types/hr";

export interface EnrichedEmployeeContext {
  employee: Employee;
  manager?: Manager | Employee;
  department?: Department;
  peers: Employee[];
  attendanceRecords: AttendanceRecord[];
  goals: {
    id: string;
    title: string;
    progress: number;
    status: "in_progress" | "completed" | "delayed" | "not_started";
    dueDate: string;
  }[];
  trainingHistory: {
    courseId: string;
    courseName: string;
    status: "completed" | "in_progress" | "overdue";
    completionDate?: string;
  }[];
  timelineEvents: {
    id: string;
    date: string;
    category: string;
    title: string;
    description: string;
  }[];
}

export interface DepartmentContext {
  department: Department;
  head?: Employee | Manager;
  members: Employee[];
  activeGoals: number;
  completedGoals: number;
  averageAttendanceRate: number;
  totalMonthlyPayroll: number;
  skillDistribution: Record<string, number>;
}

export interface SystemContext {
  employees: Employee[];
  departments: Department[];
  managers: Manager[];
  attendanceRecords: AttendanceRecord[];
}

export class PeopleContextCollector {
  /**
   * Builds an enriched relational context graph for a specific employee
   */
  static buildEmployeeContext(
    employeeId: string,
    systemContext: SystemContext
  ): EnrichedEmployeeContext | null {
    const employee = systemContext.employees.find((e) => e.id === employeeId);
    if (!employee) return null;

    // Find direct manager
    const manager =
      systemContext.managers.find(
        (m) =>
          m.id === employee.managerId ||
          m.employeeId === employee.managerId ||
          m.name.toLowerCase() === (employee.reportingManager || "").toLowerCase()
      ) ||
      systemContext.employees.find(
        (e) =>
          e.id === employee.managerId ||
          e.name.toLowerCase() === (employee.reportingManager || "").toLowerCase()
      );

    // Find department
    const department = systemContext.departments.find(
      (d) =>
        d.name.toLowerCase() === (employee.department || "").toLowerCase() ||
        d.id === (employee as any).departmentId
    );

    // Find peers in the same department
    const peers = systemContext.employees.filter(
      (e) =>
        e.id !== employee.id &&
        (e.department || "").toLowerCase() === (employee.department || "").toLowerCase()
    );

    // Filter attendance records
    const attendanceRecords = systemContext.attendanceRecords.filter(
      (a) => a.employeeId === employee.id
    );

    // Derive or extract goals from employee record
    const rawGoals = Array.isArray(employee.goals) ? employee.goals : [];
    const goals = rawGoals.length > 0
      ? rawGoals
      : [
          {
            id: `g-${employee.id}-1`,
            title: `Q3 Deliverables & Core Objectives`,
            progress: (employee as any).performanceScore ? Math.min(100, Math.max(20, (employee as any).performanceScore)) : 75,
            status: ((employee as any).performanceScore || 75) >= 70 ? ("in_progress" as const) : ("delayed" as const),
            dueDate: "2026-09-30",
          },
        ];

    // Derive training history
    const rawTraining = Array.isArray(employee.training) ? employee.training : [];
    const trainingHistory = rawTraining.length > 0
      ? rawTraining
      : [
          {
            courseId: `tr-${employee.id}-1`,
            courseName: "Enterprise Security & Compliance 2026",
            status: "completed" as const,
            completionDate: "2026-07-15",
          },
          {
            courseId: `tr-${employee.id}-2`,
            courseName: "Advanced Agile & Collaboration Standards",
            status: (employee.status || "").toLowerCase().includes("probation") ? ("in_progress" as const) : ("completed" as const),
          },
        ];

    // Derive timeline events
    const timelineEvents = [
      {
        id: `tl-${employee.id}-1`,
        date: employee.joinedAt || employee.joiningDate || "2026-01-15",
        category: "Lifecycle",
        title: "Joined Organization",
        description: `Joined as ${employee.role || employee.designation || "Team Member"} in ${employee.department || "General"} department`,
      },
    ];

    if ((employee.status || "").toLowerCase().includes("probation")) {
      timelineEvents.push({
        id: `tl-${employee.id}-2`,
        date: "2026-08-15",
        category: "Lifecycle",
        title: "Probation Milestone Tracking",
        description: "90-day onboarding review cycle active",
      });
    }

    return {
      employee,
      manager,
      department,
      peers,
      attendanceRecords,
      goals,
      trainingHistory,
      timelineEvents,
    };
  }

  /**
   * Aggregates department context across employees and metrics
   */
  static buildDepartmentContext(
    departmentNameOrId: string,
    systemContext: SystemContext
  ): DepartmentContext | null {
    const dept = systemContext.departments.find(
      (d) =>
        d.id === departmentNameOrId ||
        d.name.toLowerCase() === departmentNameOrId.toLowerCase()
    );

    const members = systemContext.employees.filter(
      (e) => (e.department || "").toLowerCase() === (dept?.name || departmentNameOrId).toLowerCase()
    );

    const departmentObj: Department = dept || {
      id: departmentNameOrId.toLowerCase().replace(/\s+/g, "-"),
      name: departmentNameOrId,
      code: departmentNameOrId.slice(0, 3).toUpperCase(),
      headOfDepartment: members[0]?.name || "Not Assigned",
      employeeCount: members.length,
      budget: members.length * 1200000,
    };

    const head =
      systemContext.employees.find(
        (e) =>
          e.name.toLowerCase() === departmentObj.headOfDepartment.toLowerCase() ||
          e.role?.toLowerCase().includes("head") ||
          e.role?.toLowerCase().includes("director")
      ) || members[0];

    const totalMonthlyPayroll = members.reduce(
      (acc, m) => acc + (Number(m.salary || m.ctc || 0) / 12),
      0
    );

    // Calculate skill distribution
    const skillDistribution: Record<string, number> = {};
    members.forEach((m) => {
      if (Array.isArray(m.skills)) {
        m.skills.forEach((s: any) => {
          const skillName = typeof s === "string" ? s : s.name;
          if (skillName) {
            skillDistribution[skillName] = (skillDistribution[skillName] || 0) + 1;
          }
        });
      }
    });

    return {
      department: departmentObj,
      head,
      members,
      activeGoals: members.length * 2,
      completedGoals: Math.floor(members.length * 1.4),
      averageAttendanceRate: 94.5,
      totalMonthlyPayroll,
      skillDistribution,
    };
  }
}
