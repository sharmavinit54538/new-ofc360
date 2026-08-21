import type { ParsedResumeData } from "./types";
import { parseContactInfo } from "./parseContactInfo";
import { extractSkillsFromText } from "./extractSkillsFromText";

export function parseResumeContent(resumeText: string, fileName = "Resume.pdf"): ParsedResumeData {
  const text = resumeText.trim();
  const c = parseContactInfo(text);
  const { extractedSkills, technicalSkills, softSkills } = extractSkillsFromText(text);
  const expMatch = text.match(/(\d+(\.\d+)?)\+?\s*years?/i);
  const flags: string[] = [];
  if (!c.email || !c.phone) flags.push("Missing complete contact location or phone number.");
  if (fileName.toLowerCase().endsWith(".docx")) flags.push("DOCX format detected.");

  return {
    candidateName: c.name || "Candidate",
    email: c.email || "",
    phone: c.phone || "",
    location: c.location || "",
    summary: text.slice(0, 250) || "",
    extractedSkills,
    technicalSkills,
    softSkills,
    totalExperienceYears: expMatch ? parseFloat(expMatch[1]) || 0 : 0,
    workExperience: [],
    education: [],
    certifications: [],
    projects: [],
    formatHealth: {
      contactInfoComplete: !!(c.email && c.phone),
      hasSummary: text.length > 100,
      hasClearHeadings: true,
      fontReadabilityScore: 90,
      atsParsingHealth: (flags.length === 0 ? "Good" : "Warning") as any,
      formattingFlags: flags,
    },
  };
}