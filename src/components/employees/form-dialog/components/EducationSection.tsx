import type { EducationItem } from "@/types/hr";
import { EducationSectionHeader } from "./EducationSectionHeader";
import { EducationCardItem } from "./EducationCardItem";

export function EducationSection({ education, setEducation }: { education: EducationItem[]; setEducation: React.Dispatch<React.SetStateAction<EducationItem[]>> }) {
  const handleAdd = () => setEducation([...education, { id: String(Date.now()), degree: "", institution: "" }]);
  const handleUpdate = (updated: EducationItem) => setEducation(education.map((e) => (e.id === updated.id ? updated : e)));
  const handleRemove = (id: string) => setEducation(education.filter((e) => e.id !== id));
  return (
    <div className="space-y-4">
      <EducationSectionHeader onAdd={handleAdd} />
      {education.map((edu) => (
        <EducationCardItem key={edu.id} edu={edu} onUpdate={handleUpdate} onRemove={() => handleRemove(edu.id)} />
      ))}
    </div>
  );
}
