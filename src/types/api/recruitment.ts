export interface Job {
  id: string;
  title: string;
  departmentId: string;
  departmentName?: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  status: 'draft' | 'published' | 'closed' | 'archived';
  description: string;
  requirements?: string[];
  salaryRange?: { min: number; max: number; currency: string };
  applicationsCount: number;
  createdAt: string;
}

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  resumeUrl?: string;
  skills: string[];
  experienceYears?: number;
  status: 'new' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';
  createdAt: string;
}

export interface JobApplication {
  id: string;
  jobId: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  stage: 'applied' | 'screening' | 'technical' | 'hr' | 'offer' | 'hired' | 'rejected';
  score?: number;
  aiMatchScore?: number;
  appliedDate: string;
}

export interface Interview {
  id: string;
  applicationId: string;
  candidateName: string;
  jobTitle: string;
  interviewerId: string;
  interviewerName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: string;
  rating?: number;
}
