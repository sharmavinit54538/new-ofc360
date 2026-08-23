/**
 * Legacy barrel file — re-exports from the canonical company API.
 * New code should import directly from "@/features/company/api".
 */
export {
  companyApi,
  useGetCompanyQuery,
  useUpdateCompanyMutation,
  useGetCompanySettingsQuery,
  useUpdateCompanySettingsMutation,
  useGetDepartmentsQuery,
  useGetDepartmentByIdQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDesignationsQuery,
  useCreateDesignationMutation,
  useUpdateDesignationMutation,
  useDeleteDesignationMutation,
  useGetBranchesQuery,
  useCreateBranchMutation,
  useGetHolidaysQuery,
  useCreateHolidayMutation,
  useDeleteHolidayMutation,
} from "@/features/company/api";

export type {
  Company,
  CompanySettings,
  Department,
  Designation,
  Branch,
  Holiday,
} from "@/features/company/api";