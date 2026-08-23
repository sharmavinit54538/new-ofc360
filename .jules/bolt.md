## 2024-05-18 - Missing Memoizations in Data-Heavy Table Views
**Learning:** Found that complex list filtering logic inside components rendering data tables (like EmployeesPage) can cause heavy, unnecessary re-renders when local state or Redux queries trigger re-renders that don't affect the filter dependencies.
**Action:** Always wrap data array transformations, especially search/filter/sort pipelines in table view components, inside a `useMemo` hook to ensure they are only recalculated when the source data or filter states change.
