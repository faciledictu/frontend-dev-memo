---
sidebar_position: 14
---

# Native Libraries and Linking

## Communication Between Native Modules and JavaScript

### Bridge

In React Native, communication between native modules (written in Java/Kotlin
for Android or Objective-C/Swift for iOS) and the JavaScript (JS) side happens
via a bridge. The bridge allows the exchange of data between JavaScript and
native code using an asynchronous message-passing system.

The bridge is the core of React Native’s communication system. It:

- Connects JavaScript and Native Threads: The JavaScript code runs on the
  JavaScript thread, while native code runs on the main UI thread or a separate
  background thread.
- Transfers Serialized Data: Data exchanged across the bridge is serialized into
  JSON-like structures for consistency.

### Modern Communication (JSI)

With the JavaScript Interface (JSI) introduced in React Native, there’s now a
more direct way to interact between JS and native modules:

- JSI eliminates the overhead of the bridge by directly invoking native methods.
- It’s more efficient, as it avoids JSON serialization/deserialization.
- Libraries like Reanimated 2 and react-native-v8 use JSI for faster
  interactions.

## Linking

In React Native, the `react-native link` command was historically used to link
native dependencies to your project. However, with the introduction of
autolinking in React Native 0.60 and later, the need for `react-native link` has
largely been reduced

**Link the Library**: After installing the library, run:

```bash
npx react-native link <library-name>
```

If you omit library-name, it will try to link all installed dependencies that
require linking.

**Rebuild Your App**: Once linked, rebuild your app:

**Conflict with Autolinking**: If you’re using React Native 0.60+, avoid using
react-native link unless absolutely necessary, as it can cause conflicts.

**Manual Linking**: For libraries that don’t support autolinking, you may need
to link them manually by modifying your native configuration files
(`android/settings.gradle`, `android/app/build.gradle`, or `ios/Podfile`).

**Unlinking Libraries**: If a library is linked incorrectly, you can unlink it
using:

```bash
npx react-native unlink <library-name>
```
