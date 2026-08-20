import type { Candidate } from "@/types/ats";

export interface CandidateStoreState {
  candidates: Candidate[]; selectedCandidate: Candidate | null;
  searchQuery: string; stageFilter: string;
}