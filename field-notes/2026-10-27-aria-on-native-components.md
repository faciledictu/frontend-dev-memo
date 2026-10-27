---
title: Switch, ScrollView and ActivityIndicator Drop Every aria-* Prop
slug: aria-on-native-components
description:
  In React Native 0.88 aria-label on a Switch gives it no name; the components
  that render a native view directly do not convert aria-* props
tags: [react-native, accessibility, ios, android]
---

`Switch`, `ScrollView` and `ActivityIndicator` accept all `View` props in their
types and docs, but in React Native 0.88 they pass `aria-*`, `id` and `tabIndex`
to the native side unconverted, where nothing reads them.
`<Switch aria-label="Wi-Fi" />` has no name; `accessibilityLabel` works. `role`
works.

{/* truncate */}

- **Checked:** 22 October 2026
- **Versions:** React Native 0.88.0
- **Devices:** iOS 27.0 Simulator (Accessibility Inspector), Android 17 emulator
  (`uiautomator dump`)
- **Upstream:**
  [react/react-native#59379](https://github.com/react/react-native/pull/59379):
  open

## How It Was Checked

Pairs in the [reproducer](https://github.com/faciledictu/rn-aria-props-repro):
the left element uses the `aria-*` prop, the right one its `accessibility*`
form. The accessibility tree was read without a screen reader.

```tsx
<Switch aria-label="Wi-Fi A" value={on} onValueChange={setOn} />
<Switch accessibilityLabel="Wi-Fi B" value={on} onValueChange={setOn} />
```

## Result

| Pair                         | `aria-label`                                         | `accessibilityLabel`       |
| ---------------------------- | ---------------------------------------------------- | -------------------------- |
| `Switch`, Android            | `content-desc=""`, marked `NAF` (no accessible name) | `content-desc="Wi-Fi B"`   |
| `Switch`, iOS                | No label                                             | Label "Wi-Fi B"            |
| `ActivityIndicator`, Android | `content-desc=""`                                    | `content-desc="Loading D"` |
| `ScrollView`, Android        | `content-desc=""`                                    | `content-desc="Photos F"`  |

- The cause: `View`, `Text`, `TextInput` and `Image` convert `aria-*` to
  `accessibility*` in JS. `Switch`, `ScrollView` and `ActivityIndicator` render
  a native component directly and convert nothing. `RefreshControl` and `Modal`
  do the same (read from the code, not run).
- On iOS a `ScrollView` is not an accessibility element, so a label does not
  apply there; `ActivityIndicator` on iOS ignores even `accessibilityLabel`, see
  [a separate note](2026-10-27-activity-indicator-label-ios.md).
- What works: the `accessibility*` form of the same prop.

## Upstream

- [react/react-native#59377](https://github.com/react/react-native/issues/59377):
  the issue for all components.
- [react/react-native#59379](https://github.com/react/react-native/pull/59379)
  adds the conversion to the three components; open on 27 October 2026.
- [react/react-native#59072](https://github.com/react/react-native/pull/59072)
  maps only `aria-hidden` on `ScrollView` and `ActivityIndicator`; open on 27
  October 2026.
