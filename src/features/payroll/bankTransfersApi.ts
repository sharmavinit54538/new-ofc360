import { baseApi } from "@/services/api/baseApi";
export * from "./bank/bankQueries";
export * from "./bank/bankMutations";
export const bankTransfersApi = baseApi as any;