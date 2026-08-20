export enum DocumentStatus { PENDING = "Pending", UPLOADED = "Uploaded", VERIFIED = "Verified", REJECTED = "Rejected" }
export interface OnboardingDocument { id: string; new_hire_id: string; name: string; required: boolean; category: string; file_url?: string; status: DocumentStatus; }
export interface CreateDocumentPayload { new_hire_id: string; name: string; required: boolean; category: string; file_url?: string; }
export type UpdateDocumentPayload = Partial<CreateDocumentPayload> & { status?: DocumentStatus };
export enum TaskStatus { PENDING = "Pending", COMPLETED = "Completed" }
export interface OnboardingTask { id: string; new_hire_id: string; title: string; assigned_role: string; due_days: number; status: TaskStatus; }
export interface CreateTaskPayload { new_hire_id: string; title: string; assigned_role: string; due_days: number; }
export type UpdateTaskPayload = Partial<CreateTaskPayload> & { status?: TaskStatus };
export interface ListFilters { department?: string; status?: string; search?: string; }