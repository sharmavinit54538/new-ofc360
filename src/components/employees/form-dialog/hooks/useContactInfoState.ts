import { useState } from "react";
import type { ContactInfoState } from "../types/contactInfoTypes";

export function useContactInfoState(): ContactInfoState {
  const [personalEmail, setPersonalEmail] = useState("");
  const [companyWorkEmail, setCompanyWorkEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [alternatePhone, setAlternatePhone] = useState("");

  return { personalEmail, setPersonalEmail, companyWorkEmail, setCompanyWorkEmail, phone, setPhone, alternatePhone, setAlternatePhone };
}
