// Response Envelope
export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: { field?: string; message: string }[] | null;
}

// ----------------------------------------------------------------------
// 1. Generic & Core Reports Types (/v2/reports)
// ----------------------------------------------------------------------

export type ReportType =
  | 'employee'
  | 'payroll'
  | 'attendance'
  | 'leave'
  | 'recruitment'
  | 'travel'
  | 'compliance'
  | 'audit'
  | 'ai-insights';

export type ReportFormat = 'pdf' | 'csv' | 'excel';
export type ReportSchedule = 'none' | 'daily' | 'weekly' | 'monthly';

export interface ReportCreate {
  name: string;
  description?: string;
  type: ReportType | string; // default "employee"
  format?: ReportFormat; // default "pdf"
  filters?: Record<string, unknown>;
  schedule?: ReportSchedule; // default "none"
}

export interface ReportResponse {
  id: string;
  name: string;
  description?: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'scheduled' | string;
  format: ReportFormat;
  filters?: Record<string, unknown>;
  schedule?: ReportSchedule;
  file_path?: string;
  file_size_kb?: number;
  created_at: string;
  updated_at: string;
}

export interface ReportListQueryParams {
  type?: ReportType | string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface ReportStats {
  total: number;
  generated_today: number;
  scheduled: number;
  pending: number;
  successful_exports: number;
  failed: number;
  active_dashboards: number;
  storage_usage_mb: number;
}

export interface HeadcountAnalytics {
  m: string; // Month label e.g., "Jan 2026"
  n: number; // Headcount
}

export interface DepartmentAnalytics {
  name: string; // Department name
  value: number; // Count/percentage
}

export interface TenureAnalytics {
  range: string; // e.g. "< 1 year", "1-3 years"
  n: number; // Count
}

// ----------------------------------------------------------------------
// 2. Workforce & Headcount Reports Types (/v1/hr-analytics)
// ----------------------------------------------------------------------

export interface WorkforceDashboardMetrics {
  totalEmployees: number;
  activeEmployees: number;
  turnoverRate: number;
  newHiresThisMonth: number;
  openPositions: number;
  retentionRate: number;
  avgTenureYears: number;
}

export interface LeaveAnalytics {
  totalLeaves: number;
  approvedLeaves: number;
  pendingLeaves: number;
  rejectedLeaves: number;
  leaveConflicts: number;
  peakLeaveMonth: string;
  avgLeaveDurationDays: number;
}

export interface AttritionPrediction {
  employee_id: string;
  risk_score: number; // 0 - 100
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendation: string;
}

export interface WorkforceForecast {
  time_horizon: string;
  forecast_headcount: number;
  predicted_turnover: number;
  skill_gaps_projected: string[];
  insights: string[];
}

// ----------------------------------------------------------------------
// 3. Performance & Appraisal Reports Types (/v1/ai/performance)
// ----------------------------------------------------------------------

export interface PerformanceDashboardKpis {
  totalEvaluations: number;
  avgPerformanceScore: number;
  topPerformersCount: number;
  skillGapsCount: number;
  promotionCandidatesCount: number;
}

export interface PerformanceTrend {
  period: string;
  score: number;
  target: number;
}

export interface KpiAttainment {
  department: string;
  attainmentRate: number; // %
  target: number;
}

export interface TopPerformer {
  employeeId: string;
  name: string;
  department: string;
  score: number;
  avatar?: string;
  rating: string;
}

export interface EmployeePerformanceScore {
  employeeId: string;
  overallScore: number;
  technicalSkills: number;
  softSkills: number;
  leadership: number;
  productivity: number;
  goalsCompleted: number;
}

export interface SkillGap {
  skill: string;
  requiredLevel: number;
  currentLevel: number;
  gap: number;
  affectedEmployees: number;
}

export interface PromotionRecommendation {
  employeeId: string;
  name: string;
  currentRole: string;
  proposedRole: string;
  readinessScore: number;
  rationale: string;
}

export interface CoachingSuggestion {
  employeeId: string;
  name: string;
  areaOfImprovement: string;
  suggestedAction: string;
  priority: 'low' | 'medium' | 'high';
}

export interface PerformanceAnalytics {
  totalReviewsCompleted: number;
  reviewCompletionRate: number;
  performanceDistribution: { rating: string; percentage: number }[];
  functionalScores: { function: string; avgScore: number }[];
}

export interface EvaluateReviewPayload {
  employee_id: string;
  review_period: string;
  goals_achieved: string[];
  feedback: string;
}

export interface GenerateCoachingPayload {
  employee_id: string;
  focus_areas?: string[];
}

export interface GeneratePromotionPayload {
  employee_id: string;
  target_role?: string;
}

export interface SkillGapAnalysisPayload {
  department_id?: string;
  target_skills?: string[];
}

// ----------------------------------------------------------------------
// 4. Compliance & Risk Audit Reports Types (/v1/ai/compliance)
// ----------------------------------------------------------------------

export interface ComplianceDashboardKpis {
  complianceScore: number; // 0 - 100
  openViolations: number;
  pendingAudits: number;
  missingDocumentsCount: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ComplianceCheck {
  id: string;
  category: string;
  title: string;
  status: 'passed' | 'warning' | 'failed';
  lastChecked: string;
}

export interface LaborLawStatus {
  lawName: string;
  jurisdiction: string;
  status: 'compliant' | 'review_needed' | 'non_compliant';
  updateDate: string;
}

export interface MissingDocument {
  id: string;
  employeeId: string;
  employeeName: string;
  documentType: string;
  status: 'missing' | 'expired';
  dueDate: string;
}

export interface ComplianceRisk {
  id: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  department: string;
  detectedAt: string;
}

export interface AuditReadiness {
  overallScore: number;
  documentCompleteness: number;
  policyAdherence: number;
  accessControlScore: number;
  recommendations: string[];
}

export interface ComplianceAnalytics {
  totalAuditsConducted: number;
  complianceTrend: { month: string; score: number }[];
  topRiskCategories: { category: string; count: number }[];
}

export interface ComplianceAlert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  timestamp: string;
}

export interface ComplianceReportData {
  reportId: string;
  title: string;
  period: string;
  overallStatus: string;
  executiveSummary: string;
  riskAuditRegister: ComplianceRisk[];
  detailedFindings: any[];
}

export interface EmployeeComplianceDetail {
  employeeId: string;
  name: string;
  verificationStatus: string;
  mandatoryTrainingCompleted: boolean;
  missingDocs: string[];
  backgroundCheckStatus: string;
}

export interface AnalyzeCompliancePayload {
  scope?: string;
  department_id?: string;
}

export interface AuditPayload {
  audit_type?: string;
  department_id?: string;
}

export interface RiskAnalysisPayload {
  risk_category?: string;
}

export interface SecurityAuditLog {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  resource: string;
  ip_address: string;
  timestamp: string;
  status: string;
}

// ----------------------------------------------------------------------
// 5. Engagement & eNPS Reports Types
// ----------------------------------------------------------------------

export interface EngagementSummary {
  engagementScore?: number;
  participationRate?: number;
  enpsScore?: number;
  enps?: number;
  responseRate?: number;
  totalResponses?: number;
  totalSurveys?: number;
  promoters?: number;
  passives?: number;
  detractors?: number;
  trend?: { month: string; score: number; responses?: number }[];
  status?: string;
}

export interface EngagementTrendItem {
  month: string;
  score: number;
  participationRate?: number;
  responses?: number;
}

export interface EnpsTrendItem {
  month: string;
  score: number;
  responses: number;
  promoters?: number;
  passives?: number;
  detractors?: number;
}

export interface EngagementBreakdownItem {
  department?: string;
  team?: string;
  score: number;
  participationRate?: number;
  responses?: number;
  enps?: number;
}

export interface EngagementSurveyItem {
  id: string;
  title: string;
  status: 'active' | 'completed' | 'draft' | string;
  responses: number;
  totalEligible?: number;
  responseRate?: number;
  score?: number;
  createdAt?: string;
  dueDate?: string;
}

// ----------------------------------------------------------------------
// 6. Culture & D&I Telemetry Types
// ----------------------------------------------------------------------

export interface CultureDiTelemetry {
  inclusionIndex?: number;
  psychologicalSafetyScore?: number;
  diHiringRatio?: number;
  genderDistribution?: { label: string; value: number }[];
  ageDistribution?: { label: string; value: number }[];
  departmentScores?: { department: string; score: number }[];
}

export interface CultureTrendItem {
  month: string;
  inclusionIndex?: number;
  score?: number;
  safetyScore?: number;
}

export interface CultureBreakdownItem {
  category: string;
  score: number;
  benchmark?: number;
  status?: string;
}

export interface CultureFeedbackItem {
  id: string;
  sentiment: 'positive' | 'neutral' | 'negative' | string;
  theme: string;
  comment?: string;
  department?: string;
  date?: string;
}

// ----------------------------------------------------------------------
// 7. Local UI State Slice Types
// ----------------------------------------------------------------------

export type ReportCategory = 'workforce' | 'performance' | 'engagement' | 'culture' | 'compliance';

export interface ReportsUiState {
  activeCategory: ReportCategory;
  dateRange: {
    from?: string;
    to?: string;
  };
  reportListFilters: {
    type?: string;
    status?: string;
    search?: string;
    page: number;
    limit: number;
  };
}
