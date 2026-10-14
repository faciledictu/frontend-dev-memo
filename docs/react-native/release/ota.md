---
sidebar_position: 4
description:
  What over-the-air updates can change without the store, EAS Update, runtime
  versions, what happened to CodePush, store rules
---

# Over-the-Air (OTA) Updates

An OTA update replaces the **JS bundle and assets** of an installed app without
a store release: the app downloads the new bundle from an update server and runs
it, usually **on the next launch**. Native code (new native modules,
permissions, SDK upgrades) cannot change this way and needs a store build. An
update must target builds with compatible native code, which is what the
**runtime version** is for. The standard tool is **EAS Update** (`expo-updates`,
works in bare apps too); Microsoft's **CodePush** was shut down with App Center
on March 31, 2025.

Applies to: Expo SDK 57.

## Details

### How EAS Update Works

- `eas update --channel production` uploads a new bundle to an update branch;
  builds subscribe to a **channel** set in their build profile.
- On launch the app checks for an update, downloads it in the background and
  applies it on the next cold start (or immediately with
  `Updates.reloadAsync()`).
- **`runtimeVersion`** marks native compatibility: an update reaches only builds
  with the same runtime version. Policies: `appVersion` (bump with the app
  version) or **`fingerprint`** (a hash of the native code and config, changes
  automatically when native code does).
- Rollouts: publish to a percentage of users; roll back by republishing the
  previous update or to the one embedded in the build (`eas update:rollback`).
  If an update crashes before its first screen renders, `expo-updates` may roll
  back to the previous one, but this is a last resort, not a safety net.

### What Happened to CodePush

- App Center, which hosted CodePush, was retired on March 31, 2025, and the
  `react-native-code-push` SDK was archived.
- The SDK never supported the New Architecture, so it cannot be used with React
  Native 0.82+.
- Alternatives: EAS Update, a self-hosted server for `expo-updates` (it uses an
  open protocol), or community forks.

### Store Rules

- **Apple**: the Developer Program License Agreement allows downloading
  interpreted code (JS) if it does not change the app's primary purpose, does
  not create a store for other code and does not bypass signing, the sandbox or
  OS security. Bug fixes and small UI changes are fine; a new feature set should
  go through review.
- **Google Play**: an app must not download executable native code (dex, `.so`)
  from outside Play, but code run by an interpreter, such as JS, is allowed as
  long as the result still follows Play policies.

## Example

```json title="app.json"
{
  "expo": {
    "runtimeVersion": { "policy": "fingerprint" },
    "updates": { "url": "https://u.expo.dev/your-project-id" }
  }
}
```

```bash
eas update --channel production --message "Fix crash on checkout"
```

## Common Mistakes

- Shipping an update that calls a native module the installed build does not
  have: it crashes. The runtime version prevents this only if it changes with
  native code.
- Expecting the update to apply immediately: by default it runs on the next
  launch.
- Saying React Native's license is what allows OTA updates: the rules come from
  Apple's and Google's developer agreements.

## See Also

- [Publishing and Distribution](./distribution.md)
- [Environment Configuration and Secrets](./env.md)
