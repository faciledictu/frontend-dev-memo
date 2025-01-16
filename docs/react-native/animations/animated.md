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
properties like `friction`, `tension`, and `stiffness`.

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
- Understand how to interpolate values for smoother transitions.

## The Native Driver

The `useNativeDriver` option allows animations to be offloaded to the native
layer, which reduces the JavaScript/Main thread's workload, resulting in
smoother animations:

- **Advantages**: Increased performance, especially for animations involving
  non-essential UI threads.
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
- **Profiling Tools**: Use React Native Debugger or similar tools to monitor
  memory usage and performance.
