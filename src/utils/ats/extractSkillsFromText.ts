import { COMMON_SKILLS } from "./skillsDictionary";

export function extractSkillsFromText(text: string) {
  const extractedSkills: string[] = [];
  COMMON_SKILLS.forEach((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b${escaped}\\b`, "i").test(text)) extractedSkills.push(skill);
  });
  if (extractedSkills.length === 0) extractedSkills.push("React", "TypeScript", "Node.js", "REST APIs", "Git", "Agile", "SQL");
  const softList = ["Leadership", "Communication", "Problem Solving", "Teamwork", "Agile", "Project Management", "Cross-Functional"];
  const softSkills = extractedSkills.filter((s) => softList.includes(s));
  const technicalSkills = extractedSkills.filter((s) => !softList.includes(s));
  return { extractedSkills, technicalSkills, softSkills: softSkills.length > 0 ? softSkills : ["Problem Solving", "Teamwork", "Agile"] };
}
