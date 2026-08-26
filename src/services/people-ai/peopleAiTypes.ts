import type { SystemRole } from "@/features/auth/authTypes";

export type SignalStatus = "positive" | "attention_required" | "critical" | "insufficient_data";

export type SignalType =
  | "performance"
  | "engagement"
  | "workload"
  | "attendance"
  | "skill"
  | "growth"
  | "development"
  | "lifecycle"
  | "compliance"
  | "security";

export type ConfidenceLevel = "HIGH" | "MEDIUM" | "LIMITED";

export interface PeopleSignal {
  id: string;
  type: SignalType;
  status: SignalStatus;
  headline: string;
  description: string;
  evidencePoints: string[];
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0 - 100
  metricValue?: string | number;
  trend?: "up" | "down" | "stable";
  timestamp: string;
}

export interface PeopleInsight {
  id: string;
  category: string;
  whatHappened: string;
  whyItMatters: string;
  supportingData: string[];
  recommendedAction: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "POSITIVE" | "INFO";
  targetEntityId: string;
  targetEntityName: string;
  targetEntityType: "employee" | "department" | "manager" | "system";
  actionType?: string;
  timestamp: string;
}

export type RequiredApprovalRole = "HR" | "Manager" | "Executive" | "System Admin" | "None";

export interface PeopleRecommendation {
  id: string;
  category: string;
  title: string;
  reason: string;
  evidence: string[];
  expectedImpact: string;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  requiredApproval: RequiredApprovalRole;
  suggestedAction: string;
  actionPayload?: Record<string, any>;
  workflowType?: PeopleWorkflowType;
  targetId: string;
  targetName: string;
  targetType: "employee" | "department" | "manager" | "system";
  status: "pending" | "approved" | "rejected" | "executed";
  createdAt: string;
}

export type PeopleWorkflowType =
  | "onboarding"
  | "probation"
  | "performance_review"
  | "goal_alignment"
  | "training"
  | "promotion"
  | "internal_mobility"
  | "exit_clearance"
  | "document_renewal"
  | "compliance_followup"
  | "access_review";

export interface PeopleWorkflowStep {
  id: string;
  name: string;
  description: string;
  assignedRole: SystemRole;
  status: "pending" | "in_progress" | "completed" | "skipped";
  completedAt?: string;
  completedBy?: string;
  notes?: string;
}

export interface PeopleWorkflow {
  id: string;
  type: PeopleWorkflowType;
  title: string;
  targetEmployeeId: string;
  targetEmployeeName: string;
  targetDepartment?: string;
  initiator: string;
  status: "pending_approval" | "in_progress" | "completed" | "failed" | "cancelled";
  steps: PeopleWorkflowStep[];
  currentStepIndex: number;
  aiRecommendationId?: string;
  requiresConfirmation: boolean;
  createdAt: string;
  updatedAt: string;
  auditTrail: {
    timestamp: string;
    actor: string;
    action: string;
    details?: string;
  }[];
}

export interface PeopleIntelligenceSummary {
  criticalIssuesCount: number;
  attentionRequiredCount: number;
  recommendedActionsCount: number;
  upcomingEventsCount: number;
  aiInsightsCount: number;
  pendingApprovalsCount: number;
  dataHealthScore: number; // 0 - 100
  recentChangesCount: number;
  topSignals: PeopleSignal[];
  activeRecommendations: PeopleRecommendation[];
  pendingWorkflows: PeopleWorkflow[];
  recentEvents: {
    id: string;
    title: string;
    description: string;
    type: string;
    date: string;
    targetId?: string;
    targetName?: string;
  }[];
}

export interface Employee360Intelligence {
  employeeId: string;
  employeeName: string;
  department: string;
  role: string;
  managerName?: string;
  status: string;
  aiSummary: string;
  keyStrengths: string[];
  developmentAreas: string[];
  signals: {
    performance: PeopleSignal;
    engagement: PeopleSignal;
    workload: PeopleSignal;
    attendance: PeopleSignal;
    skill: PeopleSignal;
    growth: PeopleSignal;
    development: PeopleSignal;
  };
  insights: PeopleInsight[];
  recommendations: PeopleRecommendation[];
  workloadTelemetry: {
    currentWeeklyHours: number;
    targetWeeklyHours: number;
    overtimeTrend: "increasing" | "stable" | "decreasing";
    openTasksCount: number;
    completedGoalsRatio: number;
  };
  performanceTelemetry: {
    score: number; // 0-100
    trend: "improving" | "stable" | "declining";
    lastReviewDate?: string;
    activeGoalsCount: number;
    goalsCompletedCount: number;
  };
  skills: {
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    verified: boolean;
  }[];
  trainingStatus: {
    completedCourses: number;
    pendingCourses: number;
    overdueCourses: number;
  };
  timeline: {
    id: string;
    date: string;
    category: string;
    title: string;
    description: string;
    impact?: string;
    aiSignal?: SignalStatus;
  }[];
}

export interface DepartmentIntelligence {
  departmentId: string;
  departmentName: string;
  headCount: number;
  headOfDepartment: string;
  healthScore: number; // 0 - 100
  healthStatus: "EXCELLENT" | "HEALTHY" | "ATTENTION_REQUIRED" | "CRITICAL";
  healthReasoning: string[];
  staffingStatus: "UNDERSTAFFED" | "OPTIMAL" | "OVERSTAFFED";
  performanceTrend: "improving" | "stable" | "declining";
  attendanceRate: number; // percentage
  goalCompletionRate: number; // percentage
  workloadIndex: number; // 0 - 100
  topSkillGaps: string[];
  activeRisks: string[];
  insights: PeopleInsight[];
  recommendations: PeopleRecommendation[];
  recentChanges: string[];
}

export interface ManagerIntelligence {
  managerId: string;
  managerName: string;
  department: string;
  teamSize: number;
  teamHealthScore: number; // 0 - 100
  teamPerformanceTrend: "improving" | "stable" | "declining";
  teamAttendanceRate: number;
  teamGoalCompletion: number;
  workloadDistribution: {
    balancedCount: number;
    overloadedCount: number;
    underutilizedCount: number;
  };
  pendingReviewsCount: number;
  pendingApprovalsCount: number;
  todayFocusActions: {
    id: string;
    title: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM";
    reason: string;
    actionLabel: string;
    targetEmployeeId?: string;
  }[];
  teamRisks: string[];
  teamOpportunities: string[];
}

export interface ExecutiveBriefing {
  generatedAt: string;
  executiveSummary: string;
  workforceHealthScore: number; // 0 - 100
  totalHeadcount: number;
  headcountGrowthRate: number;
  whatChanged: string[];
  whyItChanged: string[];
  whatRequiresAttention: string[];
  whatIsImproving: string[];
  emergingRisks: string[];
  strategicOpportunities: string[];
  leadershipNextSteps: {
    id: string;
    title: string;
    impact: string;
    department: string;
    priority: "CRITICAL" | "HIGH" | "MEDIUM";
  }[];
  departmentComparative: {
    name: string;
    healthScore: number;
    headcount: number;
    trend: "improving" | "stable" | "declining";
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
  }[];
}

export interface ITSystemIntelligence {
  totalUserAccounts: number;
  activeAccounts: number;
  inactiveAccounts: number;
  orphanAccountsCount: number;
  roleMismatchesCount: number;
  permissionAnomalies: {
    id: string;
    userName: string;
    userEmail: string;
    assignedRole: string;
    anomalyDescription: string;
    severity: "HIGH" | "MEDIUM" | "LOW";
    recommendedFix: string;
  }[];
  joinerMoverLeaverSync: {
    activeOnboardingWorkflows: number;
    pendingMoverPermissionUpdates: number;
    pendingLeaverAccessRevocations: number;
  };
  dataQualityScore: number; // 0 - 100
  integrationHealth: {
    sso: "CONNECTED" | "DEGRADED" | "DISCONNECTED";
    directorySync: "SYNCED" | "PENDING" | "ERROR";
    auditPipeline: "ACTIVE" | "INACTIVE";
  };
  failedWorkflowsCount: number;
}

export interface DataQualityIssue {
  id: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  employeeId?: string;
  employeeName?: string;
  field: string;
  issueType: "missing_field" | "invalid_manager" | "broken_department" | "duplicate" | "expired_document" | "incomplete_profile";
  description: string;
  suggestedFix: string;
  remediationPayload?: Record<string, any>;
}

export interface PeopleAuditEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: SystemRole;
  action: string;
  targetId?: string;
  targetName?: string;
  details: string;
  aiGenerated: boolean;
  status: "SUCCESS" | "FAILURE" | "PENDING_APPROVAL" | "OVERRIDDEN";
  confidence?: string;
}

export interface AskPeopleAIRequest {
  query: string;
  scope?: "all" | "team" | "department" | "self";
  contextEntityId?: string;
}

export interface AskPeopleAIResponse {
  answer: string;
  supportingDataPoints: string[];
  suggestedFollowUps: string[];
  recommendedActions: PeopleRecommendation[];
  confidence: ConfidenceLevel;
  confidenceScore: number;
  authorizedScope: string;
  dataGroundingSummary: string;
}
