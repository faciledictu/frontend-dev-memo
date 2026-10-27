---
sidebar_position: 3
description:
  Gesture Responder System, Pressable, PanResponder, React Native Gesture
  Handler and gesture composition
tags: [middle]
---

# Gestures

React Native has a built-in JS touch system, the **Gesture Responder System**:
on each touch, views are asked whether they want to become the **responder**,
and only one view at a time receives the touch. **`Pressable`** is built on it
for taps and long presses, **`PanResponder`** for drags. For anything beyond
that, apps use **React Native Gesture Handler** (RNGH): gestures are recognized
by the platform's native touch system, can run on the UI thread together with
Reanimated, and can be composed (pinch and rotate at once, tap vs double tap).

Applies to: React Native 0.88, Gesture Handler 3, Reanimated 4.

## Details

### Gesture Responder System

| Callback                                                | When                                                                  |
| ------------------------------------------------------- | --------------------------------------------------------------------- |
| `onStartShouldSetResponder`, `onMoveShouldSetResponder` | A touch starts or moves: return `true` to ask to become the responder |
| `onResponderGrant`                                      | The view became the responder: show feedback                          |
| `onResponderMove`                                       | The finger moves                                                      |
| `onResponderRelease`                                    | The finger is lifted                                                  |
| `onResponderTerminationRequest`                         | Another view asks for the responder: return `false` to keep it        |
| `onResponderTerminate`                                  | The responder was taken away (by a parent `ScrollView`, the OS)       |

Who becomes the responder:

- `on*ShouldSetResponder` is asked **bubbling** from the deepest view up, so the
  innermost interested view (a button) wins by default.
- `on*ShouldSetResponderCapture` is asked first, **from the root down**, so a
  parent can take the touch before its children; for example a container that
  must not let a button react while it is being swiped.

### Built-In Tools

| Tool           | Use for                                                                                                                                                |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Pressable`    | Taps and long presses; style by `pressed` state, `hitSlop`. Replaces the older `Touchable*` components                                                 |
| `PanResponder` | A drag in plain JS: `PanResponder.create({...})` wraps the responder callbacks and adds `gestureState` (`dx`, `dy`, `vx`, `vy`, `numberActiveTouches`) |

The responder system runs in JS: a busy JS thread delays the reaction to a
touch, and native views (scroll views, maps) compete with JS responders.

### React Native Gesture Handler

| Concept                  | What it is                                                                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Gesture hooks            | `usePanGesture`, `useTapGesture`, `usePinchGesture`, `useRotationGesture`, `useLongPressGesture`, `useFlingGesture`; config and callbacks in one object |
| `GestureDetector`        | Attaches a gesture to its child view                                                                                                                    |
| Callbacks                | `onBegin` → `onActivate` → `onUpdate` → `onDeactivate` → `onFinalize`                                                                                   |
| UI thread                | With Reanimated installed, callbacks are worklets and update shared values on the UI thread without JS                                                  |
| `GestureHandlerRootView` | Must wrap the app (and the content of every `Modal` on Android); gestures outside it are not recognized                                                 |

Composition of gestures on one view:

| Hook                      | Behavior                                                                | Example                      |
| ------------------------- | ----------------------------------------------------------------------- | ---------------------------- |
| `useSimultaneousGestures` | All can be active at the same time                                      | Pan + pinch + rotate a photo |
| `useCompetingGestures`    | The first to activate cancels the others                                | Pan vs long press            |
| `useExclusiveGestures`    | Priority by order: a gesture activates only after the earlier ones fail | Double tap before single tap |

For gestures on different views: `simultaneousWith`, `requireToFail` and `block`
in the gesture config.

Gesture Handler 2 had a builder API that is still common in existing code and
deprecated in version 3: `Gesture.Pan().onUpdate(...)`, composed with
`Gesture.Simultaneous`, `Gesture.Race` and `Gesture.Exclusive`; `onStart` /
`onEnd` are now `onActivate` / `onDeactivate`. The even older handler components
(`PanGestureHandler`) are deprecated, and Reanimated's
`useAnimatedGestureHandler`, used with them, is removed in Reanimated 4.

## Example

A draggable box that springs back when released:

```tsx
import { StyleSheet } from 'react-native';
import {
  GestureDetector,
  GestureHandlerRootView,
  usePanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

export default function App() {
  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const pan = usePanGesture({
    onUpdate: (event) => {
      x.value = event.translationX;
      y.value = event.translationY;
    },
    onDeactivate: () => {
      x.value = withSpring(0);
      y.value = withSpring(0);
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <GestureHandlerRootView style={styles.root}>
      {/* highlight-next-line */}
      <GestureDetector gesture={pan}>
        <Animated.View style={[styles.box, animatedStyle]} />
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  box: { width: 100, height: 100, backgroundColor: 'royalblue' },
});
```

<details>
<summary>PanResponder example</summary>

```tsx
import { useRef } from 'react';
import { Animated, PanResponder } from 'react-native';

export function Draggable() {
  const position = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: position.x, dy: position.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        Animated.spring(position, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[{ width: 100, height: 100 }, position.getLayout()]}
    />
  );
}
```

Every move event goes through the JS thread, so the drag lags when JS is busy.

</details>

## Follow-up Questions

- How do you allow a horizontal swipe inside a vertical `ScrollView`?
  `activeOffsetX` and `failOffsetY`, so the pan activates only on a clear
  horizontal move.
- What is `hitSlop`? On `Pressable` it extends the touch area without changing
  the layout, but not past the parent's bounds; in Gesture Handler it mainly
  shrinks it: negative values on both platforms, positive only on Android. For
  the minimum target size see
  [Accessibility](../ui/accessibility.md#touch-targets).
- Why does React Native still have the responder system? Core components such as
  `ScrollView` and `Pressable` use it; Gesture Handler is a third-party library.

## Common Mistakes

- Forgetting `GestureHandlerRootView`: `GestureDetector` throws in development,
  and in production the gestures are not recognized.
- Using `TouchableOpacity` in new code instead of `Pressable`.
- Updating React state on every `onUpdate`: it re-renders on every frame; update
  shared values instead.

## See Also

- [Core Components](../ui/core-components.md)
- [Reanimated](./reanimated.md)
- [Accessibility](../ui/accessibility.md)
- [Animated API](./animated.md)
