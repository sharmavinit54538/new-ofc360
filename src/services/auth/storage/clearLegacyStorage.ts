export const clearLegacyAuthStorage = (): void => {
  try {
    const keys = [
      "ofc360_access_token", "ofc360_refresh_token", "ofc360_user",
      "accessToken", "refreshToken",
    ];
    keys.forEach((k) => {
      localStorage.removeItem(k);
      sessionStorage.removeItem(k);
    });
  } catch {
    // ignore
  }
};
