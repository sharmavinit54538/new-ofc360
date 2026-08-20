import { create } from "zustand";
import { INITIAL_MOCK_COMPANIES } from "./superAdmin/mockPlatformData";
import { createSuperAdminActions } from "./superAdmin/superAdminActions";

export type { PlatformCompany, PlatformUser, PlatformHRAdmin } from "./superAdmin/platformEntityTypes";
export type { PlatformOnboardingItem, SystemLogItem, PlatformSubscription, PlanConfig } from "./superAdmin/platformSystemTypes";

export const useSuperAdminStore = create<any>((set) => ({
  companies: INITIAL_MOCK_COMPANIES, users: [], hrAdmins: [],
  onboardingList: [], subscriptions: [], systemLogs: [], plans: [],
  ...createSuperAdminActions(set),
}));