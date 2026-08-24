import React from "react";
import { useDispatch } from "react-redux";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveEmployeeStep1Mutation } from "../employeeOnboardingApi";
import { setCurrentWizardStep } from "../onboardingUiSlice";

interface Step1PersonalInfoProps {
  formData: {
    first_name: string;
    middle_name: string;
    last_name: string;
    date_of_birth: string;
    gender: string;
    marital_status: string;
    blood_group: string;
    nationality: string;
    father_name: string;
    mother_name: string;
    spouse_name: string;
    personal_email: string;
    phone: string;
    current_address_line1: string;
    current_address_line2: string;
    current_city: string;
    current_state: string;
    current_country: string;
    current_pincode: string;
    permanent_address_line1: string;
    permanent_address_line2: string;
    permanent_city: string;
    permanent_state: string;
    permanent_country: string;
    permanent_pincode: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof Step1PersonalInfoProps.formData>>;
  isLoading: boolean;
}

export function Step1PersonalInfo({ formData, setFormData, isLoading }: Step1PersonalInfoProps) {
  const dispatch = useDispatch();
  const [saveStep1] = useSaveEmployeeStep1Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep1(formData).unwrap();
      dispatch(setCurrentWizardStep(2));
    } catch (err) {
      console.error("Failed to save step 1:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <User className="w-5 h-5 text-violet-400" /> Step 1: Personal & Contact Information
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">First Name *</Label>
          <Input
            required
            value={formData.first_name}
            onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Middle Name</Label>
          <Input
            value={formData.middle_name}
            onChange={(e) => setFormData({ ...formData, middle_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Last Name *</Label>
          <Input
            required
            value={formData.last_name}
            onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth *</Label>
          <Input
            type="date"
            required
            value={formData.date_of_birth}
            onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Gender</Label>
          <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
            <SelectTrigger className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 h-10">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Marital Status</Label>
          <Select value={formData.marital_status} onValueChange={(v) => setFormData({ ...formData, marital_status: v })}>
            <SelectTrigger className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 h-10">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="married">Married</SelectItem>
              <SelectItem value="divorced">Divorced</SelectItem>
              <SelectItem value="widowed">Widowed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Blood Group</Label>
          <Select value={formData.blood_group} onValueChange={(v) => setFormData({ ...formData, blood_group: v })}>
            <SelectTrigger className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 h-10">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                <SelectItem key={bg} value={bg}>{bg}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Nationality</Label>
          <Input
            value={formData.nationality}
            onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Father's Name</Label>
          <Input
            value={formData.father_name}
            onChange={(e) => setFormData({ ...formData, father_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Mother's Name</Label>
          <Input
            value={formData.mother_name}
            onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Spouse Name</Label>
          <Input
            value={formData.spouse_name}
            onChange={(e) => setFormData({ ...formData, spouse_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Personal Email *</Label>
          <Input
            type="email"
            required
            value={formData.personal_email}
            onChange={(e) => setFormData({ ...formData, personal_email: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</Label>
          <Input
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 space-y-4">
        <h4 className="text-sm font-medium text-slate-300">Current Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label className="block text-xs font-medium text-slate-300 mb-1">Address Line 1 *</Label>
            <Input
              required
              value={formData.current_address_line1}
              onChange={(e) => setFormData({ ...formData, current_address_line1: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">Address Line 2</Label>
            <Input
              value={formData.current_address_line2}
              onChange={(e) => setFormData({ ...formData, current_address_line2: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">City *</Label>
            <Input
              required
              value={formData.current_city}
              onChange={(e) => setFormData({ ...formData, current_city: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">State *</Label>
            <Input
              required
              value={formData.current_state}
              onChange={(e) => setFormData({ ...formData, current_state: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">Country</Label>
            <Input
              value={formData.current_country}
              onChange={(e) => setFormData({ ...formData, current_country: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">Pincode *</Label>
            <Input
              required
              value={formData.current_pincode}
              onChange={(e) => setFormData({ ...formData, current_pincode: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-4 space-y-4">
        <h4 className="text-sm font-medium text-slate-300">Permanent Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Label className="block text-xs font-medium text-slate-300 mb-1">Address Line 1</Label>
            <Input
              value={formData.permanent_address_line1}
              onChange={(e) => setFormData({ ...formData, permanent_address_line1: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">Address Line 2</Label>
            <Input
              value={formData.permanent_address_line2}
              onChange={(e) => setFormData({ ...formData, permanent_address_line2: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">City</Label>
            <Input
              value={formData.permanent_city}
              onChange={(e) => setFormData({ ...formData, permanent_city: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">State</Label>
            <Input
              value={formData.permanent_state}
              onChange={(e) => setFormData({ ...formData, permanent_state: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">Country</Label>
            <Input
              value={formData.permanent_country}
              onChange={(e) => setFormData({ ...formData, permanent_country: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
          <div>
            <Label className="block text-xs font-medium text-slate-300 mb-1">Pincode</Label>
            <Input
              value={formData.permanent_pincode}
              onChange={(e) => setFormData({ ...formData, permanent_pincode: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-800">
        <Button
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
        >
          Save & Continue
        </Button>
      </div>
    </form>
  );
}