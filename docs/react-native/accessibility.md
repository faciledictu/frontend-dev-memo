---
sidebar_position: 8
description:
  VoiceOver and TalkBack, accessibility props and their aria-* forms, grouping
  and hiding, focus and announcements, font scaling, touch targets, reduce
  motion, testing
tags: [middle]
---

# Accessibility in React Native

There is no DOM and no semantic HTML: a `View` is just a box, so the **role**,
**name** and **state** that VoiceOver (iOS) and TalkBack (Android) read come
from **props**, mapped to the native accessibility APIs. Give every control a
role and a label (`role`, `accessibilityLabel` or `aria-label`), **group**
related content into one element, **hide** decorative parts, keep **touch
targets** large, let **text scale** with the system font size, and respect
**Reduce Motion**. Many props work on one platform only, so test with both
screen readers.

Applies to: React Native 0.88, Expo SDK 58, Reanimated 4.

## Details

### Main Props

| Prop                                                                  | `aria-*` form                                         | What it gives                                              | Platform                                        |
| --------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------------- | ----------------------------------------------- |
| `accessible`                                                          | —                                                     | Makes the view one focus stop; its children are not        | Both                                            |
| `accessibilityLabel`                                                  | `aria-label`                                          | The name; without it, the text of the children is read     | Both                                            |
| `accessibilityHint`                                                   | —                                                     | What happens on activation: "Opens the cart"               | iOS reads it only if hints are on; Android does |
| `role` / `accessibilityRole`                                          | —                                                     | `button`, `link`, `heading` / `header`, `switch`, `tab`, … | Both; `role` wins if both are set               |
| `accessibilityState`                                                  | `aria-disabled`, `-selected`, `-checked`, `-expanded` | State; `checked` can be `'mixed'`                          | Both                                            |
| `accessibilityValue`                                                  | `aria-valuemin`, `-max`, `-now`, `-text`              | Value of a slider or a progress bar                        | Both                                            |
| `accessibilityLiveRegion`                                             | `aria-live`                                           | Read changes of the content                                | Android only                                    |
| `accessibilityViewIsModal`                                            | `aria-modal`                                          | Screen reader ignores the sibling views                    | iOS only                                        |
| `importantForAccessibility`, `accessibilityElementsHidden`            | `aria-hidden` (both platforms)                        | Hide a subtree from the screen reader                      | Android / iOS                                   |
| `accessibilityLabelledBy`                                             | `aria-labelledby`                                     | Takes the label from another view by `nativeID`            | Android only                                    |
| `accessibilityActions` + `onAccessibilityAction`                      | —                                                     | Custom actions in the screen reader menu                   | Both                                            |
| `accessibilityLanguage`, `accessibilityShowsLargeContentViewer`, etc. | —                                                     | Language of the label, large content viewer                | iOS only                                        |

- Neither set is deprecated, and the docs do not prefer one. `role` and `aria-*`
  look like the web, but `aria-live` and `aria-labelledby` still work only on
  Android and `aria-modal` only on iOS.
- `role` values are web-like (`heading`, `img`, `slider`), `accessibilityRole`
  values are the older ones (`header`, `image`, `adjustable`). For navigation
  inside the app use `button`, not `link`.
- Touchable components (`Pressable`, `Touchable*`, `Button`) and `Text`,
  `TextInput`, `Switch` are accessible by default; a plain `View` is not. `Text`
  with `onPress` gets the `link` role on its own.

### Grouping and Hiding

- A `Pressable` is one element: the label is built from **all `Text` inside it**
  joined with spaces. A card with an image, a title and a price inside a
  `Pressable` is read once; inside a plain `View` it is three stops.
- `accessible` on a container does the same for non-pressable content, for
  example a row "Rating 4.5, 120 reviews". Children inside it cannot be focused
  separately, so do not group a container that has its own buttons.
- An icon-only button needs an explicit label, or it is read as just "button".
- Decorative images and icons inside a labeled element are already covered; on
  their own, hide them with `aria-hidden`.
- `experimental_accessibilityOrder` (an array of `nativeID`s) sets the focus
  order; it is experimental, and by default the order follows the layout.

### Modals

- `aria-modal` / `accessibilityViewIsModal` makes VoiceOver ignore the
  **siblings** of the view: put the dialog and the content it covers at the same
  level, or the background stays reachable.
- The `Modal` component is presented as a separate native layer (a view
  controller on iOS, a dialog window on Android), so the screen under it is not
  reachable; on Android `onRequestClose` must close it on the back button. A
  navigation modal (`presentation: 'modal'`) is a screen like any other.

### Focus and Announcements

| Task                                          | iOS                                                      | Android                                         |
| --------------------------------------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Move focus to a view                          | `AccessibilityInfo.sendAccessibilityEvent(ref, 'focus')` | The same; the view must be `accessible`         |
| "Item added" without moving focus             | `AccessibilityInfo.announceForAccessibility('…')`        | A live region on the text: `aria-live="polite"` |
| Is a screen reader on?                        | `isScreenReaderEnabled()`, `screenReaderChanged` event   | The same                                        |
| Give more time before a toast or a hint hides | —                                                        | `getRecommendedTimeoutMillis()`                 |

- Live regions do not work on iOS; `announceForAccessibility` works on both, but
  the Android API behind it is deprecated since Android 16, so a live region is
  the safer choice there. `announceForAccessibilityWithOptions` with
  `{ queue: true }` waits for the current speech on iOS.
- **After navigation** screen reader focus may stay where it was or land at the
  top, depending on the platform and the navigator. Check with VoiceOver and
  TalkBack; if needed, move it to the screen title in `useFocusEffect` with
  `sendAccessibilityEvent(titleRef.current, 'focus')`. The deprecated
  `setAccessibilityFocus` took a node handle.
- Swipe-to-delete, drag and drop, long press menus: a screen reader user cannot
  perform the gesture, so add the same actions to `accessibilityActions`
  (`{ name: 'delete', label: 'Delete' }`) and handle them in
  `onAccessibilityAction`. Standard names: `activate`, `increment`, `decrement`
  on both platforms; `magicTap`, `escape` on iOS; `longpress`, `expand`,
  `collapse` on Android.

### Font Scaling

- `Text` and `TextInput` follow the system font size (Dynamic Type on iOS, "Font
  size" on Android): `allowFontScaling` is `true` by default. Do not turn it off
  for the whole app: users who set large text need it.
- `maxFontSizeMultiplier` caps the scale where the layout really cannot grow (a
  tab bar label, a badge); `0` means no cap.
- Layouts must grow with the text: no fixed heights on rows and buttons, let
  text wrap (`numberOfLines` only where truncation is fine), switch a row to a
  column at a large scale. The current scale is
  `useWindowDimensions().fontScale` or `PixelRatio.getFontScale()`, see
  [StyleSheet](./stylesheet.md#screen-size).
- Test with the largest size, including the extra accessibility sizes on iOS.

### Touch Targets

- Minimum size: **44 × 44 pt** on iOS (Apple HIG), **48 × 48 dp** on Android
  (Material); WCAG 2.2 asks for 24 × 24.
- A small icon gets a bigger target with `hitSlop` on `Pressable` without
  changing the layout, but not past the parent's bounds, see
  [Gestures](./animations/gestures.md). Padding or `minWidth` / `minHeight` work
  too.

### Reduce Motion

- `AccessibilityInfo.isReduceMotionEnabled()` and the `reduceMotionChanged`
  event: replace large movement, parallax and zoom with a fade or no animation.
- Reanimated: every animation has `reduceMotion: ReduceMotion.System` by
  default, so it finishes at once when the setting is on. `useReducedMotion()`
  reads the setting synchronously but only once, at startup; it does not
  re-render on change. `<ReducedMotionConfig mode={…} />` overrides it for the
  whole app.
- The core `Animated` API does not check the setting: read it yourself, see
  [Animated](./animations/animated.md).

### Testing

- By hand: **VoiceOver** and **TalkBack** on a device, swiping through every
  screen; the largest font size; Reduce Motion on.
- **Accessibility Inspector** (Xcode) on the iOS Simulator: shows label, role
  and traits and runs an audit. **Accessibility Scanner** (Android app):
  suggests fixes for target size, contrast and labels.
- React Native Testing Library: `getByRole('button', { name: 'Add to cart' })`
  fails if the element loses its role, its label or its accessibility (a `View`
  with a role but without `accessible` does not match). Hidden elements are
  excluded by default. See [Testing](../tooling/testing.md#react-native).
- `eslint-plugin-react-native-a11y` catches missing labels, but has not had a
  release since 2024.

WCAG, contrast, the ARIA rules and the laws (the European Accessibility Act also
covers apps of shops, banks and transport) are the same as on the web, see
[Web Accessibility](../web-platform/accessibility/accessibility.md).

## Example

```tsx title="ProductCard.tsx"
import { Image, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Product = { name: string; price: string; imageUrl: string };

export function ProductCard({
  product,
  onOpen,
  onFavorite,
}: {
  product: Product;
  onOpen: () => void;
  onFavorite: () => void;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {/* error-start */}
      {/* Image, title and price are three focus stops; the icon is "button" */}
      <View>
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: 64, height: 64 }}
        />
        <Text onPress={onOpen}>{product.name}</Text>
        <Text>{product.price}</Text>
      </View>
      <Pressable onPress={onFavorite}>
        <Ionicons name="heart-outline" size={20} />
      </Pressable>
      {/* error-end */}

      {/* correct-start */}
      {/* One stop: "Running shoes, $89, button" */}
      <Pressable onPress={onOpen} role="button" style={{ flex: 1 }}>
        <Image
          source={{ uri: product.imageUrl }}
          style={{ width: 64, height: 64 }}
          aria-hidden
        />
        <Text>{product.name}</Text>
        <Text>{product.price}</Text>
      </Pressable>
      <Pressable
        onPress={onFavorite}
        role="button"
        aria-label={`Add ${product.name} to favorites`}
        hitSlop={12}
      >
        <Ionicons name="heart-outline" size={20} />
      </Pressable>
      {/* correct-end */}
    </View>
  );
}
```

<details>
<summary>An announcement and a custom action</summary>

```tsx title="CartRow.tsx"
import { AccessibilityInfo, Platform, Pressable, Text } from 'react-native';

export function CartRow({
  title,
  onDelete,
}: {
  title: string;
  onDelete: () => void;
}) {
  function remove() {
    onDelete();
    // iOS; on Android a live region (aria-live) on the cart counter does it
    if (Platform.OS === 'ios') {
      AccessibilityInfo.announceForAccessibility(`${title} removed`);
    }
  }

  return (
    // Swipe-to-delete is not available to a screen reader: offer it as an action
    <Pressable
      role="button"
      // highlight-next-line
      accessibilityActions={[{ name: 'delete', label: 'Remove from cart' }]}
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === 'delete') remove();
      }}
    >
      <Text>{title}</Text>
    </Pressable>
  );
}
```

</details>

## Follow-up Questions

- What is the difference between `accessibilityLabel` and `accessibilityHint`?
  The label is what the element is ("Delete"); the hint is what happens
  ("Removes the message"). iOS users can turn hints off, so never put the only
  important information there.
- `role` or `accessibilityRole`, `aria-*` or `accessibility*`? Both sets work
  and neither is deprecated; `role` wins over `accessibilityRole`. Pick one per
  codebase and remember the platform limits.
- Why does `aria-live` not work on iOS? Live regions are an Android concept in
  React Native; on iOS call `announceForAccessibility`.
- A screen reader user cannot reach a button inside a card. Why? The card has
  `accessible` (or is a `Pressable`), which makes the whole card one element;
  move the button out or give the card an action.
- Should you set `allowFontScaling={false}`? Almost never: it breaks the app for
  users who need large text. Cap single elements with `maxFontSizeMultiplier`
  and fix the layout instead.
- How do you know a screen reader is on, and should the UI change? Use
  `isScreenReaderEnabled()`; change only what cannot work otherwise, such as
  auto-hiding controls or a carousel that advances on its own.
- How does the accessibility tree differ from the web? There is no DOM: the
  native views with their accessibility properties form it, and `accessible` /
  grouping decide which views are elements.

## Common Mistakes

- Icon buttons without a label: read as "button" or as the icon name.
- A clickable `View` with `onTouchEnd` instead of a `Pressable`: no role, not
  focusable for the screen reader.
- Fixed heights and `allowFontScaling={false}` everywhere to keep the design.
- Testing only on the iOS Simulator: TalkBack and VoiceOver differ, and many
  props are one-platform only.
- Gestures without an alternative: swipe actions, drag to reorder.
- Using `link` for in-app navigation, or roles without the matching state
  (`switch` without `checked`, a tab without `selected`).

## See Also

- [Web Accessibility](../web-platform/accessibility/accessibility.md)
- [Core Components](./core-components.md)
- [Gestures](./animations/gestures.md)
- [Reanimated](./animations/reanimated.md)
- [Accessibility (React Native docs)](https://reactnative.dev/docs/accessibility)
