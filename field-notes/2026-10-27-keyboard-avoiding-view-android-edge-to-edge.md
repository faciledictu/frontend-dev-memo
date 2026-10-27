---
title:
  KeyboardAvoidingView Without behavior Leaves the Input Covered on Edge-to-Edge
  Android
slug: keyboard-avoiding-view-android-edge-to-edge
description:
  Expo's keyboard guide sets no behavior on Android; on an edge-to-edge app the
  keyboard then covers the input, padding with the header offset keeps it
  visible
tags: [expo, react-native, keyboard, android]
---

Expo's keyboard guide sets
`behavior={Platform.OS === 'ios' ? 'padding' : undefined}`. An edge-to-edge app
(every Expo SDK 54+ app on Android 16, and Android 15 enforces it for apps
targeting API 35) does not shrink its window for the keyboard, so with no
`behavior` the input stays under the keyboard. `padding` or `height` with the
header offset keeps it right above the keyboard. Checked on Android 16 and 17.

{/* truncate */}

- **Checked:** 21 October 2026
- **Versions:** React Native 0.88, Expo SDK 58
- **Devices:** Samsung phone, Android 16; Android 17 emulator
- **Upstream:** [expo/expo#52032](https://github.com/expo/expo/pull/52032): open

## How It Was Checked

The `keyboard-avoiding-view` case of
[Memo Lab](https://github.com/faciledictu/memo-lab): a screen under a navigation
header with a `KeyboardAvoidingView` and an input at the bottom; switches set
`behavior` (none, `padding`, `height`) and `keyboardVerticalOffset` (0 or the
header height). For each combination: tap the input, type, and look where the
input is.

```tsx
<KeyboardAvoidingView
  style={{ flex: 1 }}
  // highlight-next-line
  behavior={behavior} // undefined, 'padding' or 'height'
  keyboardVerticalOffset={withOffset ? headerHeight : 0}
>
  <View style={{ flex: 1 }} />
  <TextInput placeholder="Message" />
</KeyboardAvoidingView>
```

## Result

| `behavior`                            | Android 16 and 17               |
| ------------------------------------- | ------------------------------- |
| none (the guide)                      | The input is under the keyboard |
| `padding` or `height` + header offset | Right above the keyboard        |

- The window keeps its height when the keyboard opens: the keyboard comes as an
  inset, not as a smaller window.
- The old reason to skip `behavior` on Android was that the window shrank by
  itself (`adjustResize`) and padding added a second gap. With edge-to-edge it
  does not shrink, so `padding` is right on both platforms.
- `react-native-keyboard-controller` behaved the same on both Android versions.
- This note covers Android only: on iOS the guide already sets `padding`.

## Upstream

[expo/expo#52032](https://github.com/expo/expo/pull/52032) changes the guide's
example to `behavior="padding"` on both platforms; open on 27 October 2026. A
minimal Expo Go app for it:
[expo-kav-edge-to-edge](https://github.com/faciledictu/expo-kav-edge-to-edge).
