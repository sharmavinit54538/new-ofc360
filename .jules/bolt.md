## 2025-02-14 - Memoize list filtering logic
**Learning:** React component lists performing multiple string operations (.toLowerCase(), .includes()) on every render can cause measurable performance bottlenecks in medium to large lists, especially when users type in search fields.
**Action:** Always wrap heavy list filtering logic inside a `useMemo` hook, especially when string manipulation is involved in the predicate function, to ensure it only recalculates when the dependencies actually change.
