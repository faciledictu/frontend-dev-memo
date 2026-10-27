---
title: aria-modal on View Does Nothing on iOS
slug: view-aria-modal
description:
  The View docs list aria-modal, but in React Native 0.88 VoiceOver still
  reaches the views behind a custom dialog; accessibilityViewIsModal works
tags: [react-native, accessibility, ios]
---

The `View` docs list `aria-modal` as an iOS prop that takes precedence over
`accessibilityViewIsModal`. In React Native 0.88 `View` does not pass it to the
native view: with `aria-modal` VoiceOver still reaches the background of a
custom dialog, with `accessibilityViewIsModal` it does not.

{/* truncate */}

- **Checked:** 21 October 2026
- **Versions:** React Native 0.88.0, Expo SDK 58 (development build)
- **Devices:** iPhone, iOS 27, VoiceOver
- **Upstream:**
  [react/react-native#59328](https://github.com/react/react-native/pull/59328):
  merged in `main`

## How It Was Checked

A screen with three background buttons and a custom overlay that is their
sibling. With the dialog open, swipe right through all elements, then touch
where a background button is.

```tsx
<View style={{ flex: 1 }}>
  <View style={{ flex: 1, padding: 48, gap: 16 }}>
    {['One', 'Two', 'Three'].map((title) => (
      <Pressable key={title} role="button">
        <Text>Background item {title}</Text>
      </Pressable>
    ))}
  </View>
  <View
    // highlight-next-line
    aria-modal // or accessibilityViewIsModal
    style={{ position: 'absolute', inset: 0, justifyContent: 'center' }}
  >
    <Text role="heading">Dialog</Text>
    <Pressable role="button" onPress={close}>
      <Text>Close</Text>
    </Pressable>
  </View>
</View>
```

## Result

- `aria-modal`: swiping goes past "Close" to the background buttons, and
  touching them focuses them.
- `accessibilityViewIsModal`: focus stays inside the dialog.
- The cause: `View` converts the other `aria-*` props to `accessibility*`, but
  not `aria-modal`, and the native side reads only `accessibilityViewIsModal`.
  `Pressable` and `Touchable*` do map it.
- Not affected: Android has no modal prop at all, there the background is hidden
  with `aria-hidden` (`importantForAccessibility="no-hide-descendants"`).

## Upstream

[react/react-native#59328](https://github.com/react/react-native/pull/59328)
maps `aria-modal` to `accessibilityViewIsModal` in `View`. It landed in `main`
on 23 October 2026; on 27 October 2026 it is not in a release (0.88.1 does not
include it).
