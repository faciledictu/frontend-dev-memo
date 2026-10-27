---
sidebar_position: 4
description:
  Threat model of a mobile app, OWASP MASVS and Mobile Top 10, what the bundle
  reveals, HTTPS and SSL pinning, root detection vs attestation, sensitive data
  on screen and in logs, WebView
tags: [middle, senior]
---

# Mobile App Security

The app runs on a device the **attacker controls**: they can unpack the bundle,
read Hermes bytecode, hook any call with Frida and send requests without the
app. So the **server is the trust boundary**: it checks every request, and the
app holds **no secrets** and decides nothing that matters on its own. On the
device the app protects the user's data: tokens in the **Keychain / Keystore**,
**HTTPS** only (pinning where the risk justifies it), no sensitive data in logs,
screenshots or the app switcher, and **server-side attestation** (Play
Integrity, App Attest) instead of trusting client checks. The checklist is
**OWASP MASVS**.

Applies to: React Native 0.88, Expo SDK 58, OWASP MASVS 2.1.

## Details

### MASVS in React Native

MASVS 2.1 sorts its controls into eight groups; the levels L1 / L2 / R are now
MAS testing profiles, not part of the standard.

| Group      | What it means in React Native                                                 | Where                                                                                   |
| ---------- | ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| STORAGE    | Tokens in the secure store, nothing sensitive in AsyncStorage or logs         | [Storage](storage.md), [below](#sensitive-data)                                         |
| CRYPTO     | Platform crypto (`expo-crypto`), keys in the Keystore / Secure Enclave        | —                                                                                       |
| AUTH       | OAuth with PKCE, refresh, biometrics bound to a key                           | [Authentication](authentication.md)                                                     |
| NETWORK    | HTTPS, no cleartext, pinning where needed                                     | [below](#network)                                                                       |
| PLATFORM   | Deep links, WebView, permissions, the clipboard                               | [Deep Linking](../device/deep-linking.md), [WebView](#webview)                          |
| CODE       | Updated dependencies (the supply chain), signed OTA updates, input validation | [OTA Updates](../release/ota.md), [Package Managers](../../tooling/package-managers.md) |
| RESILIENCE | Obfuscation, root and tampering detection, attestation                        | [below](#device-integrity)                                                              |
| PRIVACY    | Least data and permissions, consent, tracking                                 | [Permissions](../device/permissions.md)                                                 |

The **OWASP Mobile Top 10** (2024) is the list of risks: M1 improper credential
usage, M2 supply chain, M3 authentication and authorization, M4 input and output
validation, M5 communication, M6 privacy, M7 binary protections, M8
misconfiguration, M9 data storage, M10 cryptography.

### What the Bundle Reveals

- The JS bundle is a file inside the APK / IPA. With Hermes it is bytecode, and
  decompilers (`hermes-dec`, listed in the OWASP MASTG) turn it back into
  readable code: strings, endpoints, feature flags and the logic are visible.
- Obfuscation and Hermes only slow the attacker down; they are not a security
  boundary.
- So any key in the app is public, see
  [Environment Configuration](../release/env.md).
- Client checks ("the button is hidden for non-premium users") are only UX: the
  API must check the same rule.

### Network

- **iOS**: App Transport Security blocks plain HTTP by default;
  `NSAllowsArbitraryLoads` needs a justification in App Review. The React Native
  template allows only local networking, for Metro.
- **Android**: cleartext is off by default for apps targeting API 28+. The React
  Native Gradle plugin sets `usesCleartextTraffic` to `true` only in debug
  builds, for Metro. A release that talks to `http://` fails.
- **SSL pinning**: the app accepts only certificates with a known public key.
  HTTPS alone trusts every CA the system trusts: pinning protects against a
  compromised or mis-issued public CA and, on iOS, against a CA profile the user
  installed (Android apps ignore user-added CAs since API 24).

| Pinning rule                            | Why                                                                                                                 |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Pin the **public key** (SPKI SHA-256)   | Survives a certificate renewal with the same key                                                                    |
| At least **two pins**: current + backup | A key rotation or a lost key does not brick every installed version                                                 |
| An expiration date or a kill switch     | An old app still works when the pins are outdated; but after expiry pinning is off, so pair it with a forced update |
| Only your own API domains               | Third-party SDK hosts rotate keys without telling you                                                               |

- `react-native-ssl-public-key-pinning` pins `fetch` and `XMLHttpRequest` (axios
  too): OkHttp `CertificatePinner` on Android, TrustKit on iOS, which requires
  two hashes. Native SDKs with their own networking are not covered. It needs a
  development build (pinning on in an iOS dev build also needs Expo's network
  inspector off).
- Android also has `<pin-set>` in `network_security_config.xml`, with an
  `expiration` after which pinning turns off.
- Pinning breaks debugging proxies (Proxyman, Charles); keep it off in debug
  builds, see [Debugging](../quality/debugging.md).
- Worth it for banking, health and payments; for most apps HTTPS with the system
  defaults is enough, and a wrong pin is an outage. Pinning is also easy to
  bypass with Frida on a rooted device, so it protects the user on a hostile
  network, not the API from the device owner.

### Device Integrity

| Check                                                | What it gives                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| Root / jailbreak detection (`jail-monkey`, freeRASP) | A signal on the device; bypassed with Frida or objection, which hook the check |
| **Play Integrity** (Android), **App Attest** (iOS)   | A signed verdict about the app and the device that the **server** verifies     |

- `@expo/app-integrity` wraps both: on Android `requestIntegrityCheckAsync`
  returns a token that the server decrypts through Google's API; on iOS
  `attestKeyAsync` and `generateAssertionAsync` sign a challenge. Bind every
  check to a nonce from the server (`requestHash` on Android), or a verdict
  obtained once is replayed with any request.
- Call it at login and before risky actions, not on every request: Play
  Integrity has daily quotas and adds latency.
- Decide on the server: block, ask for extra verification, limit features. A
  client check that only shows "Your device is rooted" is removed by patching
  the app.

### Sensitive Data

- **Screenshots and recording**: `expo-screen-capture` `usePreventScreenCapture`
  on a payment or a document screen; on Android it sets `FLAG_SECURE`, which
  also blanks the recent-apps preview; on iOS it blocks recording and
  screenshots.
- **App switcher** on iOS: `enableAppSwitcherProtectionAsync` blurs the
  snapshot, see [App Lifecycle](../device/app-lifecycle.md).
- **Logs**: `console.log` stays in release builds and goes to the device log,
  readable with `adb logcat` or Console on a connected computer; strip it
  (`babel-plugin-transform-remove-console`) and scrub tokens and personal data
  from crash reports and analytics (`beforeSend` in Sentry).
- **Inputs**: `secureTextEntry` masks passwords (not with `multiline`);
  `autoComplete` lets the password manager fill them.
- **Clipboard**: the keyboard, the app the user pastes into and clipboard sync
  can see it; mark copied secrets as sensitive (`expo-clipboard` `isSensitive`
  hides the preview on Android 13+) or do not copy them.
- **Persisted state**: a persisted Redux or Zustand store is a plain file;
  exclude tokens and form data with personal details.
- **Backups**: app files can land in an ADB or cloud backup. The React Native
  template sets `android:allowBackup="false"`, keep it; Expo's prebuild sets
  `true` unless `android.allowBackup` is `false` in the app config. Or exclude
  the sensitive files.

### WebView

`react-native-webview` is a browser inside the app, and a bridge to native code:

- **Allow only your origins**: `originWhitelist` (by default any `http` and
  `https` page) and `onShouldStartLoadWithRequest` to open other URLs in the
  system browser. On Android the second one is not called for the first load.
- **Check `onMessage`**: any page loaded in the WebView, including an iframe or
  a redirect, can call `postMessage`; check the origin of
  `event.nativeEvent.url` and validate the data before acting on it.
- **No tokens in injected JS**: any script on the page can read what
  `injectedJavaScript` sets, and `injectedJavaScriptObject` is visible to every
  iframe. Pass a short-lived one-time code and let the page exchange it.
- Keep the defaults: no file access (a page could read the app's files through
  `file://`), `mixedContentMode="never"` (an HTTP script injected into an HTTPS
  page on a hostile network), debugging off in release (anyone with the device
  and `chrome://inspect` reads the page, its storage and cookies). Content from
  your server still needs a CSP, see [XSS](../../web-platform/security/xss.md).
- Never do login in a WebView, see
  [Authentication](authentication.md#why-the-system-browser-not-a-webview).

## Example

SSL pinning with a backup pin; await it before the first request and before SDKs
start, or those requests go unpinned:

```ts title="pinning.ts"
import {
  addSslPinningErrorListener,
  initializeSslPinning,
  isSslPinningAvailable,
} from 'react-native-ssl-public-key-pinning';
import { reportError } from './monitoring';

// Off in debug so that proxies work; test it in a preview or release build
export async function setUpPinning() {
  if (__DEV__) return;
  if (!isSslPinningAvailable()) {
    // Fail open: the app runs unpinned; a banking app would block requests here
    reportError(new Error('SSL pinning is not available'));
    return;
  }

  await initializeSslPinning({
    'api.example.com': {
      includeSubdomains: true,
      publicKeyHashes: [
        'CLOmM1/OXvSPjw5UOYbAf9GKOxImEp9hhku9W90fHMk=', // current key
        // highlight-next-line
        'hxqRlPTu1bMS/0DITB1SSu0vd4u/8l8TjPgfaAp63Gc=', // backup key, not yet in use
      ],
      // After this date pinning is off: ship new pins or force an update before
      expirationDate: '2027-12-31',
    },
  });

  addSslPinningErrorListener((error) => {
    // A spike means a key rotation or an attack
    reportError(new Error(`Pinning failed for ${error.serverHostname}`));
  });
}
```

<details>
<summary>Screen capture protection on a payment screen</summary>

```tsx title="CardDetailsScreen.tsx"
import { useEffect } from 'react';
import { Platform, Text } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';

export function CardDetailsScreen({ cardNumber }: { cardNumber: string }) {
  // FLAG_SECURE on Android, blocked screenshots and recording on iOS;
  // turned off again when the screen unmounts
  // highlight-next-line
  ScreenCapture.usePreventScreenCapture();

  useEffect(() => {
    if (Platform.OS !== 'ios') return;
    ScreenCapture.enableAppSwitcherProtectionAsync(); // blurs the iOS snapshot
    return () => {
      ScreenCapture.disableAppSwitcherProtectionAsync();
    };
  }, []);

  return <Text>{cardNumber}</Text>;
}
```

</details>

## Follow-up Questions

- What is the difference between MASVS and the Mobile Top 10? MASVS is a
  standard of controls to build and test against; the Top 10 is an awareness
  list of the most common risks.
- A secret API key has already shipped in the app. What do you do? Treat it as
  leaked: rotate it, move the calls behind your server, and force an update for
  the versions that still use the old key.
- How do you check that pinning works? Run a release or preview build through a
  proxy (Proxyman, Charles) with its CA trusted: the requests must fail and the
  error listener must fire. Android ignores user CAs anyway, so there install
  the proxy CA as a system one on an emulator.
- The certificate was rotated and the app stopped working. What went wrong? The
  app pinned the certificate or a single key without a backup; pin the public
  key, ship a backup pin and an expiration.
- What do Play Integrity and App Attest prove? That the request comes from a
  legitimate, unmodified instance of your app; Play Integrity also gives device
  and install-source verdicts, App Attest is not a jailbreak check. Neither
  proves who the user is.
- How do you stop requests that do not come from your app? Fully, you cannot:
  the API authenticates every request as if any client could call it and
  rate-limits; attestation with a nonce raises the bar, an "app secret" in the
  bundle does not.

## Common Mistakes

- An API key "hidden" in the bundle or in an env variable, see
  [Environment Configuration](../release/env.md).
- A single pin without a backup, or pinning a third-party SDK's domain.
- Root detection on the device as the only protection; or blocking rooted
  devices for an app that has nothing to protect.
- `console.log` of tokens and responses left in release builds.
- A WebView with the default `originWhitelist` and an `onMessage` that trusts
  any page.
- Security checks only in the UI: a hidden button, a disabled field.

## See Also

- [Authentication in React Native](authentication.md)
- [Storage](storage.md)
- [Deep Linking](../device/deep-linking.md)
- [XSS](../../web-platform/security/xss.md)
- [Security (React Native docs)](https://reactnative.dev/docs/security)
- [OWASP MASVS](https://mas.owasp.org/MASVS/)
