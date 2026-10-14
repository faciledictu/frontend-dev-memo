---
sidebar_position: 1
---

# React Native Animated

React Native Animated is a powerful library within the React Native ecosystem
that allows developers to create smooth and effective animations.

## Types of Animation

### Timing

These animations are based on a duration and easing function.

_Example:_ Animating opacity or position smoothly over a set time.

```javascript
Animated.timing(value, {
  toValue: 1,
  duration: 500,
  useNativeDriver: true, // For performance optimization
}).start();
```

### Spring

Mimics natural spring-like motion, ideal for bounce effects. Configurable with
properties like either `friction` and `tension` or `stiffness`, `damping` and
`mass` (the two sets cannot be mixed).

_Example:_ UI components following user interactions, like a button press that
scales and then springs back to its original size.

```javascript
Animated.spring(value, {
  toValue: 1,
  friction: 5,
  tension: 40,
  useNativeDriver: true,
}).start();
```

### Decay

Gradually slows down an animation, mimicking inertia.

Great for scroll or fling effects.

```javascript
Animated.decay(value, {
  velocity: 2,
  deceleration: 0.997,
  useNativeDriver: true,
}).start();
```

## Combining Animations

### Parallel Animations

Runs multiple animations simultaneously.

```javascript
Animated.parallel([
  Animated.timing(opacity, {
    toValue: 1,
    duration: 500,
    useNativeDriver: true,
  }),
  Animated.timing(translateX, {
    toValue: 100,
    duration: 500,
    useNativeDriver: true,
  }),
]).start();
```

### Sequence Animations

Runs animations one after the other in a predefined order.

```javascript
Animated.sequence([
  Animated.timing(value, { toValue: 1, duration: 500, useNativeDriver: true }),
  Animated.timing(value, { toValue: 0, duration: 500, useNativeDriver: true }),
]).start();
```

### Stagger Animations

Introduces a delay between animations in a sequence, creating cascading effects.

```javascript
Animated.stagger(200, [
  Animated.timing(value1, { toValue: 1, duration: 500, useNativeDriver: true }),
  Animated.timing(value2, { toValue: 1, duration: 500, useNativeDriver: true }),
]).start();
```

### Incorporating Animation with Components

- Use the `Animated` components (e.g., `Animated.View`, `Animated.Text`) to
  attach animated values and execute animations on them.
- Use `interpolate` to map an animated value to another range, such as `0..1` to
  `0..100` px or to a color.

## The Native Driver

The `useNativeDriver` option allows animations to be offloaded to the native
layer, which reduces the JavaScript/Main thread's workload, resulting in
smoother animations:

- **Advantages**: Increased performance, especially when the JS thread is busy.
- **Limitations**: Only supports transform and opacity properties.

## Performance Optimization

### Time Performance

- **Optimize animation duration**: Ensure appropriate duration for animations.
  Too long or too short can impair user experience.
- **Avoid unnecessary calculations**: Keep computational work minimal during
  animation cycles.

### Memory Leaks

- **Clean Up**: Ensure that animated values or listeners are properly cleared to
  prevent memory leaks.
- **Profiling Tools**: Use React Native DevTools or similar tools to monitor
  memory usage and performance.

## Timers and requestAnimationFrame

:::tip[When to Use]

- Use `requestAnimationFrame` for animations, UI transitions, and tasks tied to
  the rendering lifecycle.
- Use timers (`setInterval`, `setTimeout`) for non-visual tasks like polling
  APIs, game logic, or background data processing.

:::

### Comparison

| **Aspect**                | **`requestAnimationFrame`**                       | **`setInterval`/`setTimeout`**                        |
| ------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| **Frame Synchronization** | Tied to the screen's refresh rate (e.g., 60fps).  | Independent of the refresh rate.                      |
| **Performance**           | Optimized for animations; skips frames if needed. | Can lead to janky animations if delayed.              |
| **Overhead**              | Lower overhead since it runs only when needed.    | Can execute even when the screen isn't updating.      |
| **Power Efficiency**      | Pauses in background or hidden views.             | Runs regardless of app state unless manually stopped. |
| **Purpose**               | Best for animations and UI updates.               | Suitable for periodic non-UI tasks.                   |

### Using requestAnimationFrame

Using requestAnimationFrame in React Native allows you to perform smooth
animations by scheduling updates for the next frame. It integrates with the UI
rendering cycle, ensuring high performance and synchronizing with the screen
refresh rate.

```jsx
import React, { useRef, useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const AnimatedBox = () => {
  const [position, setPosition] = useState(0);
  const animationRef = useRef(null);

  const animate = () => {
    setPosition((prevPosition) => {
      const nextPosition = prevPosition + 5; // Increment position
      if (nextPosition > 300) return 0; // Reset after reaching 300
      return nextPosition;
    });

    // Schedule next frame
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);

    // Clean up animation on unmount
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.box, { transform: [{ translateX: position }] }]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    width: 50,
    height: 50,
    backgroundColor: 'blue',
  },
});

export default AnimatedBox;
```

### How requestAnimationFrame Works Internally

1. Frame Synchronization

   The browser (or the React Native runtime) calls the function you pass to
   requestAnimationFrame just before the next repaint. This ensures the updates
   occur in sync with the display refresh rate (usually 60fps, equating to
   16.67ms per frame).

2. Rendering Queue

   Instead of running immediately, the callback is queued and invoked as part of
   the rendering pipeline, allowing the system to batch updates for efficiency.

3. Throttling

   If the system is under heavy load and can’t maintain 60fps, it automatically
   adjusts the callback frequency, reducing unnecessary work.

4. High Priority

   The callbacks are part of the native rendering loop, ensuring they are
   prioritized over non-essential background tasks.
