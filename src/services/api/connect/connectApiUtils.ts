export const isCurrentUser = (val: any, u: any): boolean => {
  if (!val || !u) return false;
  const id = String(typeof val === "object" ? val.id || val.userId || val.user_id || "" : val || "").toLowerCase();
  const email = String(typeof val === "object" ? val.email || "" : val || "").toLowerCase();
  return Boolean((id && id === String(u.id || u._id || "").toLowerCase()) || (email && email === String(u.email || "").toLowerCase()));
};
