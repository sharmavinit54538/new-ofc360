export const createAtsActions = (set: any, get: any) => ({
  setActiveTab: (activeTab: string) => set({ activeTab }),
  setSelectedCandidateId: (selectedCandidateId: string | null) => set({ selectedCandidateId }),
  addRequisition: (req: any) => set((s: any) => ({ requisitions: [req, ...s.requisitions] })),
  updateRequisitionStatus: (id: string, status: any) => set((s: any) => ({ requisitions: s.requisitions.map((r: any) => r.id === id ? { ...r, status } : r) })),
  addJob: (job: any) => set((s: any) => ({ jobs: [job, ...s.jobs] })),
  updateJobStatus: (id: string, status: any) => set((s: any) => ({ jobs: s.jobs.map((j: any) => j.id === id ? { ...j, status } : j) })),
  addCandidate: (c: any) => set((s: any) => ({ candidates: [c, ...s.candidates] })),
  updateCandidateStage: (id: string, stage: any) => set((s: any) => ({ candidates: s.candidates.map((c: any) => c.id === id ? { ...c, stage } : c) })),
  addInterview: (inv: any) => set((s: any) => ({ interviews: [inv, ...s.interviews] })),
  addScorecard: (sc: any) => set((s: any) => ({ scorecards: [sc, ...s.scorecards] })),
  addOffer: (off: any) => set((s: any) => ({ offers: [off, ...s.offers] })),
});