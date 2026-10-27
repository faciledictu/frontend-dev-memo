---
sidebar_position: 1
description:
  Animated values, timing / spring / decay, interpolate, composition, the native
  driver, LayoutAnimation, why not to animate with setState
tags: [middle]
---

# Animated API

**`Animated`** is React Native's built-in animation library. An
**`Animated.Value`** holds a number; it is driven by an animation (`timing`,
`spring`, `decay`) and bound to the style of an `Animated.View` /
`Animated.Text`, so the view updates **without re-rendering** the component.
With **`useNativeDriver: true`** the animation is sent to the native side once
and runs on the UI thread, so a busy JS thread does not make it stutter; by
default this works only for non-layout properties such as `transform` and
`opacity`.

Applies to: React Native 0.88.

## Details

### Animation Types

| Function          | Motion                                       | Key options                                                                                                |
| ----------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `Animated.timing` | Over a fixed time with an easing curve       | `toValue`, `duration`, `easing`, `delay`                                                                   |
| `Animated.spring` | Spring physics; ends when the spring settles | `toValue` and one set: `bounciness` / `speed`, `tension` / `friction`, or `stiffness` / `damping` / `mass` |
| `Animated.decay`  | Starts with a velocity and slows down        | `velocity`, `deceleration`; used after a fling                                                             |

Every animation has `.start(callback)` and `.stop()`. The callback gets
`{ finished }`: `false` if the animation was interrupted.

### Composition

| Function                      | What it does                                       |
| ----------------------------- | -------------------------------------------------- |
| `Animated.parallel([...])`    | Starts all at once                                 |
| `Animated.sequence([...])`    | One after another                                  |
| `Animated.stagger(ms, [...])` | Starts each one `ms` after the previous one        |
| `Animated.delay(ms)`          | A pause inside a sequence                          |
| `Animated.loop(animation)`    | Repeats                                            |
| `Animated.add`, `multiply`, … | Combine values arithmetically                      |
| `Animated.event([...])`       | Maps a scroll or gesture event straight to a value |

### `interpolate`

Maps a value from an input range to an output range: numbers, colors, degrees.
One value can drive several properties, for example a header that fades and
shrinks as the list scrolls. `extrapolate: 'clamp'` stops at the range ends.

### The Native Driver

| `useNativeDriver: true`                                     | `useNativeDriver: false`                         |
| ----------------------------------------------------------- | ------------------------------------------------ |
| Runs on the UI thread, smooth even when JS is busy          | Every frame is computed in JS                    |
| `transform`, `opacity` and other non-layout properties      | Any property, including `width`, `height`, `top` |
| Cannot be mixed with JS-driven animations on the same value | —                                                |

Since 0.85 an experimental animation backend (opt-in through the experimental
release channel) lets the native driver animate layout properties too. For
layout properties, gestures and complex logic on the UI thread in a stable
setup, use [Reanimated](./reanimated.md).

### `LayoutAnimation`

`LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` before a
state update animates **all** layout changes of the next render: views move and
resize to their new positions. It is one line, but it cannot be controlled per
view or interrupted.

### Why Not `setState` on Every Frame

Changing state in a `requestAnimationFrame` or `setInterval` loop re-renders the
component 60–120 times a second, and every frame goes through React and to the
native side. When the JS thread is busy (a network response, a heavy render),
frames are dropped and the animation stutters. Animated values change the view
directly and, with the native driver, do not need JS at all.
`requestAnimationFrame` and timers are still fine for non-visual work like
polling.

## Example

```tsx
import { useEffect } from 'react';
import { Animated, useAnimatedValue } from 'react-native';

export function FadeInCard() {
  const progress = useAnimatedValue(0);

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 300,
      // highlight-next-line
      useNativeDriver: true,
    });
    animation.start();
    return () => animation.stop();
  }, [progress]);

  return (
    <Animated.View
      style={{
        opacity: progress,
        transform: [
          {
            translateY: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    />
  );
}
```

## Follow-up Questions

- Why can't the native driver animate `width` by default? It sets view
  properties directly, bypassing the shadow tree, while layout properties need a
  Yoga layout pass.
- How do you animate a color? `interpolate` with color strings in `outputRange`.
- Does `Animated` respect Reduce Motion? No: check
  `AccessibilityInfo.isReduceMotionEnabled()` and skip or shorten the animation,
  see [Accessibility](../ui/accessibility.md#reduce-motion).

## Common Mistakes

- Creating `new Animated.Value(0)` in the component body without
  `useAnimatedValue` or `useRef`: a new value on every render resets the
  animation.
- Animating `width` or `height` with `useNativeDriver: true`: without the
  experimental backend it throws, because layout properties are not supported by
  the native driver.
- Not stopping a running or looping animation on unmount.

## See Also

- [Reanimated](./reanimated.md)
- [Gestures](./gestures.md)
