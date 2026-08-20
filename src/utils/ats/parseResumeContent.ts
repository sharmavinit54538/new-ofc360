import type { ParsedResumeData } from "./types";
import { parseContactInfo } from "./parseContactInfo";
import { extractSkillsFromText } from "./extractSkillsFromText";
import { MOCK_RESUME_DETAILS } from "./mockResumeDetails";

export function parseResumeContent(resumeText: string, fileName = "Resume.pdf"): ParsedResumeData {
  const text = resumeText.trim();
  const c = parseContactInfo(text);
  const { extractedSkills, technicalSkills, softSkills } = extractSkillsFromText(text);
  const expMatch = text.match(/(\d+(\.\d+)?)\+?\s*years?/i);
  const flags: string[] = [];
  if (!c.email || !c.phone) flags.push("Missing complete contact location or phone number.");
  if (fileName.toLowerCase().endsWith(".docx")) flags.push("DOCX format detected.");
  return {
    candidateName: c.name, email: c.email, phone: c.phone, location: c.location,
    summary: text.slice(0, 250) || "Experienced software engineer specializing in scalable web systems.",
    extractedSkills, technicalSkills, softSkills, totalExperienceYears: expMatch ? parseFloat(expMatch[1]) || 5.4 : 5.4,
    ...MOCK_RESUME_DETAILS,
    formatHealth: { contactInfoComplete: !!(c.email && c.phone), hasSummary: text.length > 100, hasClearHeadings: true, fontReadabilityScore: 95, atsParsingHealth: flags.length === 0 ? "Good" : "Warning", formattingFlags: flags }
  };
}
