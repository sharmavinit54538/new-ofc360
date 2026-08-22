## 2024-05-17 - Prevent redundant string allocations in loops
**Learning:** In React components with client-side filtering, converting state values like `searchQuery.toLowerCase()` inside a `.filter()` loop causes an unnecessary O(N) string allocation per iteration. Wrapping the entire filter array operation in a `useMemo` further prevents re-evaluation on unrelated renders.
**Action:** Always extract static transformations (e.g., `toLowerCase()`) derived from state variables *outside* of map/filter callbacks. Wrap expensive list derivations in `useMemo`.
