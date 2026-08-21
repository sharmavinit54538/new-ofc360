export * from "./hrAdminOnboarding/normalizeHRAdminStatus";
export * from "./hrAdminOnboarding/hrAdminWizardEndpoints";
export * from "./hrAdminOnboarding/hrAdminWorkflowsEndpoints";
export * from "./hrAdminOnboarding/hrAdminNewHiresEndpoints";
export * from "./hrAdminOnboarding/hrAdminDocumentsEndpoints";
export * from "./hrAdminOnboarding/hrAdminTasksEndpoints";

import { hrAdminWizardApi } from "./hrAdminOnboarding/hrAdminWizardEndpoints";
import { hrAdminWorkflowsApi } from "./hrAdminOnboarding/hrAdminWorkflowsEndpoints";
import { hrAdminNewHiresApi } from "./hrAdminOnboarding/hrAdminNewHiresEndpoints";
import { hrAdminDocumentsApi } from "./hrAdminOnboarding/hrAdminDocumentsEndpoints";
import { hrAdminTasksApi } from "./hrAdminOnboarding/hrAdminTasksEndpoints";

export const hrAdminOnboardingApi = {
  ...hrAdminWizardApi,
  ...hrAdminWorkflowsApi,
  ...hrAdminNewHiresApi,
  ...hrAdminDocumentsApi,
  ...hrAdminTasksApi,
};