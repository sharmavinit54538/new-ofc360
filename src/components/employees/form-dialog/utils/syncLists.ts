import type { Employee } from "@/types/hr";
import type { NestedListsState } from "../types/nestedListTypes";

export function syncLists(emp: Employee | null, lists: NestedListsState) {
  if (!emp) return;
  lists.setAddresses(emp.addresses || []);
  lists.setKycDocuments(emp.kycDocuments || []);
  lists.setEducation(emp.education || []);
  lists.setWorkExperience(emp.workExperience || []);
  lists.setSkills(emp.skills || []);
  lists.setEmergencyContacts(emp.emergencyContacts || []);
  lists.setBankAccounts(emp.bankAccounts || []);
}
