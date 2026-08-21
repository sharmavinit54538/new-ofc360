import { CORE_TAGS } from "./tags/coreTags";
import { PAYROLL_TAGS } from "./tags/payrollTags";
import { RECRUITMENT_TAGS } from "./tags/recruitmentTags";
import { ONBOARDING_TAGS } from "./tags/onboardingTags";
import { REPORTS_TAGS } from "./tags/reportsTags";
import { CONNECT_TAGS } from "./tags/connectTags";
import { SUPER_ADMIN_TAGS } from "./tags/superAdminTags";
import { MISC_MODULE_TAGS } from "./tags/miscModuleTags";

export const API_TAGS = [
  ...CORE_TAGS, ...PAYROLL_TAGS, ...RECRUITMENT_TAGS, ...ONBOARDING_TAGS,
  ...REPORTS_TAGS, ...CONNECT_TAGS, ...SUPER_ADMIN_TAGS, ...MISC_MODULE_TAGS,
] as const;

export type ApiTagType = (typeof API_TAGS)[number];