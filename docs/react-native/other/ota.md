---
sidebar_position: 4
---

# Over The Air (OTA) Updates

OTA updates let you push JavaScript bundle changes directly to users without
going through the app stores. This is great for urgent bug fixes or small
tweaks.

**CodePush** has been around longer and works with any RN app (you install the
react-native-code-push SDK) but now the SDK is deprecated.

**EAS Update** is newer and integrates with the Expo ecosystem, offering
features like rollout percentages and rollbacks

To use EAS Update, install `expo-updates` and run `eas update:configure`.
Publish an update with:

```bash
eas update --branch production
```

:::tip Best Practices

In emergencies, an OTA release can fix a critical bug within minutes, bypassing
store review delays.

**Use OTA only for JS/asset changes.** Do not attempt to change native code that
way. Keep in mind the App Store terms: updating UI/business logic via OTA is
allowed (React Native’s license specifically permits JS updates), but adding
entirely new native features requires an app store release.

**Use version checks** so that OTA updates are only applied to compatible app
binary versions.

:::
