---
title: Which aria-* Props Reach the Native Side in React Native 0.88
slug: aria-props-in-react-native-0-88
date: 2026-10-27T12:00
description:
  The aria-* and role props each core component accepts in its types against the
  ones that reach the native view
tags: [react-native, accessibility, ios, android]
---

Every core component accepts `role` and the `aria-*` props in its types, but in
React Native 0.88 several components drop some of them without a warning, while
the `accessibility*` form of the same prop works.

{/* truncate */}

- **Checked:** 21–22 October 2026
- **Versions:** React Native 0.88.0
- **Devices:** iPhone, iOS 27; Samsung phone, Android 16; iOS 27.0 Simulator;
  Android 17 emulator
- **Upstream:**
  [react/react-native#59377](https://github.com/react/react-native/issues/59377)
  and more

## How It Was Checked

- The source of every component exported from `react-native` 0.88 was read for
  the props it passes to the native view. Not covered: the deprecated
  components, `SafeAreaView`, `InputAccessoryView`, `VirtualView`.
- The rows users hit were run in pairs, the `aria-*` prop next to its
  `accessibility*` form: on the Simulator and the emulator in the
  [reproducer](https://github.com/faciledictu/rn-aria-props-repro), read with
  Accessibility Inspector and `uiautomator dump`; `View` and `Text` with
  VoiceOver and TalkBack on phones.

## Result

How a prop gets to the native side: each JS component converts `aria-*` to
`accessibility*` itself (`View`, `Text`, `TextInput`, `Image`). The native side
reads only the `accessibility*` names and `role`, so a prop the component does
not convert is dropped.

| Component                                     | Dropped                                                            | Checked                                         |
| --------------------------------------------- | ------------------------------------------------------------------ | ----------------------------------------------- |
| `View`                                        | `aria-modal`                                                       | [iPhone](2026-10-27-view-aria-modal.md)         |
| `View`                                        | `aria-live` works, but a `View` with no style is flattened away    | [Android](2026-10-27-view-live-region.md)       |
| `Text`                                        | `aria-live`                                                        | [Android](2026-10-27-text-aria-live.md)         |
| `Switch`, `ScrollView`, `ActivityIndicator`   | Every `aria-*`, `id`, `tabIndex`; `role` works                     | [Both](2026-10-27-aria-on-native-components.md) |
| `TouchableOpacity`, `TouchableNativeFeedback` | `role`, `aria-labelledby`                                          | [Both](2026-10-27-touchable-components-role.md) |
| `TouchableHighlight`                          | `role`, `aria-labelledby`, `aria-busy`, `-checked`, `-disabled`, … | [Both](2026-10-27-touchable-components-role.md) |
| `TouchableWithoutFeedback`                    | `role`, `aria-label`, `aria-labelledby`                            | [Both](2026-10-27-touchable-components-role.md) |
| `Text`                                        | `aria-labelledby`, `aria-modal`, `aria-value*`                     | Code only                                       |
| `TextInput`, `Image`                          | `aria-live`, `aria-modal`, `aria-value*`                           | Code only                                       |
| `RefreshControl`, `Modal`                     | Every `aria-*`, `id`, `tabIndex`                                   | Code only                                       |

- `Pressable`, `Button`, `KeyboardAvoidingView`, `ImageBackground` and the lists
  render a `View`, `ScrollView` or `Image` and have the same gaps.
- Not every gap matters: `aria-modal` on an `Image` or `aria-live` on a `Switch`
  make no sense. The ones that do: `aria-label` on `Switch`, `role` on
  `Touchable*`, `aria-label` on `TouchableWithoutFeedback`.
- `aria-labelledby` is a space-separated list of ids on the web; `View` splits
  it by commas, `TextInput` and `Image` pass it as one id, and Android uses only
  the first one. A web-style `aria-labelledby="title hint"` matches nothing.
- What works in every case: the `accessibility*` form (`accessibilityLabel`,
  `accessibilityRole`, `accessibilityState`, `accessibilityLiveRegion`,
  `accessibilityViewIsModal`).

## Upstream

- [react/react-native#59377](https://github.com/react/react-native/issues/59377):
  the issue with the whole table.
- Merged into `main`, not in a release on 27 October 2026:
  [#59328](https://github.com/react/react-native/pull/59328) (`aria-modal` on
  `View`), [#59330](https://github.com/react/react-native/pull/59330)
  (`aria-live` on `Text`),
  [#59335](https://github.com/react/react-native/pull/59335) (a `View` live
  region).
- Open on 27 October 2026:
  [#59378](https://github.com/react/react-native/pull/59378) (`Touchable*`),
  [#59379](https://github.com/react/react-native/pull/59379) (`Switch`,
  `ScrollView`, `ActivityIndicator`),
  [#59072](https://github.com/react/react-native/pull/59072) (`aria-hidden` on
  `ScrollView` and `ActivityIndicator`),
  [#58173](https://github.com/react/react-native/pull/58173) (`aria-labelledby`
  on `Button` and `Touchable*`).
