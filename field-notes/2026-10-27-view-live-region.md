---
title: A View Live Region With Only Layout Styles Is Flattened Away
slug: view-live-region
description:
  In React Native 0.88 Fabric removes a View that has aria-live or
  accessibilityLiveRegion and nothing that keeps it, so TalkBack never announces
  it
tags: [react-native, accessibility, android]
---

A `View` with `aria-live` or `accessibilityLiveRegion` and no style (or only
layout styles) is removed from the native tree by view flattening in React
Native 0.88, so the live region does not exist and TalkBack announces nothing.
`collapsable={false}` keeps the view and the live region works.

{/* truncate */}

- **Checked:** 21 October 2026
- **Versions:** React Native 0.88.0, Expo SDK 58 (development build)
- **Devices:** Samsung phone (SM-A276B), Android 16, TalkBack
- **Upstream:**
  [react/react-native#59329](https://github.com/react/react-native/issues/59329),
  fix [#59335](https://github.com/react/react-native/pull/59335): landed in
  `main`

## How It Was Checked

The `announcements` case of [Memo Lab](https://github.com/faciledictu/memo-lab):
counters in live regions, each changed by its own button; activate a button and
wait for the announcement. Later the
[reproducer](https://github.com/faciledictu/rn-live-region-repro) (plain React
Native CLI, counters that change by themselves) showed the same, and was used to
check the fix with React Native built from source.

```tsx
<>
  {/* Silent: the View is flattened */}
  <View aria-live="polite">
    <Text>Cart: {count} items</Text>
  </View>
  {/* Announced */}
  <View aria-live="polite" collapsable={false}>
    <Text>Cart: {count} items</Text>
  </View>
</>
```

## Result

- Without `collapsable={false}` the counter is not announced, with it it is.
  `View` converts `aria-live` to `accessibilityLiveRegion`, so a `View` with
  `accessibilityLiveRegion` is flattened the same way (read from the code).
- The cause: Fabric keeps a host view for `accessibilityViewIsModal`,
  `accessibilityElementsHidden` and `importantForAccessibility`, but not for a
  live region. A live region is announced without the view being `accessible`,
  so it needs a view of its own.
- A `View` with a background color, a border, `opacity`, a `transform`, `testID`
  or `nativeID` is kept anyway, which is why a quick test often does not show
  the problem. Layout styles such as `padding` or `flexDirection` do not keep
  it.

## Upstream

[react/react-native#59335](https://github.com/react/react-native/pull/59335)
keeps a `View` that is a live region. It landed in `main` on 23 October 2026; on
27 October 2026 it is not in a release (0.88.1 does not include it).
