import { COMMON_SKILLS } from "./skillsDictionary";

export function matchSkillsAndKeywords(candSkills: string[], jdLower: string, reqInput: string[] = []) {
  const reqSet = new Set<string>(reqInput);
  COMMON_SKILLS.forEach((s) => {
    if (new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i").test(jdLower)) reqSet.add(s);
  });
  const requiredSkills = Array.from(reqSet);
  if (requiredSkills.length === 0) requiredSkills.push("React", "TypeScript", "Node.js", "REST APIs", "Docker", "AWS", "Git", "SQL");
  const matchedSkills = requiredSkills.filter((r) => candSkills.some((c) => c.toLowerCase() === r.toLowerCase()));
  const missingSkills = requiredSkills.filter((r) => !candSkills.some((c) => c.toLowerCase() === r.toLowerCase()));
  const keyTerms = ["React", "TypeScript", "Node.js", "REST APIs", "Microservices", "Docker", "Kubernetes", "AWS", "CI/CD", "Agile", "SQL", "Git"];
  const matchedKeywords = keyTerms.filter((t) => candSkills.some((c) => c.toLowerCase() === t.toLowerCase()) || jdLower.includes(t.toLowerCase()));
  const missingKeywords = keyTerms.filter((t) => !matchedKeywords.includes(t));
  return { requiredSkills, matchedSkills, missingSkills, matchedKeywords, missingKeywords };
}
