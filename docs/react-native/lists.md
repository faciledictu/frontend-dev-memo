---
sidebar_position: 5
description:
  ScrollView vs FlatList vs SectionList vs FlashList, virtualization, FlatList
  optimization props
tags: [middle]
---

# Lists: ScrollView, FlatList, FlashList

`ScrollView` renders **all** its children at once: fine for a screen of content,
bad for long lists. `FlatList` and `SectionList` are **virtualized**: they
render only the items in and near the visible area and replace the rest with
empty space, so memory stays flat. **FlashList** (Shopify) is a drop-in
alternative that **recycles** item views instead of creating new ones, which
scrolls smoother on long, varied lists.

Applies to: React Native 0.88, FlashList 2.

## Details

### Which One to Use

| Component     | Renders                      | Use for                                                   |
| ------------- | ---------------------------- | --------------------------------------------------------- |
| `ScrollView`  | Everything at once           | Forms, settings, a few dozen items at most                |
| `FlatList`    | A window around the viewport | Long or unbounded lists, infinite scroll                  |
| `SectionList` | Same, with section headers   | Grouped data: contacts by letter, messages by date        |
| `FlashList`   | Same, recycling item views   | Long lists with heavy or varied items, when FlatList lags |

### How Virtualization Works

- **Render window**: items within `windowSize` screens around the viewport
  (default 21: 10 above, 10 below, the visible one) are mounted; items outside
  are unmounted and replaced with blank space of the same size.
- **Incremental rendering**: new items are rendered in batches with low
  priority, so touches and animations are not blocked.
- The cost: scrolling faster than items render shows **blank areas**, and the
  state of an unmounted item (for example an expanded section) is lost unless it
  is kept outside the item.

### FlatList Props

| Prop                                                               | What it does                                                                                                                     |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `data`, `renderItem`                                               | Items and how to render one                                                                                                      |
| `keyExtractor`                                                     | A stable key per item; use an ID, not the index                                                                                  |
| `extraData`                                                        | Anything **outside `data`** that `renderItem` reads (selected ID); the list is a pure component and does not re-render otherwise |
| `ListHeaderComponent`, `ListFooterComponent`, `ListEmptyComponent` | Header, footer, empty state                                                                                                      |
| `onEndReached`, `onEndReachedThreshold`                            | Load the next page near the end                                                                                                  |
| `refreshing`, `onRefresh`                                          | Pull to refresh                                                                                                                  |

### FlatList Optimization

- **`getItemLayout`**: if items have a fixed height, tell the list the size and
  offset of each one; it skips measuring and `scrollToIndex` works instantly.
- **`windowSize`**: smaller means less memory and more blank areas on fast
  scroll.
- **`initialNumToRender`**: just enough items to fill the first screen.
- **`maxToRenderPerBatch`**, **`updateCellsBatchingPeriod`**: how many items are
  rendered per batch and how often.
- **`removeClippedSubviews`**: detaches off-screen views from the native
  hierarchy (on by default on Android).
- **Memoize items**: wrap the item component in `React.memo` and keep
  `renderItem` stable with `useCallback` (or let React Compiler do it), so a
  parent re-render does not re-render every visible row.
- Keep items light: small images (resized on the server), no heavy work in
  render.

### FlashList

- Same API as `FlatList` (`data`, `renderItem`, `keyExtractor`), so migration is
  usually a rename.
- Recycling: an item that scrolls out is reused for the one scrolling in, with
  new props. Local state inside an item is therefore reused too; use
  `useRecyclingState`, which resets when the item changes.
- Version 2 needs the New Architecture and measures items itself; size estimates
  (`estimatedItemSize`) are no longer needed.
- Use `getItemType` when the list mixes different kinds of rows, so a view is
  recycled only for a row of the same kind.

## Example

```tsx
import { memo, useCallback, useState } from 'react';
import { FlatList, Pressable, Text } from 'react-native';

type Message = { id: string; text: string };

const ITEM_HEIGHT = 56;

const Row = memo(function Row({
  item,
  selected,
  onPress,
}: {
  item: Message;
  selected: boolean;
  onPress: (id: string) => void;
}) {
  return (
    <Pressable
      style={{ height: ITEM_HEIGHT, opacity: selected ? 0.5 : 1 }}
      onPress={() => onPress(item.id)}
    >
      <Text>{item.text}</Text>
    </Pressable>
  );
});

export function Messages({ messages }: { messages: Message[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <Row
        item={item}
        selected={item.id === selectedId}
        onPress={setSelectedId}
      />
    ),
    [selectedId]
  );

  return (
    <FlatList
      data={messages}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      extraData={selectedId}
      // highlight-next-line
      getItemLayout={(_, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
}
```

## Follow-up Questions

- When `selectedId` changes in the example, how many rows re-render? Two `Row`s:
  `renderItem` runs for every mounted item, but the memoized `Row` re-renders
  only where `selected` changed.
- What unit does `onEndReachedThreshold` use? Visible lengths of the list: `0.5`
  fires when the end is half a list height away; the default is 2.
- How do you build a chat list? `inverted` on `FlatList`; in FlashList 2,
  `maintainVisibleContentPosition` with `startRenderingFromBottom`, without
  inverting.

## Common Mistakes

- `data.map()` inside a `ScrollView` for a long or unbounded list.
- Index as the key: after an insert or delete, rows keep the wrong state.
- Passing `data` again as `extraData`: it is already compared. `extraData` is
  for values outside `data`.
- Nesting a `FlatList` inside a vertical `ScrollView`: virtualization stops
  working because the list gets unlimited height. Use `ListHeaderComponent`
  instead.

## See Also

- [Virtualization in React](../react/performance/virtualization.md)
- [Optimization in React](../react/performance/optimization.md)
