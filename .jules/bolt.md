## 2024-05-19 - Filter re-calculations in React
**Learning:** Found an unmemoized array `filter` function mapped inside `src/pages/EmployeesPage.tsx` which can cause O(N) re-computations when non-related state variables change. This is a common performance bottleneck specific to this codebase's architecture when rendering large tables/lists.
**Action:** Always wrap data transformations like `filter` or `sort` that feed into large lists/tables with `useMemo` using minimal required dependencies to prevent costly recalculations.
