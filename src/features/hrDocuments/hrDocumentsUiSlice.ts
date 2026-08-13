import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DocumentStatus } from "./types";

export interface HrDocumentsUiState {
  activeCategory: string; // "ALL" or specific category code/label
  uploadModalOpen: boolean;
  selectedEmployeeId: string | null;
  documentFilters: {
    category?: string;
    status?: DocumentStatus | string;
    employeeId?: string;
    search?: string;
  };
  previewModal: {
    isOpen: boolean;
    title: string;
    htmlContent: string;
    docType?: string;
  };
}

const initialState: HrDocumentsUiState = {
  activeCategory: "ALL",
  uploadModalOpen: false,
  selectedEmployeeId: null,
  documentFilters: {
    category: undefined,
    status: undefined,
    employeeId: undefined,
    search: "",
  },
  previewModal: {
    isOpen: false,
    title: "",
    htmlContent: "",
    docType: undefined,
  },
};

export const hrDocumentsUiSlice = createSlice({
  name: "hrDocumentsUi",
  initialState,
  reducers: {
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
      if (action.payload !== "ALL") {
        state.documentFilters.category = action.payload;
      } else {
        delete state.documentFilters.category;
      }
    },
    setUploadModalOpen: (state, action: PayloadAction<boolean>) => {
      state.uploadModalOpen = action.payload;
    },
    setSelectedEmployeeId: (state, action: PayloadAction<string | null>) => {
      state.selectedEmployeeId = action.payload;
      if (action.payload) {
        state.documentFilters.employeeId = action.payload;
      } else {
        delete state.documentFilters.employeeId;
      }
    },
    setDocumentFilters: (
      state,
      action: PayloadAction<Partial<HrDocumentsUiState["documentFilters"]>>
    ) => {
      state.documentFilters = { ...state.documentFilters, ...action.payload };
    },
    resetDocumentFilters: (state) => {
      state.documentFilters = {
        category: state.activeCategory !== "ALL" ? state.activeCategory : undefined,
        status: undefined,
        employeeId: state.selectedEmployeeId || undefined,
        search: "",
      };
    },
    openPreviewModal: (
      state,
      action: PayloadAction<{ title: string; htmlContent: string; docType?: string }>
    ) => {
      state.previewModal = {
        isOpen: true,
        title: action.payload.title,
        htmlContent: action.payload.htmlContent,
        docType: action.payload.docType,
      };
    },
    closePreviewModal: (state) => {
      state.previewModal.isOpen = false;
      state.previewModal.htmlContent = "";
    },
  },
});

export const {
  setActiveCategory,
  setUploadModalOpen,
  setSelectedEmployeeId,
  setDocumentFilters,
  resetDocumentFilters,
  openPreviewModal,
  closePreviewModal,
} = hrDocumentsUiSlice.actions;

export default hrDocumentsUiSlice.reducer;
