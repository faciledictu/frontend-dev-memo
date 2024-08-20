---
sidebar_position: 3
---

# Platform-Specific Code

## Platform-Specific File Extensions

You can create platform-specific files by naming them accordingly:

- `Component.ios.js` for iOS-specific code.

- `Component.android.js` for Android-specific code.

- `Component.native.js` picked up by the React Native bundler for both Android
  and iOS (Metro).

- `Component.js` picked up by webpack, Rollup or any other Web bundler.

When you import `Component` without the extension, React Native will
automatically pick the correct file based on the platform.

## `Platform` Module

The Platform module from react-native allows you to write conditional code based
on the platform.

### Specific Styles

```javascript
import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 10,
  },
});
```

You can also use `Platform.select` for more complex cases. It accepts an object
where keys can be one of `'ios' | 'android' | 'native' | 'default'`, and returns
the most fitting value for the platform you are currently running on.

```javascript
const styles = StyleSheet.create({
  container: Platform.select({
    ios: { padding: 20 },
    android: { padding: 10 },
    // other platforms, web for example
    default: { padding: 15 },
  }),
});
```

### Specific Hooks

You can create custom hooks that encapsulate platform-specific logic.

```javascript
import { Platform } from 'react-native';

const usePlatformSpecificLogic = () => {
  if (Platform.OS === 'ios') {
    // iOS-specific logic
  } else if (Platform.OS === 'android') {
    // Android-specific logic
  } else {
    // Web-specific logic
  }
};
```

### Specific Components

```javascript
import { Platform } from 'react-native';
import IOSComponent from './IOSComponent';
import AndroidComponent from './AndroidComponent';

const MyComponent = () => {
  return Platform.OS === 'ios' ? <IOSComponent /> : <AndroidComponent />;
};
```
