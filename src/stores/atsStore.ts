import { create } from "zustand";
import type { ATSDataCollections } from "./ats/atsTypes";
import { getInitialAtsData } from "./ats/atsDefaults";
import { createAtsActions } from "./ats/atsActions";

export type { ATSDataCollections as ATSState };

export const useATSStore = create<ATSDataCollections & any>((set, get) => ({
  ...getInitialAtsData(),
  ...createAtsActions(set, get),
}));