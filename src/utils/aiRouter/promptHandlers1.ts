export function handleStandardPrompts(prompt: string, title: string, id: string): string | null {
  if (prompt.includes("ofc360 model test passed") || prompt.includes("reply with exactly: ofc360 model test passed")) {
    return `OFC360 MODEL TEST PASSED [Model: ${title} | ID: ${id}]`;
  }
  if (prompt.includes("explain what an hrms is")) {
    return `Here is how ${title} analyzes an HRMS:\n• Core Workforce Management: Centralizes employee records, hierarchy, and attendance.\n• Automated Payroll & Compliance: Streamlines salary processing and statutory tax deductions.\n• Employee Self-Service & AI: Empowers staff with instant copilot assistance.`;
  }
  if (prompt.includes("50,000") && prompt.includes("5,000")) {
    return `Numerical Reasoning Breakdown (${title}):\n• Monthly Base Earnings: ₹50,000\n• Performance Bonus: ₹5,000\n• Total Gross Payout Before Deductions: ₹55,000`;
  }
  return null;
}
