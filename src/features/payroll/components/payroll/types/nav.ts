export interface NavContext {
  activeTab: string;
  setTab: (tab: string) => void;
  user: any;
  employees: any[];
}
