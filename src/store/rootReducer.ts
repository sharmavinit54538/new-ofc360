import { combineReducers } from "@reduxjs/toolkit";
import { api } from "@/api/client";
import { coreReducers } from "./coreReducers";
import { connectReducers } from "./connectReducers";

export const rootReducer = combineReducers({
  ...coreReducers,
  ...connectReducers,
  [api.reducerPath]: api.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;