---
sidebar_position: 100
---

# Memoization it Redux: Reselect Library

Reselect is a library for creating memoized "selector" functions in JavaScript.
It is commonly used in applications with Redux to efficiently compute derived
data from the Redux store.

Reselect's selectors remember the arguments of the last function call and the
result. If the same arguments are passed in again, the selector returns the
cached result, avoiding unnecessary recalculations.

```javascript
import { createSelector } from 'reselect';

// Input selectors
const selectItems = (state) => state.items;
const selectFilter = (state) => state.filter;

// Memoized selector
const selectFilteredItems = createSelector(
  [selectItems, selectFilter],
  (items, filter) => {
    return items.filter((item) => item.includes(filter));
  }
);
```

`createSelector` is included in Redux Toolkit package.
