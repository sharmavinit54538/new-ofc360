## 2024-05-18 - [O(n^2) Render Optimization in GlobalSearchDialog]
**Learning:** Found a major performance bottleneck where `findIndex()` was being called on a list of items for each render of those same items.
**Action:** Instead of calling `findIndex()` for each element when rendering `.map()`, compute a Map `itemIndexMap` directly alongside the flattened items creation and use O(1) `map.get()` lookups in the render path.
