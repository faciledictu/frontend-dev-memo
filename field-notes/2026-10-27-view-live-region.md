---
title: A View Live Region Without a Style Is Flattened Away
slug: view-live-region
description:
  In React Native 0.88 Fabric removes a View that has only aria-live or
  accessibilityLiveRegion, so TalkBack never announces it
tags: [react-native, accessibility, android]
---

A `View` with `aria-live` or `accessibilityLiveRegion` and no style is removed
from the native tree by view flattening in React Native 0.88, so the live region
does not exist and TalkBack announces nothing. `collapsable={false}` keeps the
view and the live region works.

{/* truncate */}

- **Checked:** 21 October 2026
- **Versions:** React Native 0.88.0, Expo SDK 58 (development build)
- **Devices:** Samsung phone (SM-A276B), Android 16, TalkBack
- **Upstream:**
  [react/react-native#59329](https://github.com/react/react-native/issues/59329),
  fix [#59335](https://github.com/react/react-native/pull/59335): merged in
  `main`

## How It Was Checked

Counters that change by themselves, each wrapped in a `View` live region; the
[reproducer](https://github.com/faciledictu/rn-live-region-repro) has the same
cases.

```tsx
// Silent: the View has no style and is flattened
<View aria-live="polite">
  <Text>{count}</Text>
</View>
// Announced
<View aria-live="polite" collapsable={false}>
  <Text>{count}</Text>
</View>
```

## Result

- Without `collapsable={false}` the counter is not announced, with it it is.
  `View` converts `aria-live` to `accessibilityLiveRegion`, so a `View` with
  `accessibilityLiveRegion` is flattened the same way (read from the code).
- The cause: Fabric keeps a host view for `accessibilityViewIsModal`,
  `accessibilityElementsHidden` and `importantForAccessibility`, but not for a
  live region. A live region is announced without the view being `accessible`,
  so it needs a view of its own.
- A `View` with a style, `testID` or `nativeID` is kept anyway, which is why a
  quick test often does not show the problem.

## Upstream

[react/react-native#59335](https://github.com/react/react-native/pull/59335)
keeps a `View` that is a live region. It landed in `main` on 23 October 2026; on
27 October 2026 it is not in a release (0.88.1 does not include it).
