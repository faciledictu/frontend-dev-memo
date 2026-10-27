---
sidebar_position: 4
description:
  Insets for the notch, status bar and navigation bar,
  react-native-safe-area-context, edge-to-edge on Android 15+, navigators and
  insets
tags: [middle]
---

# Safe Area and Edge-to-Edge

The **safe area** is the part of the screen not covered by system UI: the status
bar, the notch or Dynamic Island, the home indicator, the Android navigation
bar. The sizes of the covered strips are **insets**. Use
**`react-native-safe-area-context`**: `SafeAreaProvider` at the root,
`SafeAreaView` with `edges` for screens, `useSafeAreaInsets()` for custom
headers and bottom bars. `SafeAreaView` from `react-native` is deprecated and
works on iOS only. On Android 15+ apps are **edge-to-edge**, as on iOS: content
draws under the system bars, so insets matter on Android too.

Applies to: React Native 0.88, Expo SDK 58, react-native-safe-area-context 5.

## Details

### Insets

| Edge         | What covers it                                                               |
| ------------ | ---------------------------------------------------------------------------- |
| Top          | Status bar, notch / Dynamic Island                                           |
| Bottom       | iOS home indicator, Android navigation bar (gesture handle or three buttons) |
| Left / right | The notch and rounded corners in landscape                                   |

Insets change with rotation and window size. The keyboard is not part of the
safe area: see [Keyboard Handling](keyboard.md).

### `react-native-safe-area-context`

| API                    | What it does                                                                                |
| ---------------------- | ------------------------------------------------------------------------------------------- |
| `SafeAreaProvider`     | Measures insets; once at the root (Expo Router adds it itself)                              |
| `SafeAreaView`         | A `View` with insets added as padding (`mode="margin"` for margin); `edges` picks the sides |
| `useSafeAreaInsets()`  | `{ top, right, bottom, left }` numbers to use in your own styles                            |
| `useSafeAreaFrame()`   | The frame of the provider, an alternative to window dimensions                              |
| `initialWindowMetrics` | Insets known at launch, passed to the provider to avoid a jump on the first frame           |

- `SafeAreaView` applies insets natively, so a full screen of content does not
  re-render on rotation. Its own padding adds to the inset.
- The hook is preferred for one element that needs the inset in a calculation: a
  header of `56 + insets.top`, a bottom bar with
  `paddingBottom: insets.bottom + 8`, a floating button above the home
  indicator. The background then extends under the system bar, and only the
  content is moved.
- For scrolling content, put the inset into `contentContainerStyle` padding, not
  around the `ScrollView`: the content then scrolls under a translucent bar and
  ends above the home indicator.

### Edge-to-Edge on Android

- Android 15 enforces edge-to-edge for apps targeting API 35; for apps targeting
  API 36, Android 16 removes the opt-out. The app draws under the status bar and
  the navigation bar, as on iOS.
- Expo SDK 54+: always edge-to-edge on Android 16; on older Android versions the
  `edgeToEdgeEnabled` setting decides. Bare app: `edgeToEdgeEnabled=true` in
  `gradle.properties` makes it edge-to-edge on every Android version, not only
  where the OS enforces it. React Native 0.86 fixed `KeyboardAvoidingView`,
  `measureInWindow` and `Dimensions` in this mode.
- What breaks in an old layout: content and headers slide under the status bar,
  bottom buttons hide behind the navigation bar, and the status bar background
  color can no longer be set. The fix is the same as on iOS: apply insets.
- The status bar is transparent: set only the icon color (`barStyle` in
  `StatusBar`, `style` in `expo-status-bar`) and put a colored view behind it.
  The navigation bar is controlled with `expo-navigation-bar` (button style,
  visibility).

### Navigators Already Apply Insets

- React Navigation (and Expo Router on top of it) adds the top inset to the
  header and the bottom inset to the tab bar.
- A screen with a header therefore needs no top inset; wrapping it in
  `SafeAreaView` adds the inset twice and leaves an empty strip. Use
  `edges={['bottom']}` or nothing, depending on the bars on the screen.
- A screen with `headerShown: false`, a custom header or a full-screen modal
  applies the top inset itself.

### Landscape and iPad

- In landscape an iPhone with a notch has a left or right inset and a smaller
  bottom one; keep `left` and `right` in `edges` for text and controls, and let
  backgrounds and images go under.
- iPads have a top inset for the status bar and, on models without a Home
  button, a bottom one; split view and Stage Manager change the window size, so
  read sizes from hooks, not once at startup.

## Example

```tsx title="App.tsx"
import { Text, View } from 'react-native';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

function Header() {
  const insets = useSafeAreaInsets();
  return (
    // highlight-next-line
    <View style={{ paddingTop: insets.top, backgroundColor: '#1e40af' }}>
      <View style={{ height: 56, justifyContent: 'center', padding: 16 }}>
        <Text style={{ color: 'white' }}>Inbox</Text>
      </View>
    </View>
  );
}

function Screen() {
  return (
    <View style={{ flex: 1 }}>
      <Header />
      {/* The header handles the top; this view handles the sides and bottom */}
      <SafeAreaView edges={['left', 'right', 'bottom']} style={{ flex: 1 }}>
        <Text>Content</Text>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <Screen />
    </SafeAreaProvider>
  );
}
```

## Follow-up Questions

- Why is `SafeAreaView` from `react-native` not enough? It is deprecated, works
  only on iOS, has no `edges`, and does not give the numbers for custom layouts.
- Why not hard-code `paddingTop: 44`? Insets differ between devices (Dynamic
  Island, older iPhones, Android bars), orientation and windows.
- What changes for an old Android app when it targets API 35? It becomes
  edge-to-edge: content under the system bars until insets are applied; status
  bar background colors stop working.
- Why is there a double gap under the header? Both the navigator header and a
  `SafeAreaView` around the screen add the top inset.
- How does the web do it? `env(safe-area-inset-top)` in CSS with
  `viewport-fit=cover`.

## Common Mistakes

- Using the deprecated `SafeAreaView` from `react-native`: Android content goes
  under the bars.
- Wrapping every screen in `SafeAreaView` with all edges under a navigator
  header or tab bar.
- Applying the inset to the `ScrollView` style instead of its
  `contentContainerStyle`.
- Reading insets once (or hard-coding them) and not updating on rotation.
- Using the hook or `SafeAreaView` outside `SafeAreaProvider`: it throws; tests
  render the provider with `initialMetrics`.

## See Also

- [StyleSheet](stylesheet.md)
- [Navigation](navigation.md)
- [Keyboard Handling](keyboard.md)
- [react-native-safe-area-context docs](https://appandflow.github.io/react-native-safe-area-context/)
