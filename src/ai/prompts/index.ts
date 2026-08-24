export const SYSTEM_PROMPTS = {
  default: `You are an AI assistant for OFC360, an enterprise HR and workforce management platform. Provide accurate, helpful, and professional responses.`,

  recruitment: `You are an AI recruitment specialist for OFC360. Help with resume screening, candidate matching, interview question generation, and hiring analytics. Be precise, fair, and compliant with hiring regulations.`,

  payroll: `You are an AI payroll analyst for OFC360. Assist with payroll forecasting, anomaly detection, fraud prevention, compliance checking, and compensation planning. Ensure accuracy and regulatory compliance.`,

  attendance: `You are an AI attendance analyst for OFC360. Provide insights on attendance trends, late arrivals, anomalies, and workforce scheduling optimization.`,

  intelligence: `You are an AI intelligence engine for OFC360. Execute models, analyze data, and provide actionable insights across all HR domains.`,

  copilot: `You are an AI copilot for OFC360 users. Help with queries, generate content, analyze data, and automate tasks across the platform.`,

  mood: `You are an AI mood detection specialist. Analyze text sentiment and emotional indicators for employee wellness monitoring.`,

  risk: `You are an AI risk assessment specialist. Evaluate organizational, compliance, and operational risks with evidence-based scoring.`,
};

export const TASK_PROMPTS = {
  analyzeResume: `Analyze the uploaded resume and extract: skills (technical and soft), years of experience, education, certifications, and a professional summary. Return structured JSON.`,

  matchCandidate: `Compare candidate profile against job requirements. Calculate match score (0-100), identify key strengths and gaps, and provide a breakdown by category (skills, experience, education, culture).`,

  rankCandidates: `Rank candidates for the given job based on semantic match, experience relevance, skill alignment, and cultural fit. Return ordered list with scores.`,

  generateQuestions: `Generate ${'{{count}}' || 10} interview questions for a ${'{{jobTitle}}' || 'position'} role. Include: ${'{{types}}' || 'technical, behavioral, situational'} questions with evaluation rubrics.`,

  forecastPayroll: `Analyze historical payroll data and forecast next period costs. Consider: headcount changes, salary adjustments, tax updates, benefit costs, and seasonal variations.`,

  detectAnomalies: `Scan payroll/attendance data for anomalies: unusual amounts, pattern deviations, duplicate entries, policy violations, and potential fraud indicators.`,

  analyzeAttendance: `Analyze attendance patterns: trends, late arrivals, absenteeism rates, department comparisons, and policy compliance. Identify actionable insights.`,

  executeModel: `Execute the specified AI model with provided input data and parameters. Return structured output with confidence scores and metadata.`,

  generateEmail: `Generate professional email content based on: template type, recipient context, key points, tone, and company branding guidelines.`,

  assessRisk: `Assess risk based on provided data. Return risk score (0-100), key risk factors, mitigation recommendations, and confidence level.`,
};

export function getSystemPrompt(feature: keyof typeof SYSTEM_PROMPTS): string {
  return SYSTEM_PROMPTS[feature] || SYSTEM_PROMPTS.default;
}

export function getTaskPrompt(task: keyof typeof TASK_PROMPTS, variables?: Record<string, string>): string {
  let prompt = TASK_PROMPTS[task] || '';
  if (variables) {
    Object.entries(variables).forEach(([key, value]) => {
      prompt = prompt.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    });
  }
  return prompt;
}

export const PROMPT_TEMPLATES = {
  recruitment: {
    system: SYSTEM_PROMPTS.recruitment,
    tasks: {
      analyzeResume: TASK_PROMPTS.analyzeResume,
      matchCandidate: TASK_PROMPTS.matchCandidate,
      rankCandidates: TASK_PROMPTS.rankCandidates,
      generateQuestions: TASK_PROMPTS.generateQuestions,
    },
  },
  payroll: {
    system: SYSTEM_PROMPTS.payroll,
    tasks: {
      forecastPayroll: TASK_PROMPTS.forecastPayroll,
      detectAnomalies: TASK_PROMPTS.detectAnomalies,
    },
  },
  attendance: {
    system: SYSTEM_PROMPTS.attendance,
    tasks: {
      analyzeAttendance: TASK_PROMPTS.analyzeAttendance,
    },
  },
  intelligence: {
    system: SYSTEM_PROMPTS.intelligence,
    tasks: {
      executeModel: TASK_PROMPTS.executeModel,
    },
  },
  copilot: {
    system: SYSTEM_PROMPTS.copilot,
    tasks: {
      generateEmail: TASK_PROMPTS.generateEmail,
    },
  },
  mood: {
    system: SYSTEM_PROMPTS.mood,
    tasks: {},
  },
  risk: {
    system: SYSTEM_PROMPTS.risk,
    tasks: {
      assessRisk: TASK_PROMPTS.assessRisk,
    },
  },
};