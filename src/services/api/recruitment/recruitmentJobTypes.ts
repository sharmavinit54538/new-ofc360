export interface BackendJobSkill { id: string; name: string; category: string; is_required: boolean; }
export interface BackendJobListItem {
  id: string; title: string; slug: string; department: string; location: string; employment_type: string; vacancies: number; status: string; created_at: string;
}
export interface BackendJobDetail {
  id: string; title: string; slug: string; department: string; designation: string; employment_type: string;
  experience_required: string | null; min_experience: number; max_experience: number | null; min_salary: number | null;
  max_salary: number | null; location: string; vacancies: number; job_description: string; responsibilities: string | null;
  requirements: string | null; benefits: string | null; application_deadline: string | null; interview_process_description: string | null;
  status: string; created_by: string | null; created_at: string; updated_at: string; skills: BackendJobSkill[];
}
export interface BackendJobListResponse { items: BackendJobListItem[]; total: number; page: number; limit: number; pages: number; }
