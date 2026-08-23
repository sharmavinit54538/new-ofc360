import { useState } from "react";
import { useChangePasswordMutation } from "@/api/endpoints/auth";
import type { PasswordFormData } from "../types/passwordTypes";
import { submitPasswordChange } from "./submitPasswordChange";

export function usePasswordSettings() {
  const [passData, setPassData] = useState<PasswordFormData>({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    submitPasswordChange(passData, changePassword, () => setPassData({ currentPassword: "", newPassword: "", confirmPassword: "" }));
  };

  return { passData, setPassData, isChangingPassword, handleUpdatePassword };
}