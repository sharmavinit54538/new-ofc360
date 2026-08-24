import React from "react";
import { useDispatch } from "react-redux";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSaveEmployeeStep7Mutation } from "../employeeOnboardingApi";
import { setCurrentWizardStep } from "../onboardingUiSlice";

interface Step7AdditionalProps {
  formData: {
    shirt_size: string;
    dietary_preference: string;
    bio: string;
    hobbies: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<typeof Step7AdditionalProps.formData>>;
  isLoading: boolean;
  onBack: () => void;
}

export function Step7Additional({ formData, setFormData, isLoading, onBack }: Step7AdditionalProps) {
  const dispatch = useDispatch();
  const [saveStep7] = useSaveEmployeeStep7Mutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveStep7(formData).unwrap();
      dispatch(setCurrentWizardStep(8));
    } catch (err) {
      console.error("Failed to save step 7:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-violet-400" /> Step 7: Additional Preferences
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Apparel / Shirt Size</Label>
          <Select value={formData.shirt_size} onValueChange={(v) => setFormData({ ...formData, shirt_size: v })}>
            <SelectTrigger className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 h-10">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="XS">XS</SelectItem>
              <SelectItem value="S">S</SelectItem>
              <SelectItem value="M">M</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="XL">XL</SelectItem>
              <SelectItem value="XXL">XXL</SelectItem>
              <SelectItem value="XXXL">XXXL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="block text-xs font-medium text-slate-300 mb-1">Dietary Preference</Label>
          <Select value={formData.dietary_preference} onValueChange={(v) => setFormData({ ...formData, dietary_preference: v })}>
            <SelectTrigger className="bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500 h-10">
              <SelectValue placeholder="Select preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Vegetarian">Vegetarian</SelectItem>
              <SelectItem value="Vegan">Vegan</SelectItem>
              <SelectItem value="Halal">Halal</SelectItem>
              <SelectItem value="Kosher">Kosher</SelectItem>
              <SelectItem value="Gluten-Free">Gluten-Free</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label className="block text-xs font-medium text-slate-300 mb-1">Bio / About Me</Label>
          <Input
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-200 focus:outline-none focus:border-violet-500"
          />
        </div>
        <div className="md:col-span-2">
          <Label className="block text-xs font-medium text-slate-300 mb-1">Hobbies & Interests</Label>
          <Input
            value={formData.hobbies}
            onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
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