export const createAtsActions = (set: any, get: any) => ({
  setCurrentResume: (currentResume: any) => set({ currentResume }),
  setCurrentReport: (currentReport: any) => set({ currentReport }),
  setIsAnalyzing: (isAnalyzing: boolean) => set({ isAnalyzing }),
  setSelectedJobTitle: (selectedJobTitle: string) => set({ selectedJobTitle }),
  setJobDescription: (jobDescription: string) => set({ jobDescription }),
  clearAnalysis: () => set({ currentResume: null, currentReport: null }),
  saveAnalysis: (r: any) => set((s: any) => {
    const list = s.history.filter((x: any) => x.id !== r.id);
    return { history: [r, ...list], currentReport: r };
  }),
  deleteAnalysis: (id: string) => set((s: any) => ({ history: s.history.filter((x: any) => x.id !== id) })),
  clearHistory: () => set({ history: [] }),
  setActiveAnalysis: (r: any) => set({ currentReport: r }),
});
