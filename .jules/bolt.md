## 2026-09-10 - Prevent React List Re-renders
**Learning:** Using React.memo on list items (like MessageBubble) is ineffective if parent components pass inline functions (e.g. `() => handler(id)`) as props during render loops (.map). The inline functions create new references on every parent render, forcing the memoized child to re-render.
**Action:** Pass stable function references down and let the child component invoke them with its specific arguments, or wrap handlers in useCallback.
