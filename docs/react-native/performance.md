---
sidebar_position: 20
description:
  Why a React Native app lags, the frame budget of the JS and UI threads,
  measuring in release builds, common causes and fixes, startup time
tags: [middle, senior]
---

# Performance in React Native

Smooth UI means a frame every **16.67 ms** (60 fps), or 8.3 ms on 120 Hz
screens. Two threads must keep up: the **JS thread** (React renders, event
handlers, JS-driven animations) and the **UI thread** (native views, layout,
gestures). A dropped frame on the JS thread makes touches and JS animations lag;
on the UI thread, scrolling and native transitions stutter. First **measure in a
release build**, then find which thread is busy, then fix the cause: usually
extra re-renders, heavy lists, animations driven from JS, or work done in a
touch handler.

Applies to: React Native 0.88, Expo SDK 58.

## Details

### Measuring

- **Never judge speed in a debug build**: development mode adds checks and
  warnings, and the JS is not precompiled. Use a release build
  (`npx expo run:ios --configuration Release`, `--variant release` on Android)
  on a **real, low-end** device.
- **Perf Monitor** (Dev Menu → Perf Monitor): live JS and UI frame rates; shows
  which thread drops frames.
- Profilers: the React Profiler and the Performance panel in
  [React Native DevTools](./debugging.md) for JS; Xcode Instruments and Android
  Studio Profiler for native code.

### Causes and Fixes

| Symptom                                 | Cause                                         | Fix                                                                                          |
| --------------------------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Everything is slow after a state change | Re-renders of large trees                     | Move state down, memoize, React Compiler; see [Re-renders](../react/rendering/re-renders.md) |
| Long lists jank or show blank areas     | `ScrollView` with many items, heavy rows      | `FlatList` / FlashList, light memoized rows; see [Lists](./lists.md)                         |
| Animations stutter while JS is busy     | Animation computed on the JS thread           | Reanimated or `useNativeDriver`; see [Reanimated](./animations/reanimated.md)                |
| A press feels late                      | Heavy work in `onPress` before the UI updates | Update the UI first, then run the work (`setTimeout`), or move it off the JS thread          |
| Slow release builds with many logs      | `console.log` with large objects              | Strip logs in release (`babel-plugin-transform-remove-console`)                              |
| Memory spikes, crashes on image screens | Full-size images scaled down in the view      | Resized images from the server, `expo-image` with caching                                    |
| A screen transition stutters            | The new screen renders everything on mount    | Render the heavy part after the transition (`transitionEnd` listener)                        |

### Startup Time

- **Hermes bytecode**: release builds ship precompiled bytecode, so there is no
  parsing at launch. Keep Hermes on.
- **Lazy screens**: load screen code on first navigation (`React.lazy`), not all
  at launch. Expo Router's async routes do this only on the web; on native they
  are experimental.
- **Inline requires**: Metro moves each `require` call to the place where the
  module is used, so a module runs only when needed. On by default in React
  Native CLI apps, off by default in Expo (`inlineRequires: true` in
  `metro.config.js`).
- **Fewer modules at startup**: heavy libraries (date, charts, SDKs) imported
  from the entry file run before the first screen; import them where they are
  used.
- Do less before the first frame: no blocking network calls behind the splash
  screen; read cached state synchronously (MMKV) and refresh in the background.

### Memory Leaks

- Typical causes: listeners and subscriptions without cleanup
  ([`AppState`](./app-lifecycle.md), [`Keyboard`](./keyboard.md), `Linking`,
  sockets), timers, closures held by a module-level cache, and large images.
- Screens in a stack stay mounted, so a leak in a screen grows with each push.
- Find them with the Memory panel (heap snapshots) in React Native DevTools and
  with Xcode / Android Studio memory tools for native memory.

## Example

A press that updates the UI first and defers the heavy part:

```tsx
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import { buildReport, type Report } from './report';

export function ReportButton() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<Report | null>(null);

  const onPress = () => {
    setLoading(true); // the press feedback is committed first
    // highlight-next-line
    setTimeout(() => {
      // Heavy synchronous work runs in a later task, after the UI update
      setReport(buildReport());
      setLoading(false);
    }, 0);
  };

  return (
    <Pressable onPress={onPress} disabled={loading}>
      <Text>
        {loading ? 'Building…' : report ? report.title : 'Build report'}
      </Text>
    </Pressable>
  );
}
```

## Follow-up Questions

- The JS frame rate drops but scrolling is smooth; why? Scrolling runs on the UI
  thread; a busy JS thread shows as late touches, JS-driven animations and
  delayed updates.
- Why can an animation stay smooth while JS is blocked? Reanimated worklets and
  the native driver run it on the UI thread without JS on every frame.
- What is TTI and how do you measure startup? Time to interactive: from the tap
  on the icon to a usable first screen. Measure in release builds with native
  markers or a performance library, cold start separately from warm.
- Why is the app fast in the simulator and slow on users' phones? The simulator
  uses the computer's CPU; test on a low-end Android device.
- Does the New Architecture make the app faster by itself? It removes the bridge
  overhead and allows synchronous layout, but re-renders and heavy lists cost
  the same.
- How do you find which JS code is slow? Record in the Performance panel of
  React Native DevTools (a flame chart of JS and React tracks) and in the React
  Profiler; see [Debugging](./debugging.md).

## Common Mistakes

- Profiling in a debug build and "fixing" the overhead of development mode.
- `useMemo` and `memo` everywhere without measuring: the cost moves, the lag
  stays.
- Animating with `setState` on every frame.
- Leaving `console.log` in hot paths in production.

## See Also

- [Debugging React Native](./debugging.md)
- [Architecture](./rn-architecture.md)
- [Optimization in React](../react/performance/optimization.md)
