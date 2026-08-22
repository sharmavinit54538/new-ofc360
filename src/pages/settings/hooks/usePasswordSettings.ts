import { useState } from "react";
import { toast } from "sonner";
import { useChangePasswordMutation } from "@/api/endpoints/auth";
import { normalizeError } from "@/services/api/normalizeError";
import type { PasswordFormData } from "../types/passwordTypes";

export function usePasswordSettings() {
  const [passData, setPassData] = useState<PasswordFormData>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passData.currentPassword) return toast.error("Please enter your current password.");
    if (passData.newPassword.length < 8) return toast.error("New password must be at least 8 characters long.");
    if (passData.newPassword !== passData.confirmPassword) return toast.error("New password and confirm password do not match.");
    try {
      await changePassword({ oldPassword: passData.currentPassword, newPassword: passData.newPassword }).unwrap();
      toast.success("Security credentials and password updated successfully!");
      setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(normalizeError(err).message);
    }
  };

  return { passData, setPassData, isChangingPassword, handleUpdatePassword };
}
