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

export const hasStoredAuthToken = (): boolean => {
  return Boolean(getStoredAccessToken() || getStoredRefreshToken());
};
