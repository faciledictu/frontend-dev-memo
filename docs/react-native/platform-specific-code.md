---
sidebar_position: 3
description:
  Platform-specific file extensions, Platform.OS, Platform.select and
  Platform.Version
---

# Platform-Specific Code

There are two ways to write code for one platform. **File extensions**
(`Button.ios.tsx`, `Button.android.tsx`) let the bundler (Metro) pick the right
file at build time; use them when the implementations differ a lot. The
**`Platform` module** (`Platform.OS`, `Platform.select`, `Platform.Version`)
branches at runtime; use it for small differences.

## Details

### File Extensions

| File                    | Picked up by                                               |
| ----------------------- | ---------------------------------------------------------- |
| `Component.ios.tsx`     | iOS build                                                  |
| `Component.android.tsx` | Android build                                              |
| `Component.native.tsx`  | iOS and Android, when there is no `.ios` / `.android` file |
| `Component.web.tsx`     | Web build (React Native Web)                               |
| `Component.tsx`         | Any platform without a more specific file                  |

Import without the extension: `import Component from './Component'`. The other
platform's file is not included in the bundle.

### `Platform` Module

| API                   | What it gives                                                                         |
| --------------------- | ------------------------------------------------------------------------------------- |
| `Platform.OS`         | `'ios'`, `'android'`, `'web'`, …                                                      |
| `Platform.select({})` | The value for the current platform; keys `ios`, `android`, `native`, `web`, `default` |
| `Platform.Version`    | Android: API level as a number (`34`); iOS: system version as a string (`'18.2'`)     |
| `Platform.isPad`      | iOS only: the device is an iPad                                                       |

## Example

```tsx
import { Platform, StyleSheet, PermissionsAndroid } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: Platform.OS === 'ios' ? 20 : 10,
    ...Platform.select({
      ios: { shadowOpacity: 0.2, shadowRadius: 4 },
      android: { elevation: 4 },
      default: {},
    }),
  },
});

// Runtime permission for notifications exists since Android 13 (API 33)
async function askNotificationPermission() {
  if (Platform.OS === 'android' && Platform.Version >= 33) {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
    );
  }
}
```

## See Also

- [Permissions](./permissions.md)
- [StyleSheet](./stylesheet.md)
