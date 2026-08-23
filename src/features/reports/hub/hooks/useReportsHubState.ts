import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { ReportCategory } from "../types";

export function useReportsHubState() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawTab = searchParams.get("tab");
  const activeCategory: ReportCategory = (rawTab === "performance" || rawTab === "engagement" || rawTab === "culture" || rawTab === "compliance" || rawTab === "workforce") ? rawTab : "workforce";
  const setActiveCategory = (tab: ReportCategory) => setSearchParams({ tab });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  return { activeCategory, setActiveCategory, searchTerm, setSearchTerm, selectedType, setSelectedType, dateFrom, setDateFrom, isModalOpen, setIsModalOpen };
}