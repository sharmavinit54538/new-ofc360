import { combineReducers } from "@reduxjs/toolkit";
import { baseApi } from "@/services/api/baseApi";
import { coreReducers } from "./coreReducers";
import { connectReducers } from "./connectReducers";

export const rootReducer = combineReducers({
  ...coreReducers,
  ...connectReducers,
  [baseApi.reducerPath]: baseApi.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;