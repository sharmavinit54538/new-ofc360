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
