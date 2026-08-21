export function getDepartmentFallbackLeads(name: string): { head: string; manager: string } {
  const n = name.toLowerCase();
  if (n.includes("eng") || n.includes("tech") || n.includes("dev")) return { head: "Vinit Sharma", manager: "Vinit Sharma (VP Engineering)" };
  if (n.includes("hr") || n.includes("people") || n.includes("talent")) return { head: "Priya Sharma", manager: "Vinit Sharma" };
  if (n.includes("exec") || n.includes("mgmt") || n.includes("manag")) return { head: "Vinit Sharma", manager: "Banoth Siddarth" };
  if (n.includes("fin") || n.includes("acc") || n.includes("pay")) return { head: "Ananya Roy", manager: "Banoth Siddarth" };
  if (n.includes("design") || n.includes("product") || n.includes("ux")) return { head: "Aarav Patel", manager: "Vinit Sharma" };
  if (n.includes("sale") || n.includes("market") || n.includes("growth")) return { head: "Rohan Verma", manager: "Banoth Siddarth" };
  if (n.includes("cloud") || n.includes("infra") || n.includes("ops")) return { head: "Alex Johnson", manager: "Sarah Chen" };
  return { head: "Department Lead", manager: "Executive Director" };
}
