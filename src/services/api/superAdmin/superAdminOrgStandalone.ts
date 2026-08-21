import { store } from "@/app/store";
import { SuperAdminOrganization, CreateOrganizationPayload, UpdateOrganizationPayload } from "@/types/superAdmin.types";
import { superAdminOrganizationsApi } from "./superAdminOrganizationsEndpoints";

export const getOrganizations = async (params?: { search?: string; status?: string; plan?: string; page?: number; page_size?: number }): Promise<SuperAdminOrganization[]> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.getSuperAdminOrganizations.initiate(params || undefined)).unwrap();

export const getOrganization = async (id: string): Promise<any> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.getSuperAdminOrganizationDetail.initiate(id)).unwrap();

export const createOrganization = async (data: CreateOrganizationPayload): Promise<SuperAdminOrganization> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.createSuperAdminOrganization.initiate(data)).unwrap();

export const updateOrganization = async (id: string, data: UpdateOrganizationPayload): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.updateSuperAdminOrganization.initiate({ id, data })).unwrap();

export const grantOrganizationAccess = async (id: string, data?: { plan?: string }): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.grantOrganizationAccess.initiate({ id, plan: data?.plan })).unwrap();

export const extendOrganizationAccess = async (id: string, data?: { days?: number }): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.extendOrganizationAccess.initiate({ id, days: data?.days })).unwrap();

export const suspendOrganization = async (id: string, _data?: any): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.suspendOrganizationAccess.initiate(id)).unwrap();

export const cancelOrganization = async (id: string, _data?: any): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.cancelOrganizationAccess.initiate(id)).unwrap();

export const reactivateOrganization = async (id: string, _data?: any): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminOrganizationsApi.endpoints.reactivateOrganizationAccess.initiate(id)).unwrap();
