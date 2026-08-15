## 2024-08-15 - Redux state changes thrashing O(N) array operations in global header

**Learning:** `ConnectHeader.tsx` contained high-frequency Redux state subscriptions (e.g. `masterVolume` from soundSettingsSlice) alongside expensive O(N) array operations (`conversations.reduce` and `channels.filter`) performed during the render cycle. Since Redux state changes trigger re-renders, adjusting the volume knob would rapidly execute these O(N) loops on every frame, causing CPU spikes and UI lag.
**Action:** Always memoize derived data and configuration arrays (like navigation `tabs`) using `useMemo` when a component subscribes to volatile/high-frequency state like volume levels, scroll positions, or animation ticks.
