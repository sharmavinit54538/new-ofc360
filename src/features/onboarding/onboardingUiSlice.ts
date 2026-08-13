import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { OnboardingAPIResponse } from "./types";

export interface OnboardingUiState {
  wizardType: "company" | "employee";
  currentWizardStep: number;
  formDraft: Record<string, any>;
  pendingRedirectStep: number | null;
}

const initialState: OnboardingUiState = {
  wizardType: "company",
  currentWizardStep: 1,
  formDraft: {},
  pendingRedirectStep: null,
};

export const onboardingUiSlice = createSlice({
  name: "onboardingUi",
  initialState,
  reducers: {
    setWizardType: (state, action: PayloadAction<"company" | "employee">) => {
      state.wizardType = action.payload;
      state.currentWizardStep = 1;
      state.formDraft = {};
      state.pendingRedirectStep = null;
    },
    setCurrentWizardStep: (state, action: PayloadAction<number>) => {
      state.currentWizardStep = action.payload;
    },
    updateFormDraft: (state, action: PayloadAction<Record<string, any>>) => {
      state.formDraft = { ...state.formDraft, ...action.payload };
    },
    setFormDraft: (state, action: PayloadAction<Record<string, any>>) => {
      state.formDraft = action.payload;
    },
    clearFormDraft: (state) => {
      state.formDraft = {};
    },
    setPendingRedirectStep: (state, action: PayloadAction<number | null>) => {
      state.pendingRedirectStep = action.payload;
    },
    clearPendingRedirectStep: (state) => {
      state.pendingRedirectStep = null;
    },
  },
});

export const {
  setWizardType,
  setCurrentWizardStep,
  updateFormDraft,
  setFormDraft,
  clearFormDraft,
  setPendingRedirectStep,
  clearPendingRedirectStep,
} = onboardingUiSlice.actions;

/**
 * Shared helper to handle redirect_step from mutation responses.
 * When a mutation response includes a non-null redirect_step (on 400/409 step-ordering violations),
 * this dispatches setPendingRedirectStep to jump the wizard to that step.
 */
export function handleOnboardingRedirect(
  response: OnboardingAPIResponse<any> | any,
  dispatch: any
) {
  if (!response) return;
  const redirectStep =
    response.redirect_step !== undefined
      ? response.redirect_step
      : response.data?.redirect_step;

  if (redirectStep != null && typeof redirectStep === "number") {
    dispatch(setPendingRedirectStep(redirectStep));
  }
}

export default onboardingUiSlice.reducer;
