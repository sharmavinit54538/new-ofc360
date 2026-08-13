import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RecruitmentModuleType, CandidateFilters } from "./types";
import { RootState } from "@/app/store";

interface RecruitmentUiState {
  activeModule: RecruitmentModuleType;
  kanbanDraggedCandidateId: string | null;
  candidateFilters: CandidateFilters;
  jobWizardStep: number;
}

const initialState: RecruitmentUiState = {
  activeModule: "Jobs Manager & AI Wizard",
  kanbanDraggedCandidateId: null,
  candidateFilters: {
    search: "",
    jobId: "",
    stage: "",
  },
  jobWizardStep: 1,
};

export const recruitmentUiSlice = createSlice({
  name: "recruitmentUi",
  initialState,
  reducers: {
    setActiveModule: (state, action: PayloadAction<RecruitmentModuleType>) => {
      state.activeModule = action.payload;
    },
    setKanbanDraggedCandidateId: (state, action: PayloadAction<string | null>) => {
      state.kanbanDraggedCandidateId = action.payload;
    },
    setCandidateFilters: (state, action: PayloadAction<Partial<CandidateFilters>>) => {
      state.candidateFilters = {
        ...state.candidateFilters,
        ...action.payload,
      };
    },
    resetCandidateFilters: (state) => {
      state.candidateFilters = initialState.candidateFilters;
    },
    setJobWizardStep: (state, action: PayloadAction<number>) => {
      state.jobWizardStep = action.payload;
    },
    resetJobWizardStep: (state) => {
      state.jobWizardStep = 1;
    },
  },
});

export const {
  setActiveModule,
  setKanbanDraggedCandidateId,
  setCandidateFilters,
  resetCandidateFilters,
  setJobWizardStep,
  resetJobWizardStep,
} = recruitmentUiSlice.actions;

export const selectActiveModule = (state: RootState) => state.recruitmentUi?.activeModule ?? "Jobs Manager & AI Wizard";
export const selectKanbanDraggedCandidateId = (state: RootState) => state.recruitmentUi?.kanbanDraggedCandidateId ?? null;
export const selectCandidateFilters = (state: RootState) => state.recruitmentUi?.candidateFilters ?? initialState.candidateFilters;
export const selectJobWizardStep = (state: RootState) => state.recruitmentUi?.jobWizardStep ?? 1;

export default recruitmentUiSlice.reducer;
