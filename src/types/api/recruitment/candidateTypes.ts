export interface Candidate {
  id: string; jobId: string; jobTitle?: string; name: string; email: string; phone: string;
  resumeUrl?: string; matchScore?: number; stage: 'applied' | 'screening' | 'interview' | 'offer' | 'hired' | 'rejected';
  appliedDate: string; notes?: string[];
}
export interface ScheduleInterviewRequest { candidateId: string; jobId: string; interviewers: string[]; scheduledAt: string; type: 'technical' | 'hr' | 'managerial'; link?: string; }