import { baseApi } from "../baseApi";
import { ConnectNotification } from "@/types/connect";
import { normalizeConnectNotification } from "./normalizeConnectNotification";
import { extractListFromEnvelope } from "./extractListHelper";

export const connectNotificationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query<ConnectNotification[], void>({ query: () => "/api/v1/connect/notifications", transformResponse: (r: any): ConnectNotification[] => extractListFromEnvelope(r, ["notifications"]).map(normalizeConnectNotification), providesTags: ["ConnectNotifications"] }),
    markNotificationRead: builder.mutation<void, string>({ query: (id) => ({ url: `/api/v1/connect/notifications/${id}/read`, method: "PUT" }), invalidatesTags: ["ConnectNotifications"] }),
    markAllNotificationsRead: builder.mutation<void, void>({ query: () => ({ url: "/api/v1/connect/notifications/read-all", method: "PUT" }), invalidatesTags: ["ConnectNotifications"] }),
    clearNotifications: builder.mutation<void, void>({ query: () => ({ url: "/api/v1/connect/notifications/clear-all", method: "DELETE" }), invalidatesTags: ["ConnectNotifications"] }),
  }),
});
export const {
  useGetNotificationsQuery, useGetNotificationsQuery: useGetConnectNotificationsQuery,
  useMarkNotificationReadMutation, useMarkAllNotificationsReadMutation, useClearNotificationsMutation,
  useClearNotificationsMutation: useClearAllNotificationsMutation,
} = connectNotificationsApi;
