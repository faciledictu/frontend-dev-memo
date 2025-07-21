---
sidebar_position: 13
---

# Timers and requestAnimationFrame

:::tip When to Use

- Use `requestAnimationFrame` for animations, UI transitions, and tasks tied to
  the rendering lifecycle.
- Use timers (`setInterval`, `setTimeout`) for non-visual tasks like polling
  APIs, game logic, or background data processing.

:::

## Comparison

| **Aspect**                | **`requestAnimationFrame`**                       | **`setInterval`/`setTimeout`**                        |
| ------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| **Frame Synchronization** | Tied to the screen's refresh rate (e.g., 60fps).  | Independent of the refresh rate.                      |
| **Performance**           | Optimized for animations; skips frames if needed. | Can lead to janky animations if delayed.              |
| **Overhead**              | Lower overhead since it runs only when needed.    | Can execute even when the screen isn't updating.      |
| **Power Efficiency**      | Pauses in background or hidden views.             | Runs regardless of app state unless manually stopped. |
| **Purpose**               | Best for animations and UI updates.               | Suitable for periodic non-UI tasks.                   |

## Using requestAnimationFrame

Using requestAnimationFrame in React Native allows you to perform smooth
animations by scheduling updates for the next frame. It integrates with the UI
rendering cycle, ensuring high performance and synchronizing with the screen
refresh rate.

```javascript
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

## How requestAnimationFrame Works Internally

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
