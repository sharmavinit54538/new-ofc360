import type { Employee } from "@/types/hr";
import type { BasicInfoState } from "../types/basicInfoTypes";
import type { ContactInfoState } from "../types/contactInfoTypes";

export function syncBasicAndContact(emp: Employee | null, b: BasicInfoState, c: ContactInfoState) {
  if (emp) {
    const parts = emp.name ? emp.name.split(" ") : ["", ""];
    b.setFirstName(emp.firstName || parts[0] || "");
    b.setLastName(emp.lastName || parts.slice(1).join(" ") || "");
    b.setEmployeeCode(emp.id || "");
    b.setGender(emp.gender || "Male");
    b.setDob(emp.dob || "1995-05-15");
    b.setBloodGroup(emp.bloodGroup || "O+");
    b.setMaritalStatus(emp.maritalStatus || "Single");
    b.setPhotoUrl(emp.photoUrl || emp.avatar || "");
    c.setPersonalEmail(emp.personalEmail || emp.email || "");
    c.setCompanyWorkEmail(emp.companyWorkEmail || emp.email || "");
    c.setPhone(emp.phone || "");
    c.setAlternatePhone(emp.alternatePhone || "");
  }
}
