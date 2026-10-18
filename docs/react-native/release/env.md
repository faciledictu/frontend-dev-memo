---
sidebar_position: 3
description:
  Environment variables in React Native and Expo, why values in the JS bundle
  are not secret, where to keep real secrets
tags: [middle]
---

# Environment Configuration and Secrets

Environment values (API URL, feature flags, keys of public SDKs) are **inlined
at build time**: there is no `process.env` at runtime on the device. In Expo,
variables prefixed with **`EXPO_PUBLIC_`** are inlined into the JS bundle; in
bare apps, **`react-native-config`** reads `.env` files and exposes the values
to JS and native code. Everything that ends up in the app **is not secret**: the
bundle and the binary can be unpacked. Real secrets stay on a backend, and the
app gets short-lived tokens from it.

Applies to: Expo SDK 58.

## Details

### Tools

| Tool                      | Where values are available                                           | Notes                                                                                                                                                   |
| ------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EXPO_PUBLIC_*` in `.env` | JS                                                                   | Read as `process.env.EXPO_PUBLIC_API_URL`; replaced with the literal at build                                                                           |
| `app.config.ts` (Expo)    | Native config: bundle ID, app name, plugins                          | Can read any env variable at build time; `extra` is readable via `expo-constants`                                                                       |
| EAS environment variables | Builds and updates on EAS                                            | Per environment (development, preview, production); "sensitive" and "secret" ones are hidden in logs, but still end up in the app if the code uses them |
| `react-native-config`     | JS, Android (`BuildConfig`, Gradle), iOS (`Info.plist`, Objective-C) | `ENVFILE=.env.staging` selects the file                                                                                                                 |
| `react-native-dotenv`     | JS only                                                              | A Babel plugin                                                                                                                                          |

### What Is a Secret

| Can be in the app                                | Must stay on the server                      |
| ------------------------------------------------ | -------------------------------------------- |
| API base URL, feature flags                      | Payment provider secret keys                 |
| Public keys of SDKs: Maps, Sentry DSN, analytics | Database credentials, admin tokens           |
| OAuth client ID                                  | OAuth client secret, third-party API secrets |

Build-time secrets (keystore passwords, App Store Connect API key, EAS token)
belong in CI secrets or EAS credentials, not in the repository.

### One Environment per Build

Build a separate binary per environment (separate EAS build profiles, Gradle
flavors or Xcode schemes) and load only its values. A production build that also
contains staging URLs and keys leaks them.

## Example

```bash title=".env.production"
EXPO_PUBLIC_API_URL=https://api.example.com
```

```ts
// Expo: inlined at build time
// highlight-next-line
const apiUrl = process.env.EXPO_PUBLIC_API_URL;
```

<details>
<summary>react-native-config in JS and native code</summary>

```ts
import Config from 'react-native-config';

const apiUrl = Config.API_URL;
```

```groovy title="android/app/build.gradle"
apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"

android {
    defaultConfig {
        applicationId project.env.get("APP_ID")
    }
}
```

```java
// Android: values become BuildConfig fields
String apiUrl = BuildConfig.API_URL;
```

On iOS, use `$(API_URL)` in `Info.plist` or `[RNCConfig envFor:@"API_URL"]` in
Objective-C.

</details>

## Follow-up Questions

- Where do you store a user's token on the device? In the iOS Keychain or, on
  Android, encrypted with a Keystore key, through `expo-secure-store` or
  `react-native-keychain`, not in AsyncStorage.
- How do you change the API URL without a rebuild? Publish an OTA update
  (`EXPO_PUBLIC_` values are in the JS bundle) or fetch the configuration from
  the backend at runtime; values in native code need a new build.

## Common Mistakes

- Putting an API secret in `.env` and thinking it is hidden: it is inlined into
  the bundle as plain text.
- Expecting `process.env.API_URL` without the `EXPO_PUBLIC_` prefix to work in
  Expo app code: it is `undefined`.
- Reading env variables dynamically (`process.env[name]`): only static
  references are inlined.

## See Also

- [Publishing and Distribution](./distribution.md)
- [OTA Updates](./ota.md)
