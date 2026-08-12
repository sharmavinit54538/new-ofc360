import { describe, it, expect, beforeEach } from "vitest";
import { parseResumeContent, analyzeResumeAgainstJob } from "../utils/atsScoringEngine";
import { useATSAnalysisStore } from "../stores/atsAnalysisStore";

describe("OFC360 Resume ATS Parsing & Scoring Engine", () => {
  const sampleResumeText = `
    Alex Turner
    Email: alex.turner@example.com | Phone: +1 (555) 234-5678 | San Francisco, CA
    Summary: Senior Fullstack Lead Engineer with 5.4 years of experience building scalable React, TypeScript, Node.js microservices, and AI integrations.
    
    Skills: React, TypeScript, Node.js, Express, Python, REST APIs, GraphQL, Redux, PostgreSQL, Docker, AWS, Git, CI/CD, System Design, Agile, Problem Solving.
    
    Work Experience:
    - Senior Fullstack Engineer | EquinoxSphere Systems (2023 - Present)
    - Frontend Software Engineer | Apex Global Tech (2021 - 2023)
    
    Education:
    - Bachelor of Science in Computer Science, California Institute of Technology (2021)
  `;

  describe("Resume Content Parsing", () => {
    it("extracts candidate contact details, skills, and total experience years", () => {
      const parsed = parseResumeContent(sampleResumeText, "Alex_Turner_CV.pdf");

      expect(parsed.candidateName).toBe("Alex Turner");
      expect(parsed.email).toBe("alex.turner@example.com");
      expect(parsed.phone).toBe("+1 (555) 234-5678");
      expect(parsed.location).toBe("San Francisco, CA");
      expect(parsed.extractedSkills).toContain("React");
      expect(parsed.extractedSkills).toContain("TypeScript");
      expect(parsed.extractedSkills).toContain("Node.js");
      expect(parsed.totalExperienceYears).toBe(5.4);
      expect(parsed.formatHealth.atsParsingHealth).toBe("Good");
    });
  });

  describe("Job Description Matching & ATS Scoring", () => {
    it("calculates weighted ATS score, matched skills, missing skills, and recruiter verdict", () => {
      const parsed = parseResumeContent(sampleResumeText, "Alex_Turner_CV.pdf");
      const result = analyzeResumeAgainstJob(
        parsed,
        "Senior AI & Fullstack Lead Engineer",
        "We are looking for a Senior Fullstack Engineer proficient in React, TypeScript, Node.js, REST APIs, Docker, and AWS with 5+ years of experience.",
        ["React", "TypeScript", "Node.js", "Docker", "AWS", "Kubernetes"],
        5
      );

      expect(result.overallScore).toBeGreaterThanOrEqual(75);
      expect(result.matchedSkills).toContain("React");
      expect(result.matchedSkills).toContain("TypeScript");
      expect(result.missingSkills).toContain("Kubernetes");
      expect(result.scoreBreakdown.skillsMatchPct).toBeGreaterThan(0);
      expect(result.scoreBreakdown.experienceMatchPct).toBe(100);
      expect(result.experienceComparison.matchLevel).toBe("Strong Match");
      expect(result.recruiterRecommendation).toBeTruthy();
    });
  });

  describe("ATS Analysis History & Reports Store", () => {
    beforeEach(() => {
      useATSAnalysisStore.getState().clearHistory();
    });

    it("saves ATS analysis report to persistent store history", () => {
      const parsed = parseResumeContent(sampleResumeText, "Alex_Turner_CV.pdf");
      const result = analyzeResumeAgainstJob(parsed, "Senior Fullstack Engineer", "Job description text", ["React"], 4);

      useATSAnalysisStore.getState().saveAnalysis(result);

      const history = useATSAnalysisStore.getState().history;
      expect(history.length).toBe(1);
      expect(history[0].candidate.candidateName).toBe("Alex Turner");
    });

    it("deletes ATS analysis report from history", () => {
      const parsed = parseResumeContent(sampleResumeText, "Alex_Turner_CV.pdf");
      const result = analyzeResumeAgainstJob(parsed, "Senior Fullstack Engineer", "Job description text", ["React"], 4);

      useATSAnalysisStore.getState().saveAnalysis(result);
      expect(useATSAnalysisStore.getState().history.length).toBe(1);

      useATSAnalysisStore.getState().deleteAnalysis(result.id);
      expect(useATSAnalysisStore.getState().history.length).toBe(0);
    });
  });
});
