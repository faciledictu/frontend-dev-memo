---
sidebar_position: 18
---

# Data Virtualization

When we need to work with large datasets in React, such as large lists, we can
run into problems with initial render time and memory usage.

Data virtualization is an approach for improving the performance of applications
in those cases. It typically uses a technique called "windowing" or "viewport
rendering". Instead of rendering the entire list/grid at once, only a small
subset (or "viewport") of items is rendered based on the current scroll position
or viewport size.

`react-virtualized` is a feature-rich library, providing a variety of components
and utilities for virtualizing large lists, tables, and grids.

```javascript
import React from 'react';
import { List } from 'react-virtualized';

const rowRenderer = ({ index, key, style }) => (
  <div key={key} style={style}>
    Row {index}
  </div>
);

const App = () => (
  <List
    width={300}
    height={150}
    rowCount={1000}
    rowHeight={35}
    rowRenderer={rowRenderer}
  />
);

export default App;
```
