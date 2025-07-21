---
sidebar_position: 11
---

# Permissions

Permissions in mobile applications are requests to gain access to certain
features or data on a user's device.

**Why Permissions are Needed:**

- To protect user privacy.
- To enable app functionalities that rely on system features.
- To ensure compliance with platform requirements.

## Common Permissions

Some standard permissions include:

- **Camera**: Accessing the device's camera for capturing photos or videos.
- **Location**: Obtaining the geographic location of the device.
- **Contacts**: Reading the user's contacts list.
- **Storage**: Reading and writing data to the device storage.
- **Microphone**: Audio recording purposes.

## Permission Handling

**Android:** On Android, permissions are categorized into "Normal permissions"
and "Dangerous permissions". Normal permissions are granted automatically, while
dangerous ones require explicit user consent.

**iOS:** On iOS, permissions are handled via a prompt the first time they are
needed, with user consent required to proceed. Additionally, developers must
provide a description in the `Info.plist` explaining why the permission is
needed.

## Using React Native's Built-In Permissions

React Native provides basic facilities for interacting with permissions, though
it may not cover all complex scenarios. The `PermissionsAndroid` module, for
example, helps request permissions on Android platforms.

Example for requesting permission in Android:

```javascript
import { PermissionsAndroid } from 'react-native';

async function requestCameraPermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'Camera Permission',
        message: 'This app needs access to your camera ',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}
```

For iOS native handling, permissions are usually requested using the specific
libraries tailored for the task, along with configuring the `Info.plist`.

## Third-Party Libraries for Permission Handling

To streamline permission management in React Native, several third-party
libraries are available:

- **react-native-permissions**: A comprehensive library to handle both Android
  and iOS permissions with ease.
- **expo-permissions** (for apps built with Expo): Provides a unified interface
  to check and request device permissions.

Example using react-native-permissions:

```javascript
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';

// Example for accessing location
async function requestLocationPermission() {
  const result = await request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
  );

  if (result === RESULTS.GRANTED) {
    console.log('The location permission is granted!');
  } else if (result === RESULTS.DENIED) {
    console.log('The location permission is denied!');
  } else {
    console.log('The user does not want to be bothered again.');
  }
}
```

## Best Practices

:::tip

Alongside requesting permissions, it's good practice to document how permissions
function within your app and provide channels for users to give feedback. This
transparency helps build trust and encourages users to grant the necessary
permissions.

:::

- **Explain Necessity**: Always provide a clear and concise explanation of why a
  permission is needed.
- **Defer Until Necessary**: Request permissions only when they are needed and
  not at the app launch.
- **Handle Denial Gracefully**: Ensure the app can function without specific
  permissions or guide users on enabling them if required.
- **Respect User's Decision**: Don't repeatedly ask for permissions they have
  denied, unless absolutely necessary.

## Managing Permissions for App Store Compliance

Both Google and Apple's app stores have stringent guidelines related to
permissions, especially regarding privacy. To ensure compliance:

- Provide accurate metadata information regarding permissions.
- Update privacy policy to reflect permission usage.
- Use permissions responsibly and avoid unnecessary requests.
