export const createSuperAdminActions = (set: any) => ({
  setCompanies: (companies: any) => set({ companies }),
  addCompany: (comp: any) => set((s: any) => ({ companies: [comp, ...s.companies] })),
  updateCompany: (id: string, updates: any) => set((s: any) => ({
    companies: s.companies.map((c: any) => c.id === id ? { ...c, ...updates } : c)
  })),
  deleteCompany: (id: string) => set((s: any) => ({
    companies: s.companies.filter((c: any) => c.id !== id)
  })),
  setUsers: (users: any) => set({ users }),
  addUser: (user: any) => set((s: any) => ({ users: [user, ...s.users] })),
  setHRAdmins: (hrAdmins: any) => set({ hrAdmins }),
});