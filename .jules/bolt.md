## 2026-08-17 - Expensive operations blocking render
**Learning:** Found instances of arrays being filtered and sorted on every render in components, like `DepartmentsTable.tsx`, without being memoized. This blocks the main thread on renders where dependencies haven't changed.
**Action:** When creating tables with search/filter features, utilize `useMemo` for list parsing to prevent re-computation.
