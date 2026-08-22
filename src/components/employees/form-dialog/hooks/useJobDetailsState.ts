import { useState } from "react";
import type { Employee } from "@/types/hr";
import type { JobDetailsState } from "../types/jobDetailsTypes";

export function useJobDetailsState(): JobDetailsState {
  const [department, setDepartment] = useState<Employee["department"]>("Engineering");
  const [designation, setDesignation] = useState("");
  const [employmentType, setEmploymentType] = useState<Employee["employmentType"]>("FULL_TIME");
  const [joiningDate, setJoiningDate] = useState(new Date().toISOString().split("T")[0]);
  const [reportingManager, setReportingManager] = useState("");
  const [shift, setShift] = useState<Employee["shift"]>("General");
  const [team, setTeam] = useState("Core Platform");
  const [branchOffice, setBranchOffice] = useState("Mumbai HQ");
  const [workLocation, setWorkLocation] = useState<Employee["workLocation"]>("Onsite");

  return { department, setDepartment, designation, setDesignation, employmentType, setEmploymentType, joiningDate, setJoiningDate, reportingManager, setReportingManager, shift, setShift, team, setTeam, branchOffice, setBranchOffice, workLocation, setWorkLocation };
}
