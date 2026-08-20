import type { PlatformCompany } from "./platformEntityTypes";

export const INITIAL_MOCK_COMPANIES: PlatformCompany[] = [
  { id: "COMP-001", name: "Acme Global Solutions", domain: "acme.corp", plan: "Enterprise", status: "Active", employeeCount: 1450, hrAdminName: "Sarah Jenkins", hrAdminEmail: "sarah.j@acme.corp", mrr: 145000, createdAt: "2024-01-10", industry: "Technology", location: "Bengaluru, India" },
  { id: "COMP-002", name: "Nexus Healthcare Pvt Ltd", domain: "nexushealth.in", plan: "Growth", status: "Active", employeeCount: 420, hrAdminName: "Vikram Malhotra", hrAdminEmail: "vikram@nexushealth.in", mrr: 42000, createdAt: "2024-02-15", industry: "Healthcare", location: "Mumbai, India" },
];