---
sidebar_position: 7
description:
  KeyboardAvoidingView per platform, Android adjustResize / adjustPan,
  keyboardShouldPersistTaps, Keyboard API, react-native-keyboard-controller,
  moving to the next field
tags: [middle]
---

# Keyboard Handling

On **iOS** the keyboard is drawn **over** the app: the app moves the content
itself, usually with **`KeyboardAvoidingView`** (`behavior="padding"`) or a
scroll view that scrolls to the focused input. On **Android** the window is
**resized** by default (`adjustResize`), so often nothing extra is needed. For
long forms and chats, **`react-native-keyboard-controller`** gives the same
behavior on both platforms. A tap while the keyboard is open is controlled by
**`keyboardShouldPersistTaps`** on the scroll view.

Applies to: React Native 0.88, Expo SDK 58, react-native-keyboard-controller
1.22.

## Details

### Platforms

|                        | iOS                                      | Android                                                   |
| ---------------------- | ---------------------------------------- | --------------------------------------------------------- |
| Default                | Keyboard covers the bottom of the screen | `adjustResize`: the app's area shrinks above the keyboard |
| `KeyboardAvoidingView` | `behavior="padding"`                     | Often not needed; Expo recommends `behavior={undefined}`  |
| Events                 | `keyboardWill*` and `keyboardDid*`       | Only `keyboardDidShow` / `keyboardDidHide`                |

- Edge-to-edge (Android 15+) does not resize the window by itself: the app gets
  the keyboard as a bottom inset. `KeyboardAvoidingView` handles that since
  React Native 0.86.
- `adjustPan` (`softwareKeyboardLayoutMode: "pan"` in Expo's `app.json`) moves
  the whole window up instead of resizing it. It stops a bottom tab bar from
  riding above the keyboard; `tabBarHideOnKeyboard: true` hides the tab bar
  instead.

### `KeyboardAvoidingView`

| `behavior` | What it changes                                                 |
| ---------- | --------------------------------------------------------------- |
| `padding`  | Adds bottom padding equal to the keyboard height; the usual one |
| `height`   | Shrinks its own height                                          |
| `position` | Moves an inner container (`contentContainerStyle`) up           |

Usual pitfalls:

- It must fill the screen: `style={{ flex: 1 }}` on it and on its parents,
  otherwise there is nothing to shrink.
- It measures from the top of the window: under a navigation header pass the
  header height as `keyboardVerticalOffset` (`useHeaderHeight()` from
  `@react-navigation/elements`), or the content stays partly covered.
- Nested in a `ScrollView`, or with a bottom tab bar, the offset is counted
  twice or not at all; put it at the screen root.

### Taps While the Keyboard Is Open

`keyboardShouldPersistTaps` on `ScrollView` and lists (`FlatList`, `FlashList`):

| Value             | A tap on a button in the list                                     |
| ----------------- | ----------------------------------------------------------------- |
| `never` (default) | Only closes the keyboard; the button does **not** get the tap     |
| `handled`         | The button gets the tap; a tap on empty space closes the keyboard |
| `always`          | The button gets the tap; the keyboard stays open                  |

For a form inside a scroll view use `handled`: otherwise the first tap on
"Submit" only hides the keyboard. `keyboardDismissMode="on-drag"` closes the
keyboard on scroll (`interactive` on iOS follows the finger).

### `Keyboard` API

- `Keyboard.dismiss()` closes the keyboard and blurs the input; wrap a screen in
  `Pressable onPress={Keyboard.dismiss}` to close it on a tap outside.
- `Keyboard.addListener('keyboardDidShow', cb)` returns a subscription; call
  `remove()` in the effect cleanup. `Keyboard.isVisible()` and
  `Keyboard.metrics()` give the current state.

### `react-native-keyboard-controller`

Needs Reanimated and a development build (not in Expo Go).

| API                                     | Use                                                              |
| --------------------------------------- | ---------------------------------------------------------------- |
| `KeyboardProvider`                      | At the root; turns on the library                                |
| `KeyboardAwareScrollView`               | Forms: scrolls to the focused input; `bottomOffset` sets the gap |
| `KeyboardStickyView`, `KeyboardToolbar` | A bar above the keyboard; the toolbar has previous / next / done |
| `KeyboardChatScrollView`                | Chats: the message list moves with the keyboard                  |
| `useKeyboardHandler`                    | Keyboard height on every animation frame, for custom animations  |

Unlike the core `KeyboardAvoidingView`, the library follows the keyboard
animation frame by frame. `KeyboardStickyView` is the cross-platform replacement
for `InputAccessoryView` (iOS only, deprecated in 0.88).

### Moving to the Next Field

- `returnKeyType="next"` (or `done`, `send`, `search`) changes the return key.
- `onSubmitEditing` focuses the next input through a ref:
  `nextRef.current?.focus()`.
- `submitBehavior="submit"` keeps the keyboard open between fields; the default
  for a single-line input is `blurAndSubmit`.

## Example

```tsx title="SignInScreen.tsx"
import { useRef } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  type TextInputInstance,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';

export function SignInScreen({ onSubmit }: { onSubmit: () => void }) {
  const headerHeight = useHeaderHeight();
  const passwordRef = useRef<TextInputInstance>(null);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      // highlight-next-line
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoComplete="email"
          autoCapitalize="none"
          returnKeyType="next"
          submitBehavior="submit"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />
        <TextInput
          ref={passwordRef}
          placeholder="Password"
          secureTextEntry
          autoComplete="password"
          returnKeyType="done"
          onSubmitEditing={onSubmit}
        />
        <Pressable onPress={onSubmit}>
          <Text>Sign in</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
```

<details>
<summary>The same form with react-native-keyboard-controller</summary>

```tsx
import { TextInput } from 'react-native';
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from 'react-native-keyboard-controller';

// <KeyboardProvider> wraps the app in the root layout
export function SignInForm() {
  return (
    <>
      <KeyboardAwareScrollView
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 16, gap: 12 }}
      >
        <TextInput placeholder="Email" />
        <TextInput placeholder="Password" secureTextEntry />
      </KeyboardAwareScrollView>
      {/* Previous / next / done above the keyboard, on both platforms */}
      <KeyboardToolbar />
    </>
  );
}
```

</details>

## Follow-up Questions

- Why does the first tap on a button only close the keyboard? The scroll view
  has `keyboardShouldPersistTaps="never"` by default; set `handled`.
- Why is the input still covered under a navigation header? The header height is
  missing from `keyboardVerticalOffset`.
- Why does the tab bar jump above the keyboard on Android? The window is
  resized; use `tabBarHideOnKeyboard` or the `pan` mode.
- How do you animate a view with the keyboard? iOS `keyboardWillShow` gives the
  duration and the final frame; for frame-by-frame sync on both platforms use
  `useKeyboardHandler` from keyboard-controller.
- How do you build a chat input that sticks to the keyboard?
  `KeyboardStickyView` or `KeyboardChatScrollView` from keyboard-controller; on
  iOS the core option was `InputAccessoryView`.

## Common Mistakes

- `KeyboardAvoidingView` without `flex: 1`, or the same `behavior` on both
  platforms, which double-shifts on Android.
- Keyboard listeners without `remove()` in the cleanup.
- A form inside a `ScrollView` without `keyboardShouldPersistTaps`.
- Waiting for `keyboardWillShow` on Android: only the `Did` events fire there.

## See Also

- [Core Components](./core-components.md)
- [Safe Area and Edge-to-Edge](./safe-area.md)
- [Lists](./lists.md)
- [Keyboard handling (Expo docs)](https://docs.expo.dev/guides/keyboard-handling/)
