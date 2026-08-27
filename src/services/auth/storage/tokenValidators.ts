export const isValidToken = (token: unknown): token is string => {
  return (
    typeof token === "string" &&
    token.trim().length > 10 &&
    token !== "undefined" &&
    token !== "null" &&
    token !== "[object Object]"
  );
};

export const isValidUUID = (id: unknown): id is string => {
  return (
    typeof id === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  );
};

export const getStoredAccessToken = (): string | null => {
  try {
    if (typeof window === "undefined") return null;
    const keys = [
      "ofc360_access_token",
      "accessToken",
      "access_token",
      "token",
      "jwt",
      "auth_token",
    ];
    for (const key of keys) {
      const val = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (isValidToken(val)) return val.trim();
    }
  } catch {
    // ignore
  }
  return null;
};

export const getStoredRefreshToken = (): string | null => {
  try {
    if (typeof window === "undefined") return null;
    const keys = [
      "ofc360_refresh_token",
      "refreshToken",
      "refresh_token",
    ];
    for (const key of keys) {
      const val = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (isValidToken(val)) return val.trim();
    }
  } catch {
    // ignore
  }
  return null;
};

export const getStoredUser = (): any | null => {
  try {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("ofc360_user") || sessionStorage.getItem("ofc360_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && (parsed.id || parsed.email)) {
      return parsed;
    }
  } catch {
    // ignore
  }
  return null;
};

export const getStoredCompanyId = (): string | null => {
  try {
    if (typeof window === "undefined") return null;
    const val = localStorage.getItem("ofc360_company_id") || sessionStorage.getItem("ofc360_company_id");
    if (val && typeof val === "string" && val.trim().length > 0) return val.trim();
  } catch {
    // ignore
  }
  return null;
};

export const setStoredAuth = (data: {
  token?: string | null;
  refreshToken?: string | null;
  user?: any | null;
  companyId?: string | null;
}): void => {
  try {
    if (typeof window === "undefined") return;
    if (isValidToken(data.token)) {
      localStorage.setItem("ofc360_access_token", data.token.trim());
    }
    if (isValidToken(data.refreshToken)) {
      localStorage.setItem("ofc360_refresh_token", data.refreshToken.trim());
    }
    if (data.user && typeof data.user === "object") {
      localStorage.setItem("ofc360_user", JSON.stringify(data.user));
    }
    if (data.companyId && typeof data.companyId === "string" && data.companyId.trim().length > 0) {
      localStorage.setItem("ofc360_company_id", data.companyId.trim());
    }
  } catch {
    // ignore storage quota errors
  }
};

export const clearStoredAuth = (): void => {
  try {
    if (typeof window === "undefined") return;
    const keys = [
      "ofc360_access_token",
      "ofc360_refresh_token",
      "ofc360_user",
      "ofc360_company_id",
      "accessToken",
      "refreshToken",
      "access_token",
      "refresh_token",
      "token",
      "jwt",
      "auth_token",
    ];
    for (const key of keys) {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    }
  } catch {
    // ignore
  }
};

export const hasStoredAuthToken = (): boolean => {
  return Boolean(getStoredAccessToken() || getStoredRefreshToken());
};

