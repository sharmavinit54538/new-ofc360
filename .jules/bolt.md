## 2024-05-24 - React.memo requires useCallback on prop functions
**Learning:** When optimizing list items with `React.memo` (like `SearchEmployeeItem` in `GlobalSearchDialog`), it's ineffective unless the parent component memoizes the callback functions passed as props (e.g., `onSelect`). If the parent passes a new inline function on every render, the memoization achieves nothing and only adds comparison overhead.
**Action:** Always verify and wrap prop functions in `useCallback` when using `React.memo` for child components.
