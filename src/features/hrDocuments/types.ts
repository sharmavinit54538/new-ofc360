export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: { field?: string; message: string }[] | null;
}

export type DocumentStatus = "PENDING" | "VERIFIED" | "REJECTED" | "EXPIRED" | "SIGNED";
export type DocumentVisibility = "PRIVATE" | "PUBLIC" | "RESTRICTED";

export interface DocumentCategory {
  id: string;
  code: string; // e.g. EXP_LETTER, APPT_LETTER, NOC, BONAFIDE, etc.
  name: string;
  description?: string;
  is_system?: boolean;
}

export interface HrDocument {
  id: string;
  title: string;
  description?: string;
  category_id: string;
  category_code?: string;
  employee_id?: string;
  employee_name?: string;
  file_name?: string;
  file_url?: string;
  file_size?: number;
  mime_type?: string;
  status: DocumentStatus;
  visibility: DocumentVisibility;
  issue_date?: string;
  expiry_date?: string;
  tags?: string[];
  is_company_level?: boolean;
  requires_signature?: boolean;
  is_signed?: boolean;
  created_at: string;
  updated_at: string;
}

export interface UploadEmployeeDocumentInput {
  file: File;
  employee_id: string;
  category_id: string;
  title: string;
  description?: string;
  issue_date?: string;
  expiry_date?: string;
  visibility?: DocumentVisibility;
  status_field?: DocumentStatus;
  tags?: string;
}

export interface UploadCompanyDocumentInput {
  file: File;
  category_id: string;
  title: string;
  description?: string;
}

export interface UpdateEmployeeDocumentInput {
  id: string;
  file?: File;
  title?: string;
  description?: string;
  category_id?: string;
  issue_date?: string;
  expiry_date?: string;
  visibility?: DocumentVisibility;
  status?: DocumentStatus;
  tags?: string;
}

export interface DocumentFilterParams {
  employee_id?: string;
  category_id?: string;
  status?: DocumentStatus | string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface RequestSignatureInput {
  id: string;
  signer_email: string;
  signer_name: string;
  message?: string;
  due_date?: string;
}

export interface SignDocumentInput {
  id: string;
  signature_data: string; // base64 or SVG signature
  signed_by: string;
}

export interface SignatureStatusResponse {
  document_id: string;
  status: "NOT_REQUESTED" | "PENDING" | "COMPLETED" | "REJECTED";
  signer_name?: string;
  signer_email?: string;
  requested_at?: string;
  signed_at?: string;
  signature_url?: string;
}

export interface ExitDocumentResponse {
  id: string;
  exit_id: string;
  employee_id: string;
  employee_name: string;
  relieving_letter_url?: string;
  experience_certificate_url?: string;
  final_settlement_letter_url?: string;
  generated_at: string;
  status: "GENERATED" | "PENDING" | "FAILED";
}

export interface DocumentTypeInfo {
  key: string;
  title: string;
  description: string;
  categoryCode: string;
  hasRealGenerator: boolean;
  generatorType?: "exit" | "offer" | "upload";
  iconName: string;
}