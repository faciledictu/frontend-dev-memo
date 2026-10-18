---
sidebar_position: 14
description:
  Runtime permissions on iOS and Android, permission statuses, blocked
  permissions and settings, libraries
tags: [middle]
---

# Permissions

Access to the camera, location, photos, contacts, microphone or notifications
needs the user's consent, asked **at runtime**. Each permission is first
**declared** in the native config: a usage description in `Info.plist` on iOS
(the app crashes without it) and `<uses-permission>` in `AndroidManifest.xml` on
Android. A request returns a status; once the user denies it for good
(**blocked**), the app can no longer show the system dialog and can only send
the user to the **Settings** app.

Applies to: React Native 0.88, Expo SDK 58.

## Details

### iOS vs Android

|                  | iOS                                                                                      | Android                                                                                      |
| ---------------- | ---------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| Declared in      | `Info.plist`: `NSCameraUsageDescription` and the like, with the text shown in the dialog | `AndroidManifest.xml`                                                                        |
| Asked at runtime | Every protected permission                                                               | Only "dangerous" ones (camera, location, …); "normal" ones (internet) are granted at install |
| How often        | The system dialog is shown **once**; after a denial the permission is blocked            | Can be asked again; after the second denial it is blocked                                    |
| Partial access   | Limited photo library, approximate location                                              | Approximate location; selected photos (Android 14+)                                          |

Android version changes that come up in interviews:

- **Android 13 (API 33)**: `POST_NOTIFICATIONS` became a runtime permission;
  `READ_EXTERNAL_STORAGE` was split into `READ_MEDIA_IMAGES`, `READ_MEDIA_VIDEO`
  and `READ_MEDIA_AUDIO`.
- **Android 14 (API 34)**: the user can grant access to selected photos only.

### Statuses (`react-native-permissions`)

| Status        | Meaning                                            | What to do                               |
| ------------- | -------------------------------------------------- | ---------------------------------------- |
| `granted`     | Allowed                                            | Use the feature                          |
| `limited`     | Partly allowed (selected photos)                   | Use what is available, offer to add more |
| `denied`      | Not asked yet, or denied but can be asked again    | Explain why, then `request`              |
| `blocked`     | Denied for good, the system dialog will not appear | Explain and offer `openSettings()`       |
| `unavailable` | The device has no such feature                     | Hide the feature                         |

### Libraries

| Library                                 | Notes                                                                                                                                                                        |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PermissionsAndroid` (React Native)     | Android only; returns `granted`, `denied` or `never_ask_again`                                                                                                               |
| `react-native-permissions`              | One API for both platforms, `check` / `request` / `openSettings`                                                                                                             |
| Expo modules                            | Each module has its own `requestPermissionsAsync` / `use…Permissions` hook (`expo-camera`, `expo-location`); the old `expo-permissions` package is no longer part of the SDK |
| `Linking.openSettings()` (React Native) | Opens the app's page in Settings                                                                                                                                             |

### Best Practices

- Ask **in context**, when the user taps the feature, not at launch.
- Show your own explanation before the system dialog: the system one can be
  shown only once on iOS.
- Keep the app usable without the permission, and handle `blocked` with a link
  to Settings.
- Ask for the least: approximate location instead of precise, selected photos
  instead of the whole library. Stores reject apps that request permissions they
  do not need.

## Example

```tsx
import { Alert, Platform } from 'react-native';
import {
  PERMISSIONS,
  RESULTS,
  openSettings,
  request,
} from 'react-native-permissions';

export async function ensureCameraPermission(): Promise<boolean> {
  const permission =
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA;

  const result = await request(permission);

  if (result === RESULTS.GRANTED || result === RESULTS.LIMITED) return true;

  if (result === RESULTS.BLOCKED) {
    Alert.alert(
      'Camera access is off',
      'Turn it on in Settings to scan codes.',
      [
        { text: 'Cancel', style: 'cancel' },
        // highlight-next-line
        { text: 'Open Settings', onPress: () => openSettings() },
      ]
    );
  }
  return false;
}
```

## Follow-up Questions

- `check` or `request`? `check` never shows a dialog; call it first to decide
  whether to explain why the permission is needed. On Android it never returns
  `blocked`; only `request` reveals it.
- Where do the iOS permission texts go in an Expo app? In config plugin options
  in `app.json` (for example `expo-camera`'s `cameraPermission`), applied at
  prebuild.
- How do you get location in the background? A separate permission, asked after
  the foreground one: "Always" on iOS, `ACCESS_BACKGROUND_LOCATION` on Android
  (on Android 11+ the request opens Settings). The tracking itself is covered in
  [App Lifecycle](./app-lifecycle.md#background-options).
- How do you test the blocked state? On iOS, turn it off in Settings; on
  Android, deny it twice. Reinstall the app to start over.

## Common Mistakes

- Forgetting the `Info.plist` usage description: the app crashes on iOS at the
  moment of the request.
- Asking for all permissions on the first launch: users deny them, and on iOS
  they cannot be asked again.
- Treating `denied` and `blocked` the same: after `blocked`, `request` returns
  immediately without a dialog.

## See Also

- [Push Notifications](./notifications.md)
- [App Lifecycle and Background Work](./app-lifecycle.md)
- [Platform-Specific Code](./platform-specific-code.md)
