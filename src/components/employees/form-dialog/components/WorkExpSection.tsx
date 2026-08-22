import type { WorkExperienceItem } from "@/types/hr";
import { WorkExpSectionHeader } from "./WorkExpSectionHeader";
import { WorkExpCardItem } from "./WorkExpCardItem";

export function WorkExpSection({ workExperience, setWorkExperience }: { workExperience: WorkExperienceItem[]; setWorkExperience: React.Dispatch<React.SetStateAction<WorkExperienceItem[]>> }) {
  const handleAdd = () => setWorkExperience([...workExperience, { id: String(Date.now()), companyName: "", designation: "", employmentType: "FULL_TIME", startDate: "2022-01-01" }]);
  const handleUpdate = (updated: WorkExperienceItem) => setWorkExperience(workExperience.map((item) => (item.id === updated.id ? updated : item)));
  const handleRemove = (id: string) => setWorkExperience(workExperience.filter((e) => e.id !== id));
  return (
    <div className="space-y-4">
      <WorkExpSectionHeader onAdd={handleAdd} />
      {workExperience.map((exp) => (
        <WorkExpCardItem key={exp.id} exp={exp} onUpdate={handleUpdate} onRemove={() => handleRemove(exp.id)} />
      ))}
    </div>
  );
}
