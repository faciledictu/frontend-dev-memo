---
title: ActivityIndicator Ignores Its Label on iOS
slug: activity-indicator-label-ios
description:
  In React Native 0.88 VoiceOver reads an ActivityIndicator as "In progress"
  whatever accessibilityLabel says; accessible fixes the label but loses the
  value
tags: [react-native, accessibility, ios]
---

On iOS, `<ActivityIndicator accessibilityLabel="Loading orders" />` is read as
"In progress", the default label of the native indicator. The label goes to a
wrapper view that is not an accessibility element. Android uses the label.

{/* truncate */}

- **Checked:** 22 October 2026
- **Versions:** React Native 0.88.0
- **Devices:** iOS 27.0 Simulator (Accessibility Inspector); Android 17 emulator
- **Upstream:**
  [react/react-native#59380](https://github.com/react/react-native/issues/59380),
  fix [#59381](https://github.com/react/react-native/pull/59381): open

## How It Was Checked

The indicator D in the
[reproducer](https://github.com/faciledictu/rn-aria-props-repro), read with
Accessibility Inspector:

```tsx
<ActivityIndicator accessibilityLabel="Loading D" />
```

## Result

| Variant                             | Label         | Value | Element                       |
| ----------------------------------- | ------------- | ----- | ----------------------------- |
| `accessibilityLabel`                | "In progress" | 1     | The native indicator          |
| `accessible` + `accessibilityLabel` | "Loading D"   | none  | The React Native wrapper view |

- With `accessible` the label is read, but the indicator's value is lost.
- On Android 17 the label is used: `content-desc="Loading D"`.
- The cause: the accessibility props go to the wrapper view, VoiceOver skips it
  and reads the inner `UIActivityIndicatorView`. `Switch` solves the same case
  by exposing the inner native view as the accessibility element.

## Upstream

[react/react-native#59380](https://github.com/react/react-native/issues/59380)
is the issue,
[react/react-native#59381](https://github.com/react/react-native/pull/59381) the
fix; it was checked on the Simulator with React Native built from source (the
label is used and the value kept). Open on 27 October 2026.
