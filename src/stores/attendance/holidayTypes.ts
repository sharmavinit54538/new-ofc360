export interface HolidayItem {
  id: string;
  name?: string;
  title?: string;
  date: string;
  dayOfWeek?: string;
  type: "National" | "Regional" | "Optional" | "Optional Floating" | string;
  mandatory?: boolean;
  branchLocation?: string;
  [key: string]: any;
}
