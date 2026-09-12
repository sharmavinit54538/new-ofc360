## 2023-10-27 - O(n*m) Array Filtering in Render Paths
**Learning:** React components (like DepartmentAnalytics) often compute aggregations by filtering full lists for every category (`O(n*m)`).
**Action:** Always pre-group data into a Hash Map/Dictionary before mapping over categories for `O(n+m)` complexity.
