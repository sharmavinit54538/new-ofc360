## 2026-08-20 - Array Filter Optimization in React
**Learning:** Found an anti-pattern in `EmployeesPage.tsx` where string case conversion (`.toLowerCase()`) was being executed repeatedly inside a  array method on every single component re-render.
**Action:** Always wrap expensive list filtering operations in `useMemo` and extract constant transformations (like `.toLowerCase()`) outside the loop to change string operations from O(N) to O(1).
## 2026-08-20 - Array Filter Optimization in React
**Learning:** Found an anti-pattern in EmployeesPage.tsx where string case conversion was being executed repeatedly inside a filter array method on every single component re-render.
**Action:** Always wrap expensive list filtering operations in useMemo and extract constant transformations outside the loop to change string operations from O(N) to O(1).
