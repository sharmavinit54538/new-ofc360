export type HolidayViewMode = "calendar" | "grid";

export interface HolidayFilterState {
  searchQuery: string;
  selectedType: string;
  selectedBranch: string;
}
