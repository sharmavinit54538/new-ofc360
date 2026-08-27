import { clearStoredAuth } from "./tokenValidators";

export const clearLegacyAuthStorage = (): void => {
  clearStoredAuth();
};

