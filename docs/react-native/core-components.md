---
sidebar_position: 3
description:
  View, Text, Image, TextInput, Pressable, ScrollView, Modal and their native
  views; text only inside Text, network images need a size, expo-image
tags: [junior]
---

# Core Components

React Native has no HTML tags: the UI is built from **core components** that map
to native views. **`View`** is the container (`div`), **`Text`** is the only
place for text, **`Image`** shows pictures, **`TextInput`** is the text field,
**`Pressable`** handles taps, **`ScrollView`** scrolls. A string outside
`<Text>` is an error, and an image from a URL is not sized automatically: it
needs a `width` and `height`.

Applies to: React Native 0.88, Expo SDK 58.

## Details

### Components

| Component           | iOS / Android view                        | Use                                                                   |
| ------------------- | ----------------------------------------- | --------------------------------------------------------------------- |
| `View`              | `UIView` / `ViewGroup`                    | Layout container with Flexbox, styles, touch handling                 |
| `Text`              | `UITextView` / `TextView`                 | All text; nested `Text` is inline                                     |
| `Image`             | `UIImageView` / `ImageView`               | Local and network images                                              |
| `TextInput`         | `UITextField` / `EditText`                | Text fields; `multiline` for a text area                              |
| `Pressable`         | A `View` with press handling              | Buttons, rows; see [Gestures](./animations/gestures.md)               |
| `ScrollView`        | `UIScrollView` / `ScrollView`             | Short scrolling content; long lists go to [Lists](./lists.md)         |
| `Modal`             | Presented view controller / `Dialog`      | A layer above the whole app: dialogs, pickers                         |
| `ActivityIndicator` | `UIActivityIndicatorView` / `ProgressBar` | Spinner                                                               |
| `Switch`            | `UISwitch` / `SwitchCompat`               | Boolean toggle                                                        |
| `SafeAreaView`      | Deprecated, iOS only                      | Use `react-native-safe-area-context`; see [Safe Area](./safe-area.md) |

`Button` exists too, but it cannot be styled beyond `color`; apps build buttons
from `Pressable` and `Text`.

### Text

- Every string must be inside `<Text>`; otherwise the app throws "Text strings
  must be rendered within a `<Text>` component." The usual cause is
  `{count && <Badge />}` with `count === 0`: React renders `0` as a string.
- Nested `Text` is **inline**, like `<span>`: the whole subtree becomes one
  native attributed string. A `View` in a column puts each `Text` on its own
  line.
- Style inheritance works only inside a `Text` subtree: there is no global font.
  A shared `AppText` component sets the font family and size.
- `numberOfLines` with `ellipsizeMode` (`tail` by default) truncates; `onPress`
  and `selectable` work on text directly.

### Image

| Source                        | Size                                                   | Notes                                                     |
| ----------------------------- | ------------------------------------------------------ | --------------------------------------------------------- |
| `require('./logo.png')`       | Known at build time, sized automatically               | Bundled; Metro picks `@2x` / `@3x` for the screen density |
| `{ uri: 'https://…' }`        | **Must be set**: `width` and `height` or `aspectRatio` | Without a size the image has zero size and is not visible |
| `{ uri: 'data:image/png;…' }` | Must be set                                            | Small inline images                                       |

- `resizeMode`: `cover` (default), `contain`, `stretch`, `repeat`, `center` —
  like `object-fit`.
- Cache control is limited: `source.cache` is iOS only; GIF and WebP on Android
  need extra Fresco modules in a bare app.
- **`expo-image`** is the usual replacement: memory and disk cache
  (`cachePolicy`), `placeholder` (blurhash, thumbhash), `contentFit`,
  `transition`, WebP / AVIF / animated GIF / SVG on both platforms, `prefetch`.

### TextInput

- **Controlled**: `value` + `onChangeText` (receives the string, not an event).
  Use it when the value is validated or formatted on every keystroke.
- **Uncontrolled**: `defaultValue`, the value is read from `onChangeText` into a
  ref or on submit; fewer re-renders in large forms.
- Keyboard and autofill: `keyboardType` (`email-address`, `number-pad`,
  `decimal-pad`, `phone-pad`), `secureTextEntry` for passwords, `autoComplete`
  for password managers and SMS codes (`email`, `password`, `new-password`,
  `one-time-code`; the older iOS-only `textContentType` does the same, do not
  set both), `autoCapitalize="none"` for emails.
- Focus, the next field and the keyboard covering the input:
  [Keyboard Handling](./keyboard.md).

### `Modal` vs a Navigation Modal

|               | `Modal` component                                   | Navigation modal (`presentation: 'modal'`) |
| ------------- | --------------------------------------------------- | ------------------------------------------ |
| What it is    | A view above everything, outside navigation         | A screen in the navigation stack           |
| Back button   | Android: `onRequestClose` must close it             | Handled by the navigator                   |
| URL and state | None                                                | Has a route, deep links and params         |
| Fits          | A small confirm dialog, a picker, a loading overlay | A whole screen: compose, filters, sign-in  |

## Example

```tsx
import { useState } from 'react';
import { Image, Pressable, Text, TextInput, View } from 'react-native';

export function Comment({ count }: { count: number }) {
  const [text, setText] = useState('');

  return (
    <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
      {/* highlight-next-line */}
      <Image
        source={{ uri: 'https://example.com/avatar.png' }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
      <View style={{ flex: 1, gap: 8 }}>
        <Text numberOfLines={2}>
          <Text style={{ fontWeight: 'bold' }}>Anna</Text> replied to your post
        </Text>
        {/* error-start */}
        {/* count = 0: "Text strings must be rendered within a <Text> component." */}
        {count && <Text>{count} replies</Text>}
        {/* error-end */}
        {/* correct-next-line */}
        {count > 0 && <Text>{count} replies</Text>}
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Reply"
          autoCapitalize="sentences"
        />
        <Pressable onPress={() => setText('')}>
          <Text>Send</Text>
        </Pressable>
      </View>
    </View>
  );
}
```

## Follow-up Questions

- Why is `Image` with a URL blank? It has no size: network images are not
  measured before loading, so the layout does not jump; set `width` and `height`
  or `aspectRatio`.
- Can text be placed directly in a `View`? No: only `Text` creates native text
  views. On the web `<div>text</div>` works because the DOM has text nodes.
- How do you set a default font for the whole app? There is no cascade from
  `View`; use an `AppText` wrapper (or a styling library's theme).
- `ScrollView` or `FlatList`? `ScrollView` renders all children at once; for
  long or unknown-length data use a virtualized list, see [Lists](./lists.md).
- Why does `onChangeText` give a string and `onChange` an event? `onChangeText`
  is a shortcut for the common case; `onChange` gives `nativeEvent.text` and
  more.

## Common Mistakes

- `{count && …}` with a number: `0` crashes the app instead of rendering
  nothing.
- A network `Image` without a size.
- Styling `Button`: it has no `style` prop; build a `Pressable`.
- `Modal` without `onRequestClose` on Android: the back button does not close
  it.
- Expecting `Text` styles to apply from a parent `View`.

## See Also

- [StyleSheet](./stylesheet.md)
- [Flexbox](./flexbox.md)
- [Gestures and Touch Handling](./animations/gestures.md)
- [Core components (reactnative.dev)](https://reactnative.dev/docs/components-and-apis)
