---
sidebar_position: 21
description:
  React Native DevTools and its panels, LogBox, native logs from Xcode and
  logcat, crash reporting in production with source maps
tags: [junior, middle]
---

# Debugging React Native

In development, JS is debugged in **React Native DevTools**: press **`j`** in
the Metro terminal or choose **Open DevTools** in the Dev Menu. It is Chrome
DevTools connected directly to Hermes, with Console, Sources (breakpoints),
Network, Performance, Memory and the React Components and Profiler panels.
Errors and warnings also show in the app as **LogBox**. Native crashes are read
in **Xcode** and **`adb logcat`**, and production crashes come from a **crash
reporter** (Sentry, Crashlytics) with source maps.

Applies to: React Native 0.88, Expo SDK 58.

## Details

### React Native DevTools Panels

| Panel       | What it is for                                                            |
| ----------- | ------------------------------------------------------------------------- |
| Console     | Logs and errors from the app; evaluate JS in the running app              |
| Sources     | Breakpoints, `debugger` statements, stepping; source maps show your files |
| Network     | Requests made with `fetch`, `XMLHttpRequest` and images                   |
| Performance | JS profiling and React tracks on one timeline                             |
| Memory      | Heap snapshots and allocations, for leaks                                 |
| Components  | The React tree, props, state and hooks; select a view on screen           |
| Profiler    | React renders: which components rendered, why and how long                |

- It works with Hermes only and debugs the code running on the device; nothing
  runs in the browser.
- Expo apps also get a separate Expo Network panel, and DevTools plugins for
  libraries (TanStack Query, React Navigation) through Expo's dev tools.

### What It Replaced

- **Chrome remote debugging** ran the app's JS in the browser instead of on the
  device: different engine, no JSI, synchronous native calls broke.
- **Flipper**, a separate desktop app with plugins.
- Both were dropped in 0.74–0.79; DevTools covers what they did.

### LogBox

- `console.error` and warnings show as a toast; a fatal error and a render error
  show full screen with the component stack.
- `LogBox.ignoreLogs(['…'])` hides known warnings; hiding everything with
  `LogBox.ignoreAllLogs()` also hides real problems.
- While DevTools is open, LogBox shows only fatal errors; the rest go to the
  Console.
- In release builds LogBox, the Dev Menu and DevTools are disabled; an uncaught
  error crashes the app.

### Native Logs

- A crash before JS starts, a missing native module or a permission problem
  shows only in native logs.
- **iOS**: the Xcode console (run the app from Xcode), Console.app for a device,
  or `npx react-native log-ios` in a Community CLI project.
- **Android**: `adb logcat`, filtered to React Native with
  `adb logcat "*:S" ReactNative:V ReactNativeJS:V`, or Android Studio's Logcat.

### Production Crashes

- A crash reporter catches JS errors and native crashes and sends them with the
  device, OS, app version and breadcrumbs. Sentry (`@sentry/react-native`) does
  both; Firebase Crashlytics is common for native crashes.
- **Source maps**: the release bundle is minified Hermes bytecode; upload the
  source maps for every build and every OTA update, or stack traces point to
  nothing useful.
- **Symbolication**: native stack traces need debug symbols (dSYM on iOS,
  ProGuard / R8 mapping and native symbols on Android).
- Tag reports with the release and the OTA update ID to tell which code crashed.

## Example

```bash
# Metro is running: press j to open React Native DevTools
npx expo start

# Native logs
xcrun simctl spawn booted log stream --predicate 'process == "MyApp"'
# highlight-next-line
adb logcat "*:S" ReactNative:V ReactNativeJS:V
```

<details>
<summary>Sentry in an Expo app</summary>

```bash
# Adds the SDK, the config plugin and the Metro config
npx @sentry/wizard@latest -i reactNative
```

```tsx title="app/_layout.tsx"
import * as Sentry from '@sentry/react-native';
import { Stack } from 'expo-router';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN, // a DSN is public
  enabled: !__DEV__,
});

function RootLayout() {
  return <Stack />;
}

export default Sentry.wrap(RootLayout);
```

Source maps are uploaded during EAS builds when `SENTRY_AUTH_TOKEN` is set;
after `eas update`, run `npx @sentry/expo-upload-sourcemaps dist`.

</details>

## Follow-up Questions

- The app crashes right at launch with no red screen; where do you look? Native
  logs: Xcode or `adb logcat`. The crash happens before JS runs, so LogBox and
  DevTools see nothing.
- Why did debugging in Chrome change behavior? The JS ran in Chrome's V8 on the
  computer, not in Hermes on the device, so timing, globals and synchronous
  native calls differed.
- How do you debug a release-only bug? Run a release build locally, read native
  logs, and check the crash reporter; DevTools are not available in release.
- How do you inspect network requests of a native SDK? The Network panel sees
  only JS requests; use a proxy (Proxyman, Charles) or the native profilers.
- How do you see which component re-rendered and why? The Profiler panel with
  "Record why each component rendered" turned on; see
  [Re-renders](../react/rendering/re-renders.md).

## Common Mistakes

- Debugging performance with DevTools open in a debug build and taking the
  numbers as real.
- Not uploading source maps for OTA updates: crashes in the updated code have
  unreadable stacks.
- `LogBox.ignoreAllLogs()` to make warnings go away.
- Searching JS for the cause of a native crash.

## See Also

- [Performance](./performance.md)
- [Debugging Web Applications](../web-platform/tools/debugging.md)
- [OTA Updates](./release/ota.md)
