import type { BasicInfoState } from "../types/basicInfoTypes";
import type { ContactInfoState } from "../types/contactInfoTypes";

export function buildPersonalPayload(basic: BasicInfoState, contact: ContactInfoState) {
  return {
    phone: contact.phone.trim(),
    alternatePhone: contact.alternatePhone.trim(),
    personalEmail: contact.personalEmail.trim(),
    companyWorkEmail: contact.companyWorkEmail.trim(),
    gender: basic.gender,
    dob: basic.dob,
    bloodGroup: basic.bloodGroup,
    maritalStatus: basic.maritalStatus,
    photoUrl: basic.photoUrl,
  };
}
