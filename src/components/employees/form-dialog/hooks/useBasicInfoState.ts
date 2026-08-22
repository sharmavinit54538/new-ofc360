import { useState } from "react";
import type { Employee } from "@/types/hr";
import type { BasicInfoState } from "../types/basicInfoTypes";

export function useBasicInfoState(): BasicInfoState {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");
  const [gender, setGender] = useState<Employee["gender"]>("Male");
  const [dob, setDob] = useState("1996-08-20");
  const [bloodGroup, setBloodGroup] = useState<Employee["bloodGroup"]>("O+");
  const [maritalStatus, setMaritalStatus] = useState<Employee["maritalStatus"]>("Single");
  const [photoUrl, setPhotoUrl] = useState("");

  return { firstName, setFirstName, lastName, setLastName, employeeCode, setEmployeeCode, gender, setGender, dob, setDob, bloodGroup, setBloodGroup, maritalStatus, setMaritalStatus, photoUrl, setPhotoUrl };
}
