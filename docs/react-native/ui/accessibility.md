---
sidebar_position: 6
description:
  VoiceOver and TalkBack, accessibility props and their aria-* forms, grouping
  and hiding, focus and announcements, font scaling, touch targets, reduce
  motion, testing
tags: [middle]
---

# Accessibility in React Native

There is no DOM and no semantic HTML: a `View` is just a box, so the **role**,
**name** and **state** that VoiceOver (iOS) and TalkBack (Android) read come
from **props**, mapped to the native accessibility APIs. A `Pressable` is
focusable but has **no role** until you set one, so give every control a role
and a label (`role`, `aria-label`), **group** related content into one element,
**hide** decorative parts, keep **touch targets** large, let **text scale** with
the system font size, and respect **Reduce Motion**. Many props work on one
platform only, so test with both screen readers.

Applies to: React Native 0.88, Expo SDK 58, Reanimated 4.

## Details

WCAG, contrast, the ARIA rules and the laws (the European Accessibility Act also
covers e-commerce, banking and transport apps) are the same as on the web and
are not repeated here, see
[Web Accessibility](../../web-platform/accessibility/accessibility.md).

### Main Props

| Prop                                                       | `aria-*` form                                                  | What it gives                                              | Platform                                                         |
| ---------------------------------------------------------- | -------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| `accessible`                                               | —                                                              | Makes the view one focus stop; its children are not        | Both                                                             |
| `accessibilityLabel`                                       | `aria-label`                                                   | The name; without it, the text of the children is read     | Both                                                             |
| `accessibilityHint`                                        | —                                                              | What happens on activation: "Opens the cart"               | iOS: only if hints are on in VoiceOver settings; Android: always |
| `role` / `accessibilityRole`                               | —                                                              | `button`, `link`, `heading` / `header`, `switch`, `tab`, … | Both; `role` wins if both are set                                |
| `accessibilityState`                                       | `aria-disabled`, `-selected`, `-checked`, `-expanded`, `-busy` | State; `checked` can be `'mixed'`                          | Both                                                             |
| `accessibilityValue`                                       | `aria-valuemin`, `-max`, `-now`, `-text`                       | Value of a slider or a progress bar                        | Both                                                             |
| `accessibilityLiveRegion`                                  | `aria-live`                                                    | Announces content changes                                  | Android only                                                     |
| `accessibilityViewIsModal`                                 | `aria-modal`                                                   | Screen reader ignores the sibling views                    | iOS only                                                         |
| `importantForAccessibility`, `accessibilityElementsHidden` | `aria-hidden` (both platforms)                                 | Hide a subtree from the screen reader                      | Android / iOS                                                    |
| `accessibilityLabelledBy`                                  | `aria-labelledby`                                              | Takes the label from another view by `nativeID`            | Android only                                                     |
| `accessibilityActions` + `onAccessibilityAction`           | —                                                              | Custom actions in the screen reader menu                   | Both                                                             |
| `accessibilityLanguage`                                    | —                                                              | Language the label is read in                              | iOS only                                                         |

- Neither the `role` / `aria-*` props nor the `accessibilityRole` /
  `accessibility*` props are deprecated, and the docs do not prefer one. `role`
  and `aria-*` look like the web, but `aria-live` and `aria-labelledby` still
  work only on Android and `aria-modal` only on iOS.
- The `accessibility*` props map directly to the native accessibility APIs; the
  `aria-*` aliases came later, and in current versions not every core component
  passes all of them on, without a warning. Fixes are under way. If an `aria-*`
  prop has no effect, use its `accessibility*` form.

  <CheckedOnDevice platform="iOS" version="27" date="2026-10-21" note="/field-notes/aria-props-in-react-native-0-88" />
  <CheckedOnDevice platform="Android" version="16" date="2026-10-21" note="/field-notes/aria-props-in-react-native-0-88" />

- `role` values are web-like (`heading`, `img`, `slider`), `accessibilityRole`
  values are the older ones (`header`, `image`, `adjustable`). For navigation
  inside the app use `button`, not `link`.
- `Pressable`, `Touchable*`, `TextInput` and `Switch` are focus stops by
  default; a plain `View` is not. `Text` with `onPress` gets the `link` role on
  its own.

### Grouping and Hiding

- A `Pressable` is one element: the label is built from **all `Text` inside it**
  joined with spaces. A card with an image, a title and a price inside a
  `Pressable` is read once; inside a plain `View` the title and the price are
  separate stops, and an image without `alt` is skipped.
- `accessible` on a container does the same for non-pressable content, for
  example a row "Rating 4.5, 120 reviews". On iOS, VoiceOver cannot focus the
  children of such an element (TalkBack still reaches nested buttons), so do not
  group a container that has its own buttons.
- An icon-only button needs a label and a role, or it is read as just "button"
  or as nothing useful.
- Images: an informative one gets `alt`; a decorative one inside a labeled
  element is already covered, on its own it gets `aria-hidden`.
- `experimental_accessibilityOrder` (an array of `nativeID`s) sets the focus
  order; it is experimental, and by default the order follows the layout.

### Form Fields

- There is no `<label for>`: put the label on the `TextInput` itself
  (`aria-label` or `accessibilityLabel`). `aria-labelledby` pointing to a
  visible `Text` works only on Android.
- A `placeholder` is not a label: it disappears once the user types.
- A validation error must be heard, not only seen: announce it, or add it to the
  field's label or hint while it is shown.

### Modals and Overlays

- `accessibilityViewIsModal` makes VoiceOver ignore the **siblings** of the
  view: put the dialog and the content it covers at the same level, or the
  background stays reachable. Prefer it to `aria-modal` on a `View`.

  <CheckedOnDevice platform="iOS" version="27" date="2026-10-21" note="/field-notes/view-aria-modal" />

- The `Modal` component is presented as a separate native layer (a view
  controller on iOS, a dialog window on Android), so the screen under it is not
  reachable, with `transparent` too.
- A custom bottom sheet or overlay on Android has no modal prop: hide the
  background with `aria-hidden`
  (`importantForAccessibility="no-hide-descendants"`) and move focus into the
  sheet.

### Focus and Announcements

| Task                                          | iOS                                                      | Android                                                         |
| --------------------------------------------- | -------------------------------------------------------- | --------------------------------------------------------------- |
| Move focus to a view                          | `AccessibilityInfo.sendAccessibilityEvent(ref, 'focus')` | The same                                                        |
| "Item added" without moving focus             | `AccessibilityInfo.announceForAccessibility('…')`        | A live region: `accessibilityLiveRegion="polite"` on the `Text` |
| Is a screen reader on?                        | `isScreenReaderEnabled()`, `screenReaderChanged` event   | The same                                                        |
| Give more time before a toast or a hint hides | —                                                        | `getRecommendedTimeoutMillis()`                                 |

- Live regions do not work on iOS: UIKit has no such concept, VoiceOver speaks
  only when the app posts an announcement, which is what
  `announceForAccessibility` does. It works on Android too (still on Android
  16), but the Android API behind it is deprecated since Android 16, so a live
  region is the safer choice there. `announceForAccessibilityWithOptions` with
  `{ queue: true }` waits for the current speech on iOS; TalkBack plays
  announcements one after another anyway.
- A live region on Android: `accessibilityLiveRegion` on the `Text`, or
  `aria-live` on a `View` around it with `collapsable={false}`, so that view
  flattening does not remove the view.

  <CheckedOnDevice platform="Android" version="16" date="2026-10-21" note="/field-notes/view-live-region" />

- **After navigation** in a React Navigation 7 native stack, VoiceOver focuses
  the first element of the new screen and TalkBack the header's back button.
  Going back, TalkBack returns focus to the button that opened the screen and
  reads the screen title and the button; VoiceOver puts focus on the back button
  of the previous screen, not on that button, and says nothing. To land on the
  title, move focus in `useFocusEffect` with
  `sendAccessibilityEvent(titleRef.current, 'focus')` (it replaces the
  deprecated `setAccessibilityFocus`). The view that gets focus must be
  `accessible`.
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
  column at large font scales. The current scale is
  `useWindowDimensions().fontScale` or `PixelRatio.getFontScale()`, see
  [StyleSheet](stylesheet.md#screen-size).
- Test with the largest size, including the extra accessibility sizes on iOS.

### Touch Targets

- Minimum size: **44 × 44 pt** on iOS (Apple HIG), **48 × 48 dp** on Android
  (Material); WCAG 2.2 asks for 24 × 24.
- A small icon gets a bigger target with `hitSlop` on `Pressable` (see
  [Gestures](../animations/gestures.md)) or with padding and `minHeight`.

### Reduce Motion

- `AccessibilityInfo.isReduceMotionEnabled()` and the `reduceMotionChanged`
  event: replace large movement, parallax and zoom with a fade or no animation.
- Reanimated: every animation has `reduceMotion: ReduceMotion.System` by
  default, so it jumps straight to its final value when the setting is on.
  `useReducedMotion()` reads the setting synchronously but only once, at
  startup; it does not re-render on change. `<ReducedMotionConfig mode={…} />`
  overrides this for every animation in the app. Keep `ReduceMotion.Never` on
  animations that carry meaning, such as a progress bar.
- The core `Animated` API does not check the setting: read it yourself, see
  [Animated](../animations/animated.md).

### Testing

- By hand: **VoiceOver** and **TalkBack** on a device, swiping through every
  screen; the largest font size; Reduce Motion on.
- **Accessibility Inspector** (Xcode) on the iOS Simulator: shows label, role
  and traits and runs an audit. **Accessibility Scanner** (Android app):
  suggests fixes for target size, contrast and labels.
- React Native Testing Library: `getByRole('button', { name: 'Add to cart' })`
  fails if the element loses its role, its label or its accessibility (a `View`
  with a role but without `accessible` does not match). Hidden elements are
  excluded by default. See [Testing](../../tooling/testing.md#react-native).
- `eslint-plugin-react-native-a11y` catches missing labels, but has not had a
  release since 2024.

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
      {/* Title (read as "link") and price are separate stops, the image is
          skipped; the icon has no name and no role */}
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
        />
        <Text>{product.name}</Text>
        <Text>{product.price}</Text>
      </Pressable>
      <Pressable
        onPress={onFavorite}
        role="button"
        aria-label={`Add ${product.name} to favorites`}
        hitSlop={12} // 20 + 2 × 12 = 44 pt
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
import { AccessibilityInfo, Pressable, Text } from 'react-native';

export function CartRow({
  title,
  onOpen,
  onDelete,
}: {
  title: string;
  onOpen: () => void;
  onDelete: () => void;
}) {
  function remove() {
    onDelete();
    // Both platforms; on Android a live region on the cart counter
    // (accessibilityLiveRegion) is the alternative to the deprecated API
    AccessibilityInfo.announceForAccessibility(`${title} removed`);
  }

  return (
    // Swipe-to-delete is not available to a screen reader: offer it as an action
    <Pressable
      onPress={onOpen}
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
- How do you make a custom slider accessible? `role="slider"`
  (`accessibilityRole="adjustable"`), `accessibilityValue` with `min`, `max` and
  `now`, and the `increment` / `decrement` actions, which VoiceOver triggers
  with a swipe up or down.
- What is Magic Tap? A two-finger double tap in VoiceOver for the main action of
  the screen (play / pause, answer a call); handle it as the `magicTap` action
  in `accessibilityActions` (or with the older `onMagicTap` prop).
- `accessible={false}` or `aria-hidden`: what is the difference? The first only
  stops the view from being a focus stop, its children are still read; the
  second hides the whole subtree.
- How do you know a screen reader is on, and should the UI change? Use
  `isScreenReaderEnabled()`; change only what cannot work otherwise, such as
  auto-hiding controls or a carousel that advances on its own.

## Common Mistakes

- Icon buttons without a label: read as "button" or as the icon name.
- A clickable `View` with `onTouchEnd` instead of a `Pressable`: no role, not
  focusable for the screen reader.
- Fixed heights and `allowFontScaling={false}` everywhere to keep the design.
- Testing only on the iOS Simulator: TalkBack and VoiceOver differ, and many
  props are one-platform only.
- `aria-live` or `aria-labelledby` used and tested only on Android: they do
  nothing on iOS.
- Trusting an `aria-*` prop on a core component without checking it with a
  screen reader: some components drop some of them without a warning.
- `accessible` on a card that has its own buttons: VoiceOver cannot reach them.
- Gestures without an alternative: swipe actions, drag to reorder.
- Using `link` for in-app navigation, or roles without the matching state
  (`switch` without `checked`, a tab without `selected`).

## See Also

- [Web Accessibility](../../web-platform/accessibility/accessibility.md)
- [Core Components](core-components.md)
- [Gestures](../animations/gestures.md)
- [Reanimated](../animations/reanimated.md)
- [Accessibility (React Native docs)](https://reactnative.dev/docs/accessibility)
