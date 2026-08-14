## 2026-08-14 - Component Memoization
**Learning:** Implementing `React.memo` on heavily reused components like `StatCard` provides a simple way to avoid unnecessary re-renders in dashboards without sacrificing code readability.
**Action:** Found multiple instances of `StatCard` in Dashboard pages. Wrapped `StatCard` in `React.memo`.
