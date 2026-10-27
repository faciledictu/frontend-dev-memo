---
title: aria-live on Text Is Not Announced on Android
slug: text-aria-live
description:
  In React Native 0.88 a Text with aria-live stays silent with TalkBack; the
  same Text with accessibilityLiveRegion is announced
tags: [react-native, accessibility, android]
---

`Text` accepts `aria-live` in its types, but in React Native 0.88 it does not
convert it to `accessibilityLiveRegion`, as `View` does. A counter in
`<Text aria-live="polite">` is never announced by TalkBack; the same counter
with `accessibilityLiveRegion="polite"` is announced on every change.

{/* truncate */}

- **Checked:** 21 October 2026
- **Versions:** React Native 0.88.0, Expo SDK 58 (development build)
- **Devices:** Samsung phone (SM-A276B), Android 16, TalkBack
- **Upstream:**
  [react/react-native#59330](https://github.com/react/react-native/pull/59330):
  merged in `main`

## How It Was Checked

Two counters that change every few seconds by themselves, so that nothing else
moves the TalkBack focus. Focus is left on another element and the announcements
are listened to.

```tsx
// A: silent
<Text aria-live="polite">{count}</Text>
// B: announced on every change
<Text accessibilityLiveRegion="polite">{count}</Text>
```

## Result

- A is never announced, B is.
- The cause: `Text` passes `aria-live` to the native side under that name, and
  the native side reads only `accessibilityLiveRegion`.
- Not affected: iOS, which has no live regions; there the app posts an
  announcement with `AccessibilityInfo.announceForAccessibility`.

## Upstream

[react/react-native#59330](https://github.com/react/react-native/pull/59330)
maps `aria-live` to `accessibilityLiveRegion` in `Text`. It was merged into
`main` on 22 October 2026, after the 0.88 branch was cut; on 27 October 2026 it
is not in a release (0.88.1 does not include it).
