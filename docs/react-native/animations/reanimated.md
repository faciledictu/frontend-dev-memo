---
sidebar_position: 2
description:
  Reanimated 4 shared values, worklets and the UI thread, animated styles,
  layout animations, CSS animations, why it is faster than Animated
---

# Reanimated

**Reanimated** is the standard animation library for React Native. Animation
logic runs on the **UI thread** as **worklets**: small JS functions that the
Babel plugin copies into a second JS runtime living on the UI thread. State
lives in **shared values** (`useSharedValue`), readable and writable from both
threads; `useAnimatedStyle` turns them into styles that are applied to the view
on every frame **without React re-renders and without the JS thread**. Version 4
adds **CSS-like animations and transitions** and works only on the New
Architecture.

Applies to: Reanimated 4, React Native 0.87.

## Details

### Core API

| API                                       | What it does                                                                               |
| ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| `useSharedValue(initial)`                 | A value shared by JS and UI threads; read and write with `.value` (or `.get()` / `.set()`) |
| `useAnimatedStyle(() => style)`           | A worklet that computes a style from shared values; re-runs when they change               |
| `useDerivedValue(() => value)`            | A shared value computed from others, like `useMemo` on the UI thread                       |
| `useAnimatedProps`                        | Same as `useAnimatedStyle` for non-style props (SVG `d`, `TextInput` text)                 |
| `useAnimatedScrollHandler`                | Handles scroll events on the UI thread                                                     |
| `withTiming`, `withSpring`, `withDecay`   | Animate a shared value to a target: `x.value = withSpring(100)`                            |
| `withSequence`, `withRepeat`, `withDelay` | Compose animations                                                                         |
| `interpolate`, `interpolateColor`         | Map a value from one range to another                                                      |
| `cancelAnimation(sv)`                     | Stop an animation on a shared value                                                        |

### Threads and Worklets

- A function becomes a **worklet** with the `'worklet'` directive; callbacks of
  `useAnimatedStyle`, `useDerivedValue` and gesture callbacks are workletized
  automatically by the Babel plugin.
- A worklet captures the variables it uses by copy; it cannot touch React state
  or call ordinary JS functions directly.
- To call a JS-thread function from a worklet (set state, log analytics), use
  `scheduleOnRN(fn, ...args)` from `react-native-worklets` (formerly
  `runOnJS(fn)(...args)`). To run a worklet on the UI thread from JS, use
  `scheduleOnUI` (formerly `runOnUI`).
- Reading `.value` on the JS thread is synchronous and can block; do not read
  shared values during render.

### Layout and CSS Animations

| Feature            | How                                                                                                      |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Entering / exiting | `<Animated.View entering={FadeIn} exiting={FadeOut} />`: animates mount and unmount                      |
| Layout transitions | `layout={LinearTransition}`: animates position and size changes after a re-render                        |
| CSS transitions    | `transitionProperty`, `transitionDuration` in the style: a change of that style prop animates (new in 4) |
| CSS animations     | `animationName` with keyframes, `animationDuration`, `animationIterationCount` (new in 4)                |

CSS transitions and animations are the simplest choice for state-driven
animations; shared values are for gestures, scroll and anything interactive.

### Why Reanimated Is Faster than Animated

| Animated                                                      | Reanimated                                          |
| ------------------------------------------------------------- | --------------------------------------------------- |
| Native driver: only `transform` / `opacity`, fixed animations | Any style property on the UI thread                 |
| Logic (gesture → value) runs in JS                            | Logic is a worklet on the UI thread; JS can be busy |
| Layout properties need JS on every frame                      | Layout properties are animated without JS           |

### Version History

| Version | What changed                                                                                     |
| ------- | ------------------------------------------------------------------------------------------------ |
| 1       | Declarative "nodes" API; removed                                                                 |
| 2, 3    | Shared values, worklets, hooks, layout animations                                                |
| 4       | New Architecture only; worklets moved to `react-native-worklets`; CSS animations and transitions |

## Example

```tsx
import { useState } from 'react';
import { Pressable, Text } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

export function LikeButton() {
  const [likes, setLikes] = useState(0);
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const onPress = () => {
    scale.value = withTiming(1.3, { duration: 100 }, (finished) => {
      // A worklet on the UI thread: go back to JS to update React state
      if (finished) scheduleOnRN(setLikes, likes + 1);
      scale.value = withSpring(1);
    });
  };

  return (
    <Pressable onPress={onPress}>
      <Animated.View entering={FadeIn} style={animatedStyle}>
        <Text>♥ {likes}</Text>
      </Animated.View>
    </Pressable>
  );
}
```

<details>
<summary>CSS transition</summary>

```tsx
import Animated from 'react-native-reanimated';

export function Panel({ open }: { open: boolean }) {
  return (
    <Animated.View
      style={{
        height: open ? 200 : 0,
        transitionProperty: 'height',
        transitionDuration: 300,
      }}
    />
  );
}
```

</details>

## Common Mistakes

- Describing Reanimated 1: "nodes" and `Transitioning` no longer exist.
- Mentioning `useNativeDriver` with Reanimated: it is an `Animated` option.
- Calling a regular JS function or `setState` directly inside a worklet: it
  crashes; wrap it in `scheduleOnRN`.
- Setting React state on every frame of a gesture instead of a shared value.

## See Also

- [Animated API](./animated.md)
- [Gestures](./gestures.md)
- [Architecture](../rn-architecture.md)
