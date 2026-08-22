import type { SkillItem } from "@/types/hr";
import { SkillsSectionHeader } from "./SkillsSectionHeader";
import { SkillCardItem } from "./SkillCardItem";

export function SkillsSection({ skills, setSkills }: { skills: SkillItem[]; setSkills: React.Dispatch<React.SetStateAction<SkillItem[]>> }) {
  const handleAdd = () => setSkills([...skills, { id: String(Date.now()), name: "", proficiency: "Intermediate", years: 2 }]);
  const handleUpdate = (updated: SkillItem) => setSkills(skills.map((s) => (s.id === updated.id ? updated : s)));
  const handleRemove = (id: string) => setSkills(skills.filter((s) => s.id !== id));
  return (
    <div className="space-y-4">
      <SkillsSectionHeader onAdd={handleAdd} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {skills.map((skill) => (
          <SkillCardItem key={skill.id} skill={skill} onUpdate={handleUpdate} onRemove={() => handleRemove(skill.id)} />
        ))}
      </div>
    </div>
  );
}
