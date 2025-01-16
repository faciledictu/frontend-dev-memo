---
sidebar_position: 4
---

# Handling gestures

Handling gestures in React Native Reanimated is done effectively using a
combination of `react-native-reanimated` and `react-native-gesture-handler`.

## Step-by-Step Guide

1. **Import Necessary Libraries**

   First, import the necessary hooks and components from both libraries.

   ```javascript
   import React from 'react';
   import { View } from 'react-native';
   import { PanGestureHandler } from 'react-native-gesture-handler';
   import Animated, {
     useAnimatedGestureHandler,
     useSharedValue,
     useAnimatedStyle,
   } from 'react-native-reanimated';
   ```

2. **Initialize Shared Values**

   Shared values are necessary to store and manipulate the animated state. For
   gesture-based animations, typically they will hold information related to
   position or transformation.

   ```javascript
   const translateX = useSharedValue(0);
   const translateY = useSharedValue(0);
   ```

3. **Create Gesture Handlers**

   Use `useAnimatedGestureHandler` to define how your app should respond to
   gestures. This function provides a way to handle gesture-related data
   directly on the UI thread, minimizing the delay and improving responsiveness.

   ```javascript
   const gestureHandler = useAnimatedGestureHandler({
     onStart: (event, context) => {
       context.startX = translateX.value;
       context.startY = translateY.value;
     },
     onActive: (event, context) => {
       translateX.value = context.startX + event.translationX;
       translateY.value = context.startY + event.translationY;
     },
     onEnd: () => {
       // Optionally handle gesture end event
     },
   });
   ```

4. **Define Animated Styles**

   Use `useAnimatedStyle` to link animated values to component styles to modify
   their appearance or position when gestures occur.

   ```javascript
   const animatedStyle = useAnimatedStyle(() => {
     return {
       transform: [
         { translateX: translateX.value },
         { translateY: translateY.value },
       ],
     };
   });
   ```

5. **Apply Gesture and Animation to Components**

   Wrap your target component with the `PanGestureHandler` and attach the
   `gestureHandler`, while also applying the `animatedStyle`.

   ```javascript
   return (
     <PanGestureHandler onGestureEvent={gestureHandler}>
       <Animated.View
         style={[
           { width: 100, height: 100, backgroundColor: 'blue' },
           animatedStyle,
         ]}
       />
     </PanGestureHandler>
   );
   ```

## PanResponder

PanResponder provides full control over multiple touches. You can track and
manage `gestureState.numberActiveTouches` to handle multi-touch gestures like
_pinch-to-zoom_ or _rotation_.

The gesture responder system in React Native is a low-level interface for
handling touch interactions.

- PanResponder wraps these handlers and provides:
- A native `event` object: Contains the raw event details (e.g., touch
  positions, timestamps, etc.).

- A `gestureState` object.

`gestureState` is an object passed to many of the gesture handler callbacks
(e.g., onPanResponderMove, onPanResponderRelease) that contains detailed
information about the current state of the user’s gesture. It provides a range
of data points about touch behavior, such as velocity, distance, and the number
of active touches.

```javascript
onPanResponderMove: (event, gestureState) => {};
```

### Exapmle[^1]

```javascript
const ExampleComponent = () => {
  const panResponder = React.useRef(
    PanResponder.create({
      // Ask to be the responder:
      onStartShouldSetPanResponder: (evt, gestureState) => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => true,
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!
        // gestureState.d{x,y} will be set to zero now
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}
        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
      },
      onPanResponderTerminationRequest: (evt, gestureState) => true,
      onPanResponderRelease: (evt, gestureState) => {
        // The user has released all touches while this view is the
        // responder. This typically means a gesture has succeeded
      },
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from becoming the JS
        // responder. Returns true by default. Is currently only supported on android.
        return true;
      },
    })
  ).current;

  return <View {...panResponder.panHandlers} />;
};
```

## Additional Tips

- **Combine Gestures**: With `react-native-gesture-handler`, you can use
  multiple gesture handlers (e.g., `TapGestureHandler`, `PinchGestureHandler`)
  and define combinational gestures like dragging and zooming.

- **State Management**: Store contextual data (e.g., starting positions,
  velocities) to handle transitions from gesture-active to gesture-end states
  effectively.

- **Performance Considerations**: As gesture handlers and animations run on the
  UI thread, they are optimized for responsiveness and can handle complex
  interactions smoothly.

[^1]: https://reactnative.dev/docs/panresponder#usage-pattern
