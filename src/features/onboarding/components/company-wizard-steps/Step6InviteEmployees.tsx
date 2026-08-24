import React from "react";
import { UserPlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface Invite {
  email: string;
  name: string;
  role: string;
  department: string;
}

interface Step6InviteEmployeesProps {
  invites: Invite[];
  setInvites: React.Dispatch<React.SetStateAction<Invite[]>>;
  inviteEmail: string;
  setInviteEmail: (email: string) => void;
  inviteName: string;
  setInviteName: (name: string) => void;
  departments: string[];
  isLoading: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export function Step6InviteEmployees({ invites, setInvites, inviteEmail, setInviteEmail, inviteName, setInviteName, departments, isLoading, onSubmit, onBack }: Step6InviteEmployeesProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <UserPlus className="w-5 h-5 text-indigo-400" /> Step 6: Bulk Invite Initial Team
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          placeholder="Full Name"
          value={inviteName}
          onChange={(e) => setInviteName(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
        />
        <div className="flex gap-2">
          <Input
            placeholder="Email address"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          />
          <Button
            type="button"
            onClick={() => {
              if (inviteEmail.trim()) {
                setInvites([
                  ...invites,
                  {
                    email: inviteEmail.trim(),
                    name: inviteName.trim() || "Team Member",
                    role: "Employee",
                    department: departments[0] || "General",
                  },
                ]);
                setInviteEmail("");
                setInviteName("");
              }
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Add
          </Button>
        </div>
      </div>

      <div className="divide-y divide-slate-800 border border-slate-800 rounded-xl overflow-hidden">
        {invites.map((inv, idx) => (
          <div
            key={idx}
            className="p-3 bg-slate-950/60 flex items-center justify-between"
          >
            <div>
              <div className="text-sm font-medium text-slate-200">
                {inv.name} ({inv.email})
              </div>
              <div className="text-xs text-slate-500">
                Role: {inv.role} • Dept: {inv.department}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setInvites(invites.filter((_, i) => i !== idx))}
              className="p-1 text-slate-500 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-between pt-4 border-t border-slate-800">
        <Button
          type="button"
          onClick={onBack}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
        >
          Save & Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}