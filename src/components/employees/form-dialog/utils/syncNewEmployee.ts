import { DEFAULT_ADDRESSES, DEFAULT_KYC_DOCS, DEFAULT_EDUCATION, DEFAULT_SKILLS } from "../constants/formDefaultLists";
import { DEFAULT_EMERGENCY_CONTACTS, DEFAULT_BANK_ACCOUNTS } from "../constants/formDefaultAccounts";
import type { EmployeeFormState } from "../types/employeeFormState";

export function syncNewEmployeeDefaults(state: EmployeeFormState) {
  const { basic, contact, job, meta, comp, lists } = state;
  basic.setFirstName(""); basic.setLastName("");
  basic.setEmployeeCode(`EMP-${Math.floor(1000 + Math.random() * 9000)}`);
  basic.setGender("Male"); basic.setDob("1996-08-20"); basic.setBloodGroup("O+");
  basic.setMaritalStatus("Single"); basic.setPhotoUrl("");
  contact.setPersonalEmail(""); contact.setCompanyWorkEmail(""); contact.setPhone(""); contact.setAlternatePhone("");
  job.setDepartment("Engineering"); job.setDesignation(""); job.setEmploymentType("FULL_TIME");
  job.setJoiningDate(new Date().toISOString().split("T")[0]); job.setReportingManager(""); job.setShift("General"); job.setTeam("Core Platform"); job.setBranchOffice("Mumbai HQ"); job.setWorkLocation("Onsite");
  meta.setProbationPeriod(3); meta.setCapacity(100); meta.setCostCenterId("CC-001"); meta.setRole("employee"); meta.setLeaveGroup("Standard India Policy"); meta.setStatus("Active");
  comp.setCtc(1200000); comp.setBasicSalary(600000); comp.setHra(300000); comp.setBonus(180000); comp.setPfDeduction(72000); comp.setEsiDeduction(0); comp.setProfTax(2500);
  lists.setAddresses(DEFAULT_ADDRESSES); lists.setKycDocuments(DEFAULT_KYC_DOCS); lists.setEducation(DEFAULT_EDUCATION);
  lists.setWorkExperience([]); lists.setSkills(DEFAULT_SKILLS); lists.setEmergencyContacts(DEFAULT_EMERGENCY_CONTACTS); lists.setBankAccounts(DEFAULT_BANK_ACCOUNTS);
}
