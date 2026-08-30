## 2024-05-24 - [Avoid frequent filtering calculations during un-related renders]
**Learning:** [In a heavily interactive page (like 'EmployeesPage') that fetches larger sets of data, filtering directly inside component renders causes repeated and expensive executions when unrelated state variables update. ]
**Action:** [Use the React hook `useMemo` to prevent recalculating list arrays by caching output between re-renders based on related filtering props or search states.]
