import { toast } from "sonner";
import type { BasicInfoState } from "../types/basicInfoTypes";
import type { ContactInfoState } from "../types/contactInfoTypes";
import type { JobDetailsState } from "../types/jobDetailsTypes";

export function validateEmployeeForm(b: BasicInfoState, c: ContactInfoState, j: JobDetailsState): boolean {
  if (!b.firstName.trim() || !b.lastName.trim()) {
    toast.error("First Name and Last Name are required.");
    return false;
  }
  if (!c.personalEmail.trim() || !c.phone.trim()) {
    toast.error("Personal Email and Phone Number are required.");
    return false;
  }
  if (!j.designation.trim()) {
    toast.error("Designation is required.");
    return false;
  }
  return true;
}
