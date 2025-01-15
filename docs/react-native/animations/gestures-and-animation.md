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
