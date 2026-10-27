---
title: Touchable* Drop role and Some aria-* Props
slug: touchable-components-role
description:
  In React Native 0.88 TouchableOpacity with role="button" has no role;
  TouchableWithoutFeedback drops aria-label, TouchableHighlight the aria-* state
tags: [react-native, accessibility, ios, android]
---

`Touchable*` build their native view from a fixed list of props, and in React
Native 0.88 `role` is on none of the lists. `<TouchableOpacity role="button">`
has no role; `accessibilityRole="button"` works. `TouchableWithoutFeedback` also
drops `aria-label`, and `TouchableHighlight` drops `aria-checked` and the other
`aria-*` state props.

{/* truncate */}

- **Checked:** 22–23 October 2026
- **Versions:** React Native 0.88.0
- **Devices:** iOS 27.0 Simulator (Accessibility Inspector), Android 17 emulator
  (`uiautomator dump`)
- **Upstream:**
  [react/react-native#59378](https://github.com/react/react-native/pull/59378):
  open

## How It Was Checked

Pairs in the [reproducer](https://github.com/faciledictu/rn-aria-props-repro),
the `aria-*` or `role` prop next to its `accessibility*` form:

```tsx
<>
  <TouchableOpacity role="button" onPress={save}>
    <Text>Save G</Text>
  </TouchableOpacity>
  <TouchableOpacity accessibilityRole="button" onPress={save}>
    <Text>Save H</Text>
  </TouchableOpacity>
</>
```

## Result

| Component                  | Prop                   | Android 17                     | iOS 27                    |
| -------------------------- | ---------------------- | ------------------------------ | ------------------------- |
| `TouchableOpacity`         | `role="button"`        | `android.view.ViewGroup`       | No Button trait           |
| `TouchableWithoutFeedback` | `aria-label="Close I"` | `content-desc="×"` (the child) | Label "×"                 |
| `TouchableHighlight`       | `aria-checked`         | `checkable="false"`            | No "checked" in the value |

With the `accessibility*` form each of them is right: `android.widget.Button`
and the Button trait, the label "Close J", `checked="true"`.

- `TouchableNativeFeedback` drops `role` too (read from the code, not run).
- `aria-labelledby` is dropped by all four (read from the code).
- `Pressable` does not have these gaps: it passes its props on to a `View`.

## Upstream

- [react/react-native#59378](https://github.com/react/react-native/pull/59378)
  passes `role` from all four and maps the missing `aria-*`; open on 27
  October 2026.
- [react/react-native#58173](https://github.com/react/react-native/pull/58173)
  passes `aria-labelledby` through `Button` and `Touchable*`; open on 27
  October 2026.
