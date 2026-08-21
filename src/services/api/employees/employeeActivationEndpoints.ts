import { baseApi } from "../baseApi";
import { Employee } from "@/types/hr";
import type { ActivateEmployeeResponse, ActivateEmployeePayload } from "./employeeApiTypes";

export const employeeActivationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvitation: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}/send-invitation`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw || { success: true },
    }),
    sendInvite: builder.mutation<{ success: boolean; message?: string }, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}/send-invite`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw || { success: true },
    }),
    deactivateEmployee: builder.mutation<Employee, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}/deactivate`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }, "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    activateEmployeeByAdmin: builder.mutation<Employee, string>({
      query: (id) => ({ url: `/api/v1/employees/${id}/activate-by-admin`, method: "POST" }),
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, id) => [{ type: "Employee", id }, { type: "Employee", id: "LIST" }, "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
    activateEmployee: builder.mutation<ActivateEmployeeResponse, ActivateEmployeePayload>({
      query: ({ id, employee_id, token, new_password, confirm_password }) => {
        const empId = id || employee_id;
        if (!empId || empId === "me") throw new Error("Employee UUID is required for password activation.");
        return { url: `/api/v1/employees/${empId}/activate`, method: "POST", body: { token, new_password, confirm_password } };
      },
      transformResponse: (raw: any) => raw?.data || raw,
      invalidatesTags: (_r, _e, arg) => [{ type: "Employee", id: arg.id || arg.employee_id }, { type: "Employee", id: "LIST" }, "SuperAdminOrganizations", "SuperAdminDashboard"],
    }),
  }),
});
export const { useSendInvitationMutation, useSendInviteMutation, useDeactivateEmployeeMutation, useActivateEmployeeByAdminMutation, useActivateEmployeeMutation } = employeeActivationApi;
