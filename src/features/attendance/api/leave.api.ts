import { api } from "@/api/client";

export interface LeaveBalance {
  leaveType: string;
  total: number;
  used: number;
  remaining: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName?: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  appliedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewComments?: string;
}

export interface ApplyLeaveRequest {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  isHalfDay?: boolean;
  halfDaySession?: "morning" | "afternoon";
}

export interface ReviewLeaveRequest {
  leaveId: string;
  action: "approve" | "reject";
  comments?: string;
}

export interface LeavePolicy {
  id: string;
  name: string;
  leaveType: string;
  maxDays: number;
  carryForward: boolean;
  requiresApproval: boolean;
}

export const leaveApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLeaveBalances: builder.query<LeaveBalance[], void>({
      query: () => "/api/v1/leaves/balances",
      providesTags: ["Leave"],
    }),

    getLeaveBalancesByEmployee: builder.query<LeaveBalance[], string>({
      query: (employeeId) => `/api/v1/leaves/balances/${employeeId}`,
      providesTags: ["Leave"],
    }),

    applyLeave: builder.mutation<LeaveRequest, ApplyLeaveRequest>({
      query: (body) => ({
        url: "/api/v1/leaves/apply",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Leave", "Attendance"],
    }),

    getLeaveHistory: builder.query<LeaveRequest[], { employeeId?: string; status?: string }>({
      query: (params) => `/api/v1/leaves/history?${new URLSearchParams(params as Record<string, string>).toString()}`,
      providesTags: ["Leave"],
    }),

    getPendingLeaves: builder.query<LeaveRequest[], void>({
      query: () => "/api/v1/leaves/pending",
      providesTags: ["Leave"],
    }),

    reviewLeave: builder.mutation<LeaveRequest, ReviewLeaveRequest>({
      query: ({ leaveId, action, comments }) => ({
        url: `/api/v1/leaves/${leaveId}/review`,
        method: "POST",
        body: { action, comments },
      }),
      invalidatesTags: ["Leave", "Attendance"],
    }),

    cancelLeave: builder.mutation<{ success: boolean }, string>({
      query: (leaveId) => ({
        url: `/api/v1/leaves/${leaveId}/cancel`,
        method: "POST",
      }),
      invalidatesTags: ["Leave"],
    }),

    getLeavePolicies: builder.query<LeavePolicy[], void>({
      query: () => "/api/v1/leaves/policies",
      providesTags: ["Leave"],
    }),

    getLeaveTypes: builder.query<string[], void>({
      query: () => "/api/v1/leaves/types",
      providesTags: ["Leave"],
    }),
  }),
});

export const {
  useGetLeaveBalancesQuery,
  useGetLeaveBalancesByEmployeeQuery,
  useApplyLeaveMutation,
  useGetLeaveHistoryQuery,
  useGetPendingLeavesQuery,
  useReviewLeaveMutation,
  useCancelLeaveMutation,
  useGetLeavePoliciesQuery,
  useGetLeaveTypesQuery,
} = leaveApi;

export type {
  LeaveBalance,
  LeaveRequest,
  ApplyLeaveRequest,
  ReviewLeaveRequest,
  LeavePolicy,
};