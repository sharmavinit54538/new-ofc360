// ─── Generic API Envelope ────────────────────────────────────────────
export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: { field: string | null; message: string }[] | null;
}

// ─── A. Onboarding Wizard ────────────────────────────────────────────

export interface OnboardingStatusResponse {
  completed: boolean;
  current_step: number;
  total_steps: number;
}

export interface OnboardingWizardData {
  current_step: number;
  completed: boolean;
  completed_at: string | null;
  companyName: string;
  logo: string;
  industry: string;
  companySize: string;
  website: string;
  country: string;
  timezone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  gstNumber: string;
  fullName: string;
  phone: string;
  avatar: string;
  termsAccepted: boolean;
  dpaAccepted: boolean;
}

export type SaveStepPayload = Partial<Omit<OnboardingWizardData, "current_step" | "completed" | "completed_at">>;

// ─── B. Workflows ────────────────────────────────────────────────────

export interface Workflow {
  id: string;
  title: string;
  description: string;
  stepsCount: number;
  targetRole: string;
  isDefault: boolean;
  createdAt: string;
}

export interface CreateWorkflowPayload {
  title?: string;
  description?: string;
  stepsCount?: number;
  targetRole?: string;
  isDefault?: boolean;
}

// ─── C. New Hires ────────────────────────────────────────────────────

export enum NewHireStatus {
  INVITED = "INVITED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface NewHire {
  id: string;
  fullName: string;
  email: string;
  department: string;
  role: string;
  startDate: string; // YYYY-MM-DD
  status: string;
  progressPercentage: number;
  workflowId: string;
  createdAt: string;
}

export interface CreateNewHirePayload {
  fullName?: string;
  email?: string;
  department?: string;
  role?: string;
  startDate?: string;
  status?: string;
  progressPercentage?: number;
  workflowId?: string;
}

export type UpdateNewHirePayload = Partial<Omit<NewHire, "id" | "createdAt">>;

// ─── D. Onboarding Documents ─────────────────────────────────────────

export enum DocumentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface OnboardingDocument {
  id: string;
  title: string;
  category: string;
  isRequired: boolean;
  description: string;
  status: string;
  createdAt: string;
}

export interface CreateDocumentPayload {
  title?: string;
  category?: string;
  isRequired?: boolean;
  description?: string;
}

export type UpdateDocumentPayload = Partial<Omit<OnboardingDocument, "id" | "createdAt">>;

// ─── E. Onboarding Tasks ─────────────────────────────────────────────

export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface OnboardingTask {
  id: string;
  title: string;
  assigneeRole: string;
  dueDaysOffset: number;
  description: string;
  status: string;
  createdAt: string;
}

export interface CreateTaskPayload {
  title?: string;
  assigneeRole?: string;
  dueDaysOffset?: number;
  description?: string;
}

export type UpdateTaskPayload = Partial<Omit<OnboardingTask, "id" | "createdAt">>;

// ─── Shared Filters ──────────────────────────────────────────────────

export interface ListFilters {
  status?: string;
  search?: string;
}
