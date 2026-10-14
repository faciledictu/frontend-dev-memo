---
sidebar_position: 4
description:
  StyleSheet API, how styles differ from CSS, responsive sizes with
  useWindowDimensions, custom fonts
---

# StyleSheet

Styles in React Native are **plain JS objects** with camelCase properties
(`backgroundColor`), not CSS. Numbers are **density-independent pixels** (dp),
without units; there are no `px`, `rem` or media queries, only numbers and
percentage strings. There is **no cascade and no selectors**: a style applies
only to the component it is passed to, and only text styles are inherited, from
a parent `<Text>` to a nested `<Text>`. `StyleSheet.create` groups the styles
and type-checks them; it returns the same object.

Applies to: React Native 0.87.

## Details

### Differences from CSS

| CSS                                      | React Native                                                          |
| ---------------------------------------- | --------------------------------------------------------------------- |
| `background-color: red`                  | `backgroundColor: 'red'`                                              |
| `16px`, `1rem`, `50vw`                   | `16` (dp), `'50%'`; screen size from `useWindowDimensions`            |
| Cascade, selectors, specificity          | None; combine with arrays: `style={[styles.a, isActive && styles.b]}` |
| Inherited `color`, `font-*` everywhere   | Inherited only between nested `<Text>` elements                       |
| `display: block` by default              | Everything is Flexbox, `flexDirection: 'column'` by default           |
| Media queries, `:hover`, pseudo-elements | None; conditions in JS                                                |

In a style array, later entries override earlier ones; `false`, `null` and
`undefined` are ignored.

### API

| Member                     | What it does                                                                                          |
| -------------------------- | ----------------------------------------------------------------------------------------------------- |
| `StyleSheet.create(obj)`   | Returns `obj` as is; freezes it in development and gives type checking and autocompletion             |
| `StyleSheet.flatten(arr)`  | Merges an array of styles into one object; later entries win                                          |
| `StyleSheet.compose(a, b)` | Returns `[a, b]`, or the other style if one is falsy; keeps references stable for memoized components |
| `StyleSheet.hairlineWidth` | The thinnest line the screen can draw, for borders and separators                                     |
| `StyleSheet.absoluteFill`  | `{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }`, for overlays                        |

### Screen Size

- `useWindowDimensions()` returns `{ width, height, scale, fontScale }` and
  re-renders the component when the window changes (rotation, split screen).
- `Dimensions.get('window')` returns the size once. Called at module level, for
  example inside `StyleSheet.create`, it never updates.

### Styling Libraries

`StyleSheet` is enough for many apps. On top of it: **NativeWind** (Tailwind
classes), **Unistyles** (themes and breakpoints), `styled-components/native`.
See [Styling approaches](../react/ecosystem/styling.md).

### Custom Fonts

- **Expo**: list the files in the `expo-font` config plugin in `app.json` to
  embed them at build time, or load them at runtime with `useFonts`.
- **Bare React Native**: add the folder to `assets` in `react-native.config.js`
  and run `npx react-native-asset`, which copies the files into the native
  projects.
- `fontFamily` is the font's **PostScript name** on iOS and the file name on
  Android. They often match (`Inter-Bold`), but when they do not, the font works
  on Android and silently falls back on iOS.
- Usually each weight is a separate file referenced by its own `fontFamily`
  (`Inter-Regular`, `Inter-Bold`); setting `fontWeight` on a custom font is not
  reliable across platforms.

## Example

```tsx
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';

function Card({ selected }: { selected: boolean }) {
  const { width } = useWindowDimensions();

  return (
    <View
      style={[styles.card, selected && styles.selected, { width: width * 0.8 }]}
    >
      <Text style={styles.title}>
        Title <Text style={styles.accent}>inherits fontSize</Text>
      </Text>
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  selected: { backgroundColor: '#eef' },
  title: { fontSize: 18, fontFamily: 'Inter-Bold' },
  accent: { color: 'royalblue' },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
});
```

## Common Mistakes

- Saying `StyleSheet.create` makes styles faster than inline objects. It used to
  replace them with numeric IDs; now it returns the object as is. A new inline
  object on every render only matters for memoized children.
- Reading `Dimensions.get` at module level and expecting the layout to follow
  rotation.
- Expecting `color` set on a `View` to reach the `Text` inside it.

## See Also

- [Flexbox](./flexbox.md)
- [Platform-Specific Code](./platform-specific-code.md)
- [Styling approaches](../react/ecosystem/styling.md)
