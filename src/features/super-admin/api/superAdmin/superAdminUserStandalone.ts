import { store } from "@/app/store";
import { SuperAdminUser, CreateUserPayload, UpdateUserPayload } from "@/types/superAdmin.types";
import { superAdminUsersApi } from "./superAdminUsersEndpoints";

export const getUsers = async (params?: { role?: string; status?: string; organization_id?: string; search?: string }): Promise<SuperAdminUser[]> =>
  store.dispatch(superAdminUsersApi.endpoints.getSuperAdminUsers.initiate(params || undefined)).unwrap();

export const createUser = async (data: CreateUserPayload): Promise<SuperAdminUser> =>
  store.dispatch(superAdminUsersApi.endpoints.createSuperAdminUser.initiate(data)).unwrap();

export const updateUser = async (id: string, data: UpdateUserPayload): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminUsersApi.endpoints.updateSuperAdminUser.initiate({ id, data })).unwrap();

export const deleteUser = async (id: string): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminUsersApi.endpoints.deleteSuperAdminUser.initiate(id)).unwrap();

export const activateUser = async (id: string): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminUsersApi.endpoints.activateSuperAdminUser.initiate(id)).unwrap();

export const deactivateUser = async (id: string): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminUsersApi.endpoints.deactivateSuperAdminUser.initiate(id)).unwrap();

export const resetUserPassword = async (id: string): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminUsersApi.endpoints.resetSuperAdminUserPassword.initiate(id)).unwrap();

export const getHRAdmins = async (params?: { search?: string; status?: string }): Promise<SuperAdminUser[]> =>
  store.dispatch(superAdminUsersApi.endpoints.getSuperAdminHRAdmins.initiate(params || undefined)).unwrap();

export const createHRAdmin = async (data: CreateUserPayload): Promise<SuperAdminUser> =>
  store.dispatch(superAdminUsersApi.endpoints.createSuperAdminHRAdmin.initiate(data)).unwrap();

export const updateHRAdmin = async (id: string, data: UpdateUserPayload): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminUsersApi.endpoints.updateSuperAdminHRAdmin.initiate({ id, data })).unwrap();

export const deleteHRAdmin = async (id: string): Promise<{ success: boolean; message: string }> =>
  store.dispatch(superAdminUsersApi.endpoints.deleteSuperAdminHRAdmin.initiate(id)).unwrap();
