export interface JobPosting {
  id: string; title: string; department: string; location: string; type: 'full-time' | 'part-time' | 'contract';
  experience: string; salary?: { min: number; max: number; currency: string; }; description: string;
  requirements: string[]; status: 'draft' | 'published' | 'closed'; applicantCount?: number; postedDate: string;
}