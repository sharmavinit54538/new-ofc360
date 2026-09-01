## 2024-05-24 - Memoizing Shared Components
**Learning:** Pure presentational components like `StatCard` that are used frequently in dashboards are excellent candidates for `React.memo`, particularly when their parent components update frequently (e.g., from live data streams or timers).
**Action:** Identify heavily reused presentational components and wrap them in `React.memo` to prevent unnecessary re-renders when their props haven't changed.
