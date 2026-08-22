import type { Employee } from "@/types/hr";
import type { CompensationState } from "../types/compensationTypes";
import type { NestedListsState } from "../types/nestedListTypes";

export function syncCompAndLists(emp: Employee | null, comp: CompensationState, lists: NestedListsState) {
  if (!emp) return;
  comp.setCtc(emp.ctc ?? emp.salary ?? 1200000);
  comp.setBasicSalary(emp.basicSalary ?? 600000);
  comp.setHra(emp.hra ?? 300000);
  comp.setBonus(emp.bonus ?? 180000);
  comp.setPfDeduction(emp.pfDeduction ?? 72000);
  comp.setEsiDeduction(emp.esiDeduction ?? 0);
  comp.setProfTax(emp.profTax ?? 2500);

  lists.setAddresses(emp.addresses || []);
  lists.setKycDocuments(emp.kycDocuments || []);
  lists.setEducation(emp.education || []);
  lists.setWorkExperience(emp.workExperience || []);
  lists.setSkills(emp.skills || []);
  lists.setEmergencyContacts(emp.emergencyContacts || []);
  lists.setBankAccounts(emp.bankAccounts || []);
}
