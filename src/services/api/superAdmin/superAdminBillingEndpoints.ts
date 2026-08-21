import { baseApi } from "../baseApi";
import { store } from "@/app/store";
import { SuperAdminSubscription, SuperAdminPlan, SuperAdminPayment } from "@/types/superAdmin.types";

export const superAdminBillingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSubscriptions: builder.query<SuperAdminSubscription[], void>({ query: () => "/api/v1/super-admin/subscriptions", providesTags: ["SuperAdminSubscriptions"] }),
    getSuperAdminSubscriptions: builder.query<SuperAdminSubscription[], void>({ query: () => "/api/v1/super-admin/subscriptions", providesTags: ["SuperAdminSubscriptions"] }),
    getSuperAdminSubscriptionDetail: builder.query<any, string>({ query: (id) => `/api/v1/super-admin/subscriptions/${id}`, providesTags: (_res, _err, id) => [{ type: "SuperAdminSubscriptions", id }] }),
    updateSuperAdminSubscription: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<SuperAdminSubscription> }>({
      query: ({ id, data }) => ({ url: `/api/v1/super-admin/subscriptions/${id}`, method: "PATCH", body: data }),
      invalidatesTags: ["SuperAdminSubscriptions", "SuperAdminDashboard", "SuperAdminOrganizations"],
    }),
    getSuperAdminPlans: builder.query<SuperAdminPlan[], void>({ query: () => "/api/v1/super-admin/plans" }),
    createSuperAdminPlan: builder.mutation<{ success: boolean; message: string }, Partial<SuperAdminPlan>>({ query: (body) => ({ url: "/api/v1/super-admin/plans", method: "POST", body }) }),
    updateSuperAdminPlan: builder.mutation<{ success: boolean; message: string }, { id: string; data: Partial<SuperAdminPlan> }>({ query: ({ id, data }) => ({ url: `/api/v1/super-admin/plans/${id}`, method: "PATCH", body: data }) }),
    deleteSuperAdminPlan: builder.mutation<{ success: boolean; message: string }, string>({ query: (id) => ({ url: `/api/v1/super-admin/plans/${id}`, method: "DELETE" }) }),
    getSuperAdminEntitlements: builder.query<Record<string, boolean>, void>({ query: () => "/api/v1/super-admin/entitlements" }),
    updateSuperAdminEntitlements: builder.mutation<{ success: boolean; message: string }, Record<string, boolean>>({ query: (body) => ({ url: "/api/v1/super-admin/entitlements", method: "PUT", body }) }),
    getSuperAdminBilling: builder.query<SuperAdminPayment[], void>({ query: () => "/api/v1/super-admin/billing" }),
    getSuperAdminPayments: builder.query<SuperAdminPayment[], void>({ query: () => "/api/v1/super-admin/payments" }),
  }),
});
export const {
  useGetSubscriptionsQuery, useGetSuperAdminSubscriptionsQuery, useGetSuperAdminSubscriptionDetailQuery,
  useUpdateSuperAdminSubscriptionMutation, useGetSuperAdminPlansQuery, useCreateSuperAdminPlanMutation,
  useUpdateSuperAdminPlanMutation, useDeleteSuperAdminPlanMutation, useGetSuperAdminEntitlementsQuery,
  useUpdateSuperAdminEntitlementsMutation, useGetSuperAdminBillingQuery, useGetSuperAdminPaymentsQuery,
} = superAdminBillingApi;
export const getSubscriptions = async (): Promise<SuperAdminSubscription[]> => store.dispatch(superAdminBillingApi.endpoints.getSuperAdminSubscriptions.initiate()).unwrap();
export const getSubscription = async (id: string): Promise<any> => store.dispatch(superAdminBillingApi.endpoints.getSuperAdminSubscriptionDetail.initiate(id)).unwrap();
export const getPlans = async (): Promise<SuperAdminPlan[]> => store.dispatch(superAdminBillingApi.endpoints.getSuperAdminPlans.initiate()).unwrap();
export const createPlan = async (data: Partial<SuperAdminPlan>): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminBillingApi.endpoints.createSuperAdminPlan.initiate(data)).unwrap();
export const updatePlan = async (id: string, data: Partial<SuperAdminPlan>): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminBillingApi.endpoints.updateSuperAdminPlan.initiate({ id, data })).unwrap();
export const getEntitlements = async (): Promise<Record<string, boolean>> => store.dispatch(superAdminBillingApi.endpoints.getSuperAdminEntitlements.initiate()).unwrap();
export const updateEntitlements = async (data: Record<string, boolean>): Promise<{ success: boolean; message: string }> => store.dispatch(superAdminBillingApi.endpoints.updateSuperAdminEntitlements.initiate(data)).unwrap();
export const getBilling = async (): Promise<SuperAdminPayment[]> => store.dispatch(superAdminBillingApi.endpoints.getSuperAdminBilling.initiate()).unwrap();
export const getPayments = async (): Promise<SuperAdminPayment[]> => store.dispatch(superAdminBillingApi.endpoints.getSuperAdminPayments.initiate()).unwrap();
