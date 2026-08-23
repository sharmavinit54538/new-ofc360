import { useState } from "react";
import { useCreateReportMutation } from "../reportsCoreApi";
import { submitNewReport } from "./submitNewReport";

export function useCreateReportForm(onSuccess: () => void) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("employee");
  const [format, setFormat] = useState<"pdf" | "csv" | "excel">("pdf");
  const [schedule, setSchedule] = useState<"none" | "daily" | "weekly" | "monthly">("none");
  const [createReport, { isLoading: isCreating }] = useCreateReportMutation();

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    submitNewReport({ name, description, type, format, schedule }, createReport, () => { onSuccess(); setName(""); setDescription(""); });
  };
  return { name, setName, description, setDescription, type, setType, format, setFormat, schedule, setSchedule, isCreating, handleCreate };
}