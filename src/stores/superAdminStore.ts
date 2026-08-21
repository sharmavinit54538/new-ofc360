import { create } from "zustand";
import { createSuperAdminActions } from "./superAdmin/superAdminActions";

export type { PlatformCompany, PlatformUser, PlatformHRAdmin } from "./superAdmin/platformEntityTypes";
export type { PlatformOnboardingItem, SystemLogItem, PlatformSubscription, PlanConfig } from "./superAdmin/platformSystemTypes";

export const useSuperAdminStore = create<any>((set) => ({
  companies: [], users: [], hrAdmins: [],
  onboardingList: [], subscriptions: [], systemLogs: [], plans: [],
  ...createSuperAdminActions(set),
}));