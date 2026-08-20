export function parseContactInfo(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const firstLine = lines[0] || "";
  let name = firstLine.length < 40 && !firstLine.includes("@") ? firstLine : "Alex Turner";
  if (name.toLowerCase().includes("resume") || name.toLowerCase().includes("curriculum")) name = "Alex Turner";
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : "alex.turner@example.com";
  const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch ? phoneMatch[0] : "+1 (555) 234-5678";
  let location = "San Francisco, CA";
  if (text.toLowerCase().includes("new york") || text.toLowerCase().includes("ny")) location = "New York, NY";
  else if (text.toLowerCase().includes("bengaluru") || text.toLowerCase().includes("bangalore")) location = "Bengaluru, KA";
  else if (text.toLowerCase().includes("london")) location = "London, UK";
  return { name, email, phone, location };
}
