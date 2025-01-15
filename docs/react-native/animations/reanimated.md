---
sidebar_position: 3
---

# React Native Reanimated

React Native Reanimated is an advanced library designed to form more complex,
performant animations beyond what the core Animated API provides. Catering
specifically to the needs of modern mobile applications, Reanimated offers a
declarative approach to animations, allowing you to define animations in a
concise and efficient manner. It leverages worklets to run animations on a
separate thread, offering unparalleled performance.

## Core Concepts

### Declarative Animation API

React Native Reanimated emphasizes a declarative API style. In contrast to
imperative animations where developers control the flow manually, declarative
APIs express logic in terms of "what" should happen rather than "how." This
makes code more predictable, easier to read, and less prone to errors.

```javascript
import { useSharedValue, withTiming } from 'react-native-reanimated';

// Define a shared value for an animated property
const opacity = useSharedValue(0);

// Define an animation in terms of "what" should happen
const fadeIn = () => {
  opacity.value = withTiming(1, { duration: 1000 });
};
```

### Understanding Nodes and Transitions

Nodes in Reanimated represent the basic building blocks for animations, akin to
functions or variables in traditional programming. Transitions enhance
declarative means by enabling smooth state changes within React Native.

#### Nodes

- Nodes provide a way to define animations in a complex flow.
- They allow creation of dynamic animations by interconnecting various animated
  properties without describing imperative flows.

#### Transitions

- Transitions offer a higher-level abstraction over nodes for managing
  transition effects when state changes.

```javascript
import { Transitioning, Transition } from 'react-native-reanimated';

// Define a transition
const transition = (
  <Transition.Together>
    <Transition.In type="fade" durationMs={200} />
    <Transition.Out type="fade" durationMs={200} />
  </Transition.Together>
);
```

### High Performance Declarative Animation

Running high-performance animations is crucial for a smooth user experience.
Reanimated provides several tools and mechanisms to ensure that your app
animations run flawlessly:

- **Use Worklets**: Execute JavaScript code directly on the UI thread, reducing
  overhead and avoiding frame drops.
- **Shared Values**: They represent mutable references allowing direct
  interactions within animations without reevaluations.

```javascript
// Worklet executes on UI thread
import { useAnimatedStyle, withSpring } from 'react-native-reanimated';

const animatedStyle = useAnimatedStyle(() => {
  return {
    transform: [{ scale: withSpring(opacity.value) }],
  };
});
```

## Advanced Features

### Worklets and Shared Values

Worklets are isolated JavaScript running environments enabling animations to
occur off of the JavaScript thread. They operate with `shared values` that can
be safely accessed and manipulated within these worklets.

#### Defining Worklets

```javascript
import { withSpring, runOnUI } from 'react-native-reanimated';

// Using runOnUI to execute synchronous animations
runOnUI(() => {
  'worklet'; // Mark function as worklet
  const animation = withSpring(1);
})();
```

#### Using Shared Values

Shared values are mutable references that store animated state shared between
worklets and components:

```javascript
const scale = useSharedValue(1); // Initiate a shared value
```

## Web Support

React Native Reanimated supports web platforms, providing a consistent animation
experience across different environments. Libraries like `react-native-web`
ensure integration without significant changes to the codebase.

- Ensure compatibility by configuring the build environment appropriately.
- Use polyfills for certain platform-specific APIs.

## Optimisation Tips

- Minimize the number of properties being animated simultaneously.
- Leverage the `useNativeDriver` for purely transform/opacity animations,
  reducing JavaScript execution.
- **Avoid Memory Leaks**: Clean up animations and ensure worklet resources are
  freed when components are unmounted.
- **Efficient Reuse**: Where possible, reuse shared values and animations rather
  than creating new instances.
