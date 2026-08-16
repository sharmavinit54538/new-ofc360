## 2024-05-15 - React Router `useLocation` with List Rendering
**Learning:** In components rendering lists (like sidebars or menus), using `useLocation()` causes the entire component and all its children to re-render on every route change. If the list is dynamically generated on each render, it compounds the performance issue.
**Action:** Always memoize the dynamically generated list array using `useMemo` and wrap individual list item components in `React.memo()`. This ensures that only the list items whose `active` state actually changes will re-render during navigation.
