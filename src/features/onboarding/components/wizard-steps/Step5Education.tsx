import React from "react";
import { useDispatch } from "react-redux";
import { GraduationCap, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveEmployeeStep5Mutation } from "../employeeOnboardingApi";
import { setCurrentWizardStep } from "../onboardingUiSlice";

interface Step5EducationProps {
  formData: {
    highest_qualification: string;
    institution_name: string;
    year_of_passing: string;
    field_of_study: string;
    grade_or_gpa: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof Step5EducationProps.formData>>;
  isLoading: boolean;
  onBack: () => void;
}

export function Step5Education({ formData, setFormData, isLoading, onBack }: Step5EducationProps) {
  const dispatch = useDispatch();
  const [saveStep5] = useSaveEmployeeStep5Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep5(formData).unwrap();
      dispatch(setCurrentWizardStep(6));
    } catch (err) {
      console.error("Failed to save step 5:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <GraduationCap className="w-5 h-5 text-violet-400" /> Step 5: Educational History
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Highest Qualification</Label>
          <Select value={formData.highest_qualification} onValueChange={(v) => setFormData({ ...formData, highest_qualification: v })}>
            <SelectTrigger className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 h-10">
              <SelectValue placeholder="Select qualification" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High School">High School</SelectItem>
              <SelectItem value="Associate's Degree">Associate's Degree</SelectItem>
              <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
              <SelectItem value="Master's Degree">Master's Degree</SelectItem>
              <SelectItem value="PhD">PhD</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Institution / University Name</Label>
          <Input
            value={formData.institution_name}
            onChange={(e) => setFormData({ ...formData, institution_name: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Year of Passing</Label>
          <Input
            value={formData.year_of_passing}
            onChange={(e) => setFormData({ ...formData, year_of_passing: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Field of Study</Label>
          <Input
            value={formData.field_of_study}
            onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Grade / GPA</Label>
          <Input
            value={formData.grade_or_gpa}
            onChange={(e) => setFormData({ ...formData, grade_or_gpa: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
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
          type="submit"
          disabled={isLoading}
          className="px-5 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm rounded-lg transition-all flex items-center gap-2"
        >
          Save & Continue <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}