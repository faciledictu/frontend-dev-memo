---
sidebar_position: 8
---

# Working with Lists

## List virtualization

List virtualization is a performance optimization technique used in React Native (and other platforms) to efficiently render long lists of data. It allows only a small subset of items from the list to be rendered at any given time, instead of rendering the entire list at once. This reduces memory usage and improves the performance of your app, especially when dealing with large datasets.

- Finite Render Window

  React Native maintains a limited set of items within this render window, which corresponds to the portion of the list currently visible on the screen, plus a buffer zone around it.
  
  Items that fall outside this window are not rendered but replaced with blank space, which reduces memory consumption.

- Incremental rendering

  Virtualized lists are optimized for fast scrolling

  Items that are far from the visible area are rendered incrementally with low priority, ensuring that the app's main interactions (such as user touches and animations) are not interrupted.

  If an item is about to come into view, it is rendered with higher priority to ensure that the user does not encounter any blank spaces during normal scrolling.

## FlatList

This is a performant component for rendering large lists of data. Unlike
`ScrollView`, `FlatList` only renders items that are currently visible on the
screen, making it more memory-efficient.

### Common Props

- `data`<br /> The array of data to be rendered.
- `renderItem`<br /> A function that returns the component to render for each
  item.
- `keyExtractor`<br /> A function to generate unique keys for each item, which
  helps React Native manage item re-renders.
- `ListHeaderComponent`<br /> A component or JSX to render at the top of the
  list.
- `extraData`<br /> Used to re-render the list when this prop changes.

```jsx
import React from 'react';
import { FlatList, Text, View } from 'react-native';

const MyFlatList = ({ data }) => {
  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Text>{item}</Text>}
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={<Text>Header Content</Text>}
      extraData={data}
    />
  );
};
```

### extraData

It is a marker property for telling the list to re-render (since _it implements PureComponent_). If any of your renderItem, Header, Footer, etc. functions depend on anything outside of the data prop, stick it here and treat it immutably.

## SectionList

Similar to `FlatList`, but designed to handle grouped data. It supports rendering sections with headers and items within each section.

- `sections`<br /> An array where each section contains a title and data array.
- `renderItem`<br /> Function to render each item within a section.
- `renderSectionHeader`<br /> Function to render the header for each section.
- `keyExtractor`<br /> Similar to `FlatList`, but for section items.
