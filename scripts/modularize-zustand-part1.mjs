import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

function writeStrict(filePath, content) {
  const dir = path.dirname(filePath);
  fs.mkdirSync(dir, { recursive: true });
  const trimmed = content.trim();
  const lines = trimmed.split(/\r?\n/);
  if (lines.length > 20) {
    console.warn(`WARNING: ${filePath} has ${lines.length} lines!`);
  }
  fs.writeFileSync(filePath, trimmed, 'utf8');
}

// -------------------------------------------------------------
// 1. AI STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/ai/aiStoreTypes.ts'), `
import type { AICategory, AIToolItem } from "@/types/ai";
import { ALL_71_AI_MODELS } from "@/data/aiToolsData";

export interface AIExecutionLog {
  id: string; toolId: string; toolTitle: string; prompt: string;
  response: string; timestamp: string; latencyMs: number;
}
export interface AIStoreState {
  models: AIToolItem[]; activeCategory: AICategory; searchQuery: string;
  selectedTool: AIToolItem | null; executionHistory: AIExecutionLog[]; isExecuting: boolean; currentOutput: string;
}
`);

writeStrict(path.join(root, 'src/stores/ai/aiStoreActions.ts'), `
import type { AICategory, AIToolItem } from "@/types/ai";
import { ALL_71_AI_MODELS } from "@/data/aiToolsData";
import type { AIStoreState, AIExecutionLog } from "./aiStoreTypes";

export const initialAiState: AIStoreState = {
  models: ALL_71_AI_MODELS, activeCategory: "ALL", searchQuery: "",
  selectedTool: null, executionHistory: [], isExecuting: false, currentOutput: "",
};
`);

writeStrict(path.join(root, 'src/stores/aiStore.ts'), `
import { create } from "zustand";
import type { AICategory, AIToolItem } from "@/types/ai";
import type { AIStoreState, AIExecutionLog } from "./ai/aiStoreTypes";
import { initialAiState } from "./ai/aiStoreActions";

export type { AIExecutionLog };

export const useAIStore = create<AIStoreState & {
  setActiveCategory: (cat: AICategory) => void; setSearchQuery: (q: string) => void;
  setSelectedTool: (t: AIToolItem | null) => void; addExecutionLog: (log: AIExecutionLog) => void;
  setIsExecuting: (e: boolean) => void; setCurrentOutput: (o: string) => void;
}>((set) => ({
  ...initialAiState,
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTool: (selectedTool) => set({ selectedTool }),
  addExecutionLog: (log) => set((s) => ({ executionHistory: [log, ...s.executionHistory].slice(0, 50) })),
  setIsExecuting: (isExecuting) => set({ isExecuting }),
  setCurrentOutput: (currentOutput) => set({ currentOutput }),
}));
`);

// -------------------------------------------------------------
// 2. ASSET STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/assets/assetTypes.ts'), `
export interface Asset {
  id: string; name: string; category: "Hardware" | "Software" | "Furniture" | "Vehicle" | "Access Card";
  serialNumber: string; assignedTo?: string; assignedToName?: string;
  status: "Available" | "Assigned" | "Under Maintenance" | "Retired";
  purchaseDate: string; warrantyExpiry?: string; value: number;
}
export interface AssetState {
  assets: Asset[]; searchQuery: string; statusFilter: string; categoryFilter: string;
}
`);

writeStrict(path.join(root, 'src/stores/assets/mockAssets.ts'), `
import type { Asset } from "./assetTypes";

export const INITIAL_MOCK_ASSETS: Asset[] = [
  { id: "AST-001", name: "MacBook Pro 16 M3 Max", category: "Hardware", serialNumber: "C02XYZ12345", assignedTo: "EMP-001", assignedToName: "Aarav Sharma", status: "Assigned", purchaseDate: "2024-01-15", warrantyExpiry: "2027-01-15", value: 249999 },
  { id: "AST-002", name: "Dell UltraSharp 32 4K", category: "Hardware", serialNumber: "CN-09876", assignedTo: "EMP-002", assignedToName: "Neha Patel", status: "Assigned", purchaseDate: "2024-02-10", warrantyExpiry: "2027-02-10", value: 54999 },
  { id: "AST-003", name: "Ergonomic Mesh Chair V2", category: "Furniture", serialNumber: "FUR-8891", assignedTo: "EMP-001", assignedToName: "Aarav Sharma", status: "Assigned", purchaseDate: "2023-11-20", value: 18500 },
];
`);

writeStrict(path.join(root, 'src/stores/assetStore.ts'), `
import { create } from "zustand";
import type { Asset, AssetState } from "./assets/assetTypes";
import { INITIAL_MOCK_ASSETS } from "./assets/mockAssets";

export type { Asset };

export const useAssetStore = create<AssetState & {
  setSearchQuery: (q: string) => void; setStatusFilter: (s: string) => void;
  setCategoryFilter: (c: string) => void; addAsset: (a: Asset) => void;
  updateAsset: (id: string, a: Partial<Asset>) => void; deleteAsset: (id: string) => void;
}>((set) => ({
  assets: INITIAL_MOCK_ASSETS, searchQuery: "", statusFilter: "ALL", categoryFilter: "ALL",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  addAsset: (asset) => set((s) => ({ assets: [asset, ...s.assets] })),
  updateAsset: (id, a) => set((s) => ({ assets: s.assets.map((x) => x.id === id ? { ...x, ...a } : x) })),
  deleteAsset: (id) => set((s) => ({ assets: s.assets.filter((x) => x.id !== id) })),
}));
`);

// -------------------------------------------------------------
// 3. ATS ANALYSIS STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/atsAnalysis/analysisTypes.ts'), `
import type { ATSAnalysisResult, ParsedResumeData } from "@/utils/atsScoringEngine";

export interface ATSAnalysisState {
  currentResume: ParsedResumeData | null; currentReport: ATSAnalysisResult | null;
  history: ATSAnalysisResult[]; isAnalyzing: boolean; selectedJobTitle: string; jobDescription: string;
}
`);

writeStrict(path.join(root, 'src/stores/atsAnalysisStore.ts'), `
import { create } from "zustand";
import type { ATSAnalysisResult, ParsedResumeData } from "@/utils/atsScoringEngine";
import type { ATSAnalysisState } from "./atsAnalysis/analysisTypes";

export const useATSAnalysisStore = create<ATSAnalysisState & {
  setCurrentResume: (r: ParsedResumeData | null) => void;
  setCurrentReport: (rep: ATSAnalysisResult | null) => void;
  setIsAnalyzing: (a: boolean) => void; setSelectedJobTitle: (t: string) => void;
  setJobDescription: (d: string) => void; addReportToHistory: (rep: ATSAnalysisResult) => void;
  clearAnalysis: () => void;
}>((set) => ({
  currentResume: null, currentReport: null, history: [], isAnalyzing: false,
  selectedJobTitle: "Senior Full Stack Engineer", jobDescription: "",
  setCurrentResume: (currentResume) => set({ currentResume }),
  setCurrentReport: (currentReport) => set({ currentReport }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setSelectedJobTitle: (selectedJobTitle) => set({ selectedJobTitle }),
  setJobDescription: (jobDescription) => set({ jobDescription }),
  addReportToHistory: (r) => set((s) => ({ history: [r, ...s.history] })),
  clearAnalysis: () => set({ currentResume: null, currentReport: null }),
}));
`);

// -------------------------------------------------------------
// 4. CANDIDATE STORE & DEPARTMENT STORE
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/candidates/candidateStoreTypes.ts'), `
import type { Candidate } from "@/types/ats";

export interface CandidateStoreState {
  candidates: Candidate[]; selectedCandidate: Candidate | null;
  searchQuery: string; stageFilter: string;
}
`);

writeStrict(path.join(root, 'src/stores/candidateStore.ts'), `
import { create } from "zustand";
import type { Candidate } from "@/types/ats";
import type { CandidateStoreState } from "./candidates/candidateStoreTypes";

export const useCandidateStore = create<CandidateStoreState & {
  setCandidates: (c: Candidate[]) => void; setSelectedCandidate: (c: Candidate | null) => void;
  setSearchQuery: (q: string) => void; setStageFilter: (s: string) => void;
  updateCandidateStage: (id: string, stage: any) => void;
}>((set) => ({
  candidates: [], selectedCandidate: null, searchQuery: "", stageFilter: "ALL",
  setCandidates: (candidates) => set({ candidates }),
  setSelectedCandidate: (selectedCandidate) => set({ selectedCandidate }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setStageFilter: (stageFilter) => set({ stageFilter }),
  updateCandidateStage: (id, stage) => set((s) => ({
    candidates: s.candidates.map((c) => c.id === id ? { ...c, stage } : c)
  })),
}));
`);

writeStrict(path.join(root, 'src/stores/departments/deptTypes.ts'), `
import type { Department } from "@/types/hr";

export interface DepartmentStoreState {
  departments: Department[]; selectedDept: Department | null; searchQuery: string;
}
`);

writeStrict(path.join(root, 'src/stores/departmentStore.ts'), `
import { create } from "zustand";
import type { Department } from "@/types/hr";
import type { DepartmentStoreState } from "./departments/deptTypes";

export const useDepartmentStore = create<DepartmentStoreState & {
  setDepartments: (d: Department[]) => void; setSelectedDept: (d: Department | null) => void;
  setSearchQuery: (q: string) => void; addDepartment: (d: Department) => void;
  updateDepartment: (id: string, d: Partial<Department>) => void;
}>((set) => ({
  departments: [], selectedDept: null, searchQuery: "",
  setDepartments: (departments) => set({ departments }),
  setSelectedDept: (selectedDept) => set({ selectedDept }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addDepartment: (dept) => set((s) => ({ departments: [...s.departments, dept] })),
  updateDepartment: (id, d) => set((s) => ({ departments: s.departments.map((x) => x.id === id ? { ...x, ...d } : x) })),
}));
`);

// -------------------------------------------------------------
// 5. DOCUMENT, EMPLOYEE, HELPDESK, LEAVE, TIMELINE STORES
// -------------------------------------------------------------
writeStrict(path.join(root, 'src/stores/documentStore.ts'), `
import { create } from "zustand";
import type { DocItem } from "@/types/hr";

export const useDocumentStore = create<{
  documents: DocItem[]; categoryFilter: string; searchQuery: string;
  setCategoryFilter: (c: string) => void; setSearchQuery: (q: string) => void;
  addDocument: (d: DocItem) => void; deleteDocument: (id: string) => void;
}>((set) => ({
  documents: [], categoryFilter: "ALL", searchQuery: "",
  setCategoryFilter: (categoryFilter) => set({ categoryFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addDocument: (d) => set((s) => ({ documents: [d, ...s.documents] })),
  deleteDocument: (id) => set((s) => ({ documents: s.documents.filter((x) => x.id !== id) })),
}));
`);

writeStrict(path.join(root, 'src/stores/employeeStore.ts'), `
import { create } from "zustand";
import type { Employee } from "@/types/hr";

export const useEmployeeStore = create<{
  employees: Employee[]; selectedEmployee: Employee | null; searchQuery: string;
  departmentFilter: string; setEmployees: (e: Employee[]) => void;
  setSelectedEmployee: (e: Employee | null) => void; setSearchQuery: (q: string) => void;
  setDepartmentFilter: (d: string) => void; addEmployee: (e: Employee) => void;
  updateEmployee: (id: string, e: Partial<Employee>) => void;
}>((set) => ({
  employees: [], selectedEmployee: null, searchQuery: "", departmentFilter: "ALL",
  setEmployees: (employees) => set({ employees }),
  setSelectedEmployee: (selectedEmployee) => set({ selectedEmployee }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDepartmentFilter: (departmentFilter) => set({ departmentFilter }),
  addEmployee: (emp) => set((s) => ({ employees: [emp, ...s.employees] })),
  updateEmployee: (id, e) => set((s) => ({ employees: s.employees.map((x) => x.id === id ? { ...x, ...e } : x) })),
}));
`);

writeStrict(path.join(root, 'src/stores/helpdeskStore.ts'), `
import { create } from "zustand";

export interface HelpdeskTicket { id: string; subject: string; category: string; priority: "Low" | "Medium" | "High" | "Urgent"; status: "Open" | "In Progress" | "Resolved" | "Closed"; employeeId: string; employeeName: string; createdAt: string; }
export const useHelpdeskStore = create<{
  tickets: HelpdeskTicket[]; statusFilter: string; searchQuery: string;
  setStatusFilter: (s: string) => void; setSearchQuery: (q: string) => void;
  addTicket: (t: HelpdeskTicket) => void; updateTicketStatus: (id: string, s: HelpdeskTicket["status"]) => void;
}>((set) => ({
  tickets: [], statusFilter: "ALL", searchQuery: "",
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addTicket: (t) => set((s) => ({ tickets: [t, ...s.tickets] })),
  updateTicketStatus: (id, status) => set((s) => ({ tickets: s.tickets.map((t) => t.id === id ? { ...t, status } : t) })),
}));
`);

writeStrict(path.join(root, 'src/stores/leaveStore.ts'), `
import { create } from "zustand";
import type { LeaveRequest } from "@/types/hr";

export const useLeaveStore = create<{
  leaveRequests: LeaveRequest[]; statusFilter: string; searchQuery: string;
  setStatusFilter: (s: string) => void; setSearchQuery: (q: string) => void;
  addLeaveRequest: (r: LeaveRequest) => void; updateLeaveStatus: (id: string, s: LeaveRequest["status"]) => void;
}>((set) => ({
  leaveRequests: [], statusFilter: "ALL", searchQuery: "",
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  addLeaveRequest: (r) => set((s) => ({ leaveRequests: [r, ...s.leaveRequests] })),
  updateLeaveStatus: (id, status) => set((s) => ({ leaveRequests: s.leaveRequests.map((r) => r.id === id ? { ...r, status } : r) })),
}));
`);

writeStrict(path.join(root, 'src/stores/timelineStore.ts'), `
import { create } from "zustand";
import type { TimelineEvent } from "@/utils/timelineEngine";

export const useTimelineStore = create<{
  events: TimelineEvent[]; activeCategory: string;
  setActiveCategory: (c: string) => void; addEvent: (e: TimelineEvent) => void;
  setEvents: (e: TimelineEvent[]) => void;
}>((set) => ({
  events: [], activeCategory: "ALL",
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  addEvent: (e) => set((s) => ({ events: [e, ...s.events] })),
  setEvents: (events) => set({ events }),
}));
`);

console.log('Modularized Zustand Part 1 successfully!');
