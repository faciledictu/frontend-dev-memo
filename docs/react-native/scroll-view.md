---
sidebar_position: 8
---

# ScrollView

This component is a generic container that can be scrolled vertically or
horizontally (by setting the `horizontal` property). It's great for simple
content that doesn't require any complex list optimizations.

You might use `map()` to iterate over an array and render each item inside a
`ScrollView`. This is useful for small lists, but it's not recommended for large
datasets because all items are rendered at once, which can lead to performance
issues.

```jsx
import React from 'react';
import { ScrollView, Text } from 'react-native';

const MyList = ({ data }) => {
  return (
    <ScrollView>
      {data.map((item, index) => (
        <Text key={index}>{item}</Text>
      ))}
    </ScrollView>
  );
};
```
