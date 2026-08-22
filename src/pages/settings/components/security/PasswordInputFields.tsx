import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PasswordFormData } from "../../types/passwordTypes";

export function PasswordInputFields({ passData, setPassData }: { passData: PasswordFormData; setPassData: (d: PasswordFormData) => void }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Current Password</Label><Input type="password" placeholder="Enter current account password" value={passData.currentPassword} onChange={(e) => setPassData({ ...passData, currentPassword: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">New Password</Label><Input type="password" placeholder="Enter new password (min. 8 characters)" value={passData.newPassword} onChange={(e) => setPassData({ ...passData, newPassword: e.target.value })} className="bg-secondary/30" /></div>
      <div className="space-y-1.5"><Label className="text-xs font-semibold">Confirm New Password</Label><Input type="password" placeholder="Re-enter new password to confirm" value={passData.confirmPassword} onChange={(e) => setPassData({ ...passData, confirmPassword: e.target.value })} className="bg-secondary/30" /></div>
    </div>
  );
}
