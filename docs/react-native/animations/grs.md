---
sidebar_position: 2
---

# Gesture Responder System

The Gesture Responder System in React Native is a layered system for managing
touch events and gestures across views in a way that captures the complexity of
user interactions on a touch screen. It allows components to become responders
to touch gestures, managing which component should respond to a particular touch
at any given time. This system is critical for creating seamless and interactive
user interfaces across different input methods.

## Key Concepts

1. **Touchable Components**:

   - React Native provides components like `TouchableOpacity`,
     `TouchableHighlight`, and `TouchableWithoutFeedback` which are built on the
     Gesture Responder System.

2. **Responder Lifecycle**:

   - The lifecycle defines how a component can become a responder to touch
     events:
     - **On Start**: When a touch is initiated, a component can declare its
       interest in becoming the responder.
     - **Grant**: If no other component is a better candidate, the interested
       component becomes the responder.
     - **Move**: While a touch is ongoing, the system can decide to transfer
       responder status to another component if needed.
     - **Release/Terminate**: Once the touch interaction is finished, the
       component releases the responder status.

3. **Responder Callbacks**:

   - Components handle touch events through callback props. Some key callbacks
     include:
     - `onStartShouldSetResponder`: Determines if a component should become
       responder when a touch begins.
     - `onMoveShouldSetResponder`: Called when a touch moves. Determines if a
       component should become responder.
     - `onResponderGrant`: Called when a component becomes the responder.
     - `onResponderMove`: Called repeatedly while the responder is active for
       handling touch movements.
     - `onResponderRelease`: Called when the touch interaction ends.
     - `onResponderTerminate`: Called if the responder status is taken away from
       the component by other controls.

4. **Event Bubbling and Capturing**:

   - Similar to the event system in web development, React Native's Gesture
     Responder System supports event capture and bubbling, allowing events to
     propagate through the hierarchy according to responder status.

5. **Handling Complex Gestures**:
   - For complex gestures like swipes or pinches, it's better to use
     `react-native-gesture-handler`, which complements the built-in Gesture
     Responder System by offering higher-level gesture recognizers.

## Implementing Gesture Responder System

```javascript
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GestureResponderExample = () => {
  const [gestureState, setGestureState] = useState('None');

  const handleStartShouldSetResponder = (evt) => true;

  const handleMoveShouldSetResponder = (evt) => true;

  const handleResponderGrant = (evt) => {
    setGestureState('Touch Started');
  };

  const handleResponderMove = (evt) => {
    setGestureState('Moving...');
  };

  const handleResponderRelease = (evt) => {
    setGestureState('Touch Released');
  };

  return (
    <View
      style={styles.container}
      onStartShouldSetResponder={handleStartShouldSetResponder}
      onMoveShouldSetResponder={handleMoveShouldSetResponder}
      onResponderGrant={handleResponderGrant}
      onResponderMove={handleResponderMove}
      onResponderRelease={handleResponderRelease}
    >
      <Text>{gestureState}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
});

export default GestureResponderExample;
```

## Gesture Event Propagation

### Bubblig Phase Handlers

`onStartShouldSetResponder` and `onMoveShouldSetResponder` are indeed triggered
in the bubbling phase, which means that the deepest child component (the one
closest to the touch point) gets the first opportunity to handle the touch
event.

it ensures that the innermost component — often a button, control, or
interactive element — gets the chance to become the responder if multiple
components return true for these handlers. This behavior is in line with typical
user expectations, ensuring that touch interactions on interactive elements like
buttons are properly handled.

### Capture Phase Handlers

`onStartShouldSetResponderCapture` and `onMoveShouldSetResponderCapture` are
similar to their counterparts, but they are specifically used during the
capturing phase of the touch event.

These handlers provide developers with the ability to decide early in the event
lifecycle whether a parent component should handle touch input, allowing for
more controlled and prioritized touch handling within a React Native
application.
