import { useState } from "react";

export function useHolidayFilterState() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedBranch, setSelectedBranch] = useState<string>("ALL");

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedType("ALL");
    setSelectedBranch("ALL");
  };

  const isFiltered = searchQuery !== "" || selectedType !== "ALL" || selectedBranch !== "ALL";

  return { searchQuery, setSearchQuery, selectedType, setSelectedType, selectedBranch, setSelectedBranch, resetFilters, isFiltered };
}
