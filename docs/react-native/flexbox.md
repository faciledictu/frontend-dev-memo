---
sidebar_position: 4
description:
  How Flexbox in React Native differs from the web, alignment properties and
  their values
tags: [junior]
---

# Flexbox in React Native

Every `View` is a flex container; layout is computed by **Yoga**, a Flexbox
engine. It works like CSS Flexbox with different defaults:
**`flexDirection: 'column'`**, `alignContent: 'flex-start'`, `flexShrink: 0`,
and **`flex` takes a single number**. `justifyContent` aligns children along the
main axis (set by `flexDirection`), `alignItems` along the cross axis.

Applies to: React Native 0.88.

## Details

### Differences from the Web

| Property        | Web default        | React Native default |
| --------------- | ------------------ | -------------------- |
| `display`       | `block`            | `flex` (every view)  |
| `flexDirection` | `row`              | `column`             |
| `alignContent`  | `normal` (stretch) | `flex-start`         |
| `flexShrink`    | `1`                | `0`                  |
| `flex`          | Shorthand: `1 1 0` | One number           |
| `position`      | `static`           | `relative`           |

`flex: 1` means "take the free space"; siblings with `flex: 1` and `flex: 2`
share it 1:2. `flex: 0` sizes the view by its `width` / `height`; a negative
value lets it shrink to `minWidth` / `minHeight`.

### Properties

| Property                              | Axis                 | Values                                                                                                                         |
| ------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `flexDirection`                       | —                    | `column` (default), `row`, `column-reverse`, `row-reverse`                                                                     |
| `justifyContent`                      | Main                 | `flex-start` (default), `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`                                  |
| `alignItems`                          | Cross                | `stretch` (default), `flex-start`, `center`, `flex-end`, `baseline`                                                            |
| `alignSelf`                           | Cross, for one child | `auto` (default, takes the parent's `alignItems`) or any `alignItems` value                                                    |
| `flexWrap`                            | —                    | `nowrap` (default), `wrap`, `wrap-reverse`                                                                                     |
| `alignContent`                        | Cross, between lines | `flex-start` (default), `center`, `flex-end`, `stretch`, `space-between`, `space-around`, `space-evenly`; only with `flexWrap` |
| `gap`                                 | Between children     | `gap`, `rowGap`, `columnGap` in dp                                                                                             |
| `flexGrow`, `flexShrink`, `flexBasis` | Main                 | Same as on the web                                                                                                             |

`stretch` stretches children along the cross axis only if they have no fixed
size on that axis.

## Example

```tsx
import { StyleSheet, Text, View } from 'react-native';

// A header row: title on the left, actions on the right
function Header() {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>Inbox</Text>
      <Text>Edit</Text>
      <Text>New</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: { flex: 1 }, // pushes the actions to the right
});
```

## Follow-up Questions

- Why is the screen blank or the list not scrolling? A parent without `flex: 1`
  or a fixed height: its `flex: 1` children get zero height, and a list without
  a bounded height does not scroll.
- Is there CSS Grid? No, only Flexbox (`flexWrap` and `gap` for grids),
  `position: 'absolute'` and `aspectRatio`, which sizes one dimension from the
  other.

## Common Mistakes

- Expecting children in a row by default: the default direction is `column`.
- Writing `flex: '1 1 auto'`: `flex` takes one number; use `flexGrow`,
  `flexShrink` and `flexBasis` for the rest.
- Forgetting that `flexShrink` is `0`, so long content overflows instead of
  shrinking.

## See Also

- [StyleSheet](./stylesheet.md)
