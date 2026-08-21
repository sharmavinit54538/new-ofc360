export interface BackendATSScoreBreakdown {
  overall_ats_score: number; skill_match_score: number; experience_match_score: number; education_match_score: number;
  keyword_match_score: number; role_match_score: number; industry_match_score: number; location_match_score: number;
  certification_match_score: number; resume_completeness: number; formatting_quality: number;
  matched_skills: string[]; missing_skills: string[]; extra_skills: string[];
}
export interface BackendAIInsights {
  candidate_summary: string; strengths: string[]; weaknesses: string[]; missing_skills: string[];
  recommended_interview_questions: string[]; risk_factors: string[]; hiring_recommendation: string;
  career_level: string; technical_assessment: string; communication_assessment: string; leadership_indicators: string[];
}
export interface BackendParsedResume {
  candidate_name: string | null; email: string | null; phone: string | null; address: string | null;
  linkedin: string | null; github: string | null; portfolio: string | null; summary: string | null;
  total_experience_years: number; current_company: string | null; previous_companies: string[]; current_designation: string | null;
  skills: string[]; technical_skills: string[]; soft_skills: string[]; languages: string[];
  education: { degree?: string; field_of_study?: string; university?: string; college?: string; passing_year?: number }[];
  work_history: { company: string; designation?: string; duration_months?: number; start_date?: string; end_date?: string; description?: string }[];
  certifications: string[]; projects: { title: string; description?: string; technologies: string[] }[];
  achievements: string[]; current_salary: number | null; expected_salary: number | null; notice_period_days: number | null;
  current_location: string | null; preferred_location: string | null; willing_to_relocate: boolean;
}
