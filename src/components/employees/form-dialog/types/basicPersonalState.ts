import type { Employee } from "@/types/hr";

export interface BasicPersonalState {
  gender: Employee["gender"];
  setGender: (v: Employee["gender"]) => void;
  dob: string;
  setDob: (v: string) => void;
  bloodGroup: Employee["bloodGroup"];
  setBloodGroup: (v: Employee["bloodGroup"]) => void;
  maritalStatus: Employee["maritalStatus"];
  setMaritalStatus: (v: Employee["maritalStatus"]) => void;
  photoUrl: string;
  setPhotoUrl: (v: string) => void;
}