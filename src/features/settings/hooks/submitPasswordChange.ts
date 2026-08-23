import { toast } from "sonner";
import { normalizeError } from "@/services/api/normalizeError";
import type { PasswordFormData } from "../types/passwordTypes";

export async function submitPasswordChange(data: PasswordFormData, mutate: any, reset: () => void) {
  if (!data.currentPassword) return toast.error("Please enter your current password.");
  if (data.newPassword.length < 8) return toast.error("New password must be at least 8 characters.");
  if (data.newPassword !== data.confirmPassword) return toast.error("Passwords do not match.");
  try {
    await mutate({ oldPassword: data.currentPassword, newPassword: data.newPassword }).unwrap();
    toast.success("Password updated!");
    reset();
  } catch (err) {
    toast.error(normalizeError(err).message);
  }
}
