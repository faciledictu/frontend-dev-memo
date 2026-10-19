---
sidebar_position: 21
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

MASVS 2.1 groups the requirements; the levels L1 / L2 / R are now MAS testing
profiles, not part of the standard.

| Group      | What it means in React Native                                          | Where                                                  |
| ---------- | ---------------------------------------------------------------------- | ------------------------------------------------------ |
| STORAGE    | Tokens in the secure store, nothing sensitive in AsyncStorage or logs  | [Storage](./storage.md), [below](#sensitive-data)      |
| CRYPTO     | Platform crypto (`expo-crypto`), keys in the Keystore / Secure Enclave | —                                                      |
| AUTH       | OAuth with PKCE, refresh, biometrics bound to a key                    | [Authentication](./authentication.md)                  |
| NETWORK    | HTTPS, no cleartext, pinning where needed                              | [below](#network)                                      |
| PLATFORM   | Deep links, WebView, permissions, the clipboard                        | [Deep Linking](./deep-linking.md), [WebView](#webview) |
| CODE       | Updated dependencies, signed OTA updates, input validation             | [OTA Updates](./release/ota.md)                        |
| RESILIENCE | Obfuscation, root and tampering detection, attestation                 | [below](#device-integrity)                             |
| PRIVACY    | Least data and permissions, consent, tracking                          | [Permissions](./permissions.md)                        |

The **OWASP Mobile Top 10** (2024) is the list of risks: M1 improper credential
usage, M2 supply chain, M3 authentication and authorization, M4 input and output
validation, M5 communication, M6 privacy, M7 binary protections, M8
misconfiguration, M9 data storage, M10 cryptography.

### What the Bundle Reveals

- The JS bundle is a file inside the APK / IPA. With Hermes it is bytecode, and
  decompilers (`hermes-dec`, listed in the OWASP MASTG) turn it back into
  readable code: strings, endpoints, feature flags and the logic are visible.
- Obfuscation and Hermes only slow the attacker down; they are not protection.
- Any key in the app is public: `EXPO_PUBLIC_*` and `react-native-config` values
  are in the bundle. Secret keys stay on a server that calls the third-party API
  for the app, see [Environment Configuration](./release/env.md).
- Client checks ("the button is hidden for non-premium users") are only UX: the
  API must check the same rule.

### Network

- **iOS**: App Transport Security blocks plain HTTP by default;
  `NSAllowsArbitraryLoads` needs a justification in App Review. The React Native
  template allows only local networking, for Metro.
- **Android**: cleartext is off by default since Android 9 (API 28). The React
  Native Gradle plugin sets `usesCleartextTraffic` to `true` only in debug
  builds, for Metro. A release that talks to `http://` fails.
- **SSL pinning**: the app accepts only certificates with a known public key, so
  a proxy with a user-installed CA (or a compromised CA) cannot read the
  traffic. HTTPS alone trusts every CA the device trusts.

| Pinning rule                            | Why                                                                      |
| --------------------------------------- | ------------------------------------------------------------------------ |
| Pin the **public key** (SPKI SHA-256)   | Survives a certificate renewal with the same key                         |
| At least **two pins**: current + backup | A key rotation or a lost key does not brick every installed version      |
| An expiration date or a kill switch     | An old app that cannot be updated still works when the pins are outdated |
| Only your own API domains               | Third-party SDK hosts rotate keys without telling you                    |

- `react-native-ssl-public-key-pinning` pins `fetch` and `XMLHttpRequest` (axios
  too): OkHttp `CertificatePinner` on Android, TrustKit on iOS, which requires
  two hashes. Native SDKs with their own networking are not covered. It needs a
  development build; in Expo dev builds turn off the network inspector
  (`expo-build-properties`, `ios.networkInspector: false`).
- Android also has `<pin-set>` in `network_security_config.xml`, with an
  `expiration` after which pinning turns off.
- Pinning breaks debugging proxies (Proxyman, Charles); keep it off in debug
  builds, see [Debugging](./debugging.md).
- Worth it for banking, health and payments; for most apps HTTPS with the system
  defaults is enough, and a wrong pin is an outage. Pinning is also bypassed
  with Frida on a rooted device, so it protects the user on a hostile network,
  not the API from the device owner.

### Device Integrity

| Check                                                | What it gives                                                                  |
| ---------------------------------------------------- | ------------------------------------------------------------------------------ |
| Root / jailbreak detection (`jail-monkey`, freeRASP) | A signal on the device; bypassed with Frida or objection, which hook the check |
| **Play Integrity** (Android), **App Attest** (iOS)   | A signed verdict about the app and the device that the **server** verifies     |

- `@expo/app-integrity` wraps both: on Android `requestIntegrityCheckAsync`
  returns a token that the server decrypts through Google's API; on iOS
  `attestKeyAsync` and `generateAssertionAsync` sign a server challenge.
- Decide on the server: block, ask for extra verification, limit features. A
  client check that only shows "Your device is rooted" is removed by patching
  the app.

### Sensitive Data

- **Screenshots and recording**: `expo-screen-capture` `usePreventScreenCapture`
  on a payment or a document screen; on Android it sets `FLAG_SECURE`, which
  also blanks the recent-apps preview; on iOS it blocks recording and
  screenshots.
- **App switcher** on iOS: `enableAppSwitcherProtectionAsync` blurs the
  snapshot, see [App Lifecycle](./app-lifecycle.md).
- **Logs**: `console.log` stays in release builds and goes to the device log;
  strip it (`babel-plugin-transform-remove-console`) and scrub tokens and
  personal data from crash reports and analytics (`beforeSend` in Sentry).
- **Inputs**: `secureTextEntry` masks passwords (not with `multiline`);
  `autoComplete` lets the password manager fill them.
- **Clipboard**: other apps can read it; mark copied secrets as sensitive
  (`expo-clipboard` `isSensitive` on Android) or do not copy them.
- **Persisted state**: a persisted Redux or Zustand store is a plain file;
  exclude tokens and form data with personal details.

### WebView

`react-native-webview` is a browser inside the app, and a bridge to it:

- **Allow only your origins**: `originWhitelist` (by default any `http` and
  `https` page) and `onShouldStartLoadWithRequest` to open other URLs in the
  system browser. On Android the second one is not called for the first load.
- **Check `onMessage`**: any page loaded in the WebView, including an iframe or
  a redirect, can call `postMessage`; check the origin of
  `event.nativeEvent.url` and validate the data before acting on it.
- **No tokens in injected JS** (`injectedJavaScript`,
  `injectedJavaScriptObject`): every frame of the page can read them. Pass a
  short-lived one-time code and let the page exchange it.
- Keep the defaults: no file access, `mixedContentMode="never"`, debugging off
  in release. Content from your server still needs a CSP, see
  [XSS](../web-platform/security/xss.md).
- Never do login in a WebView, see
  [Authentication](./authentication.md#why-the-system-browser-not-a-webview).

Dependencies and OTA updates are the supply chain: lock files and audits, see
[Package Managers](../tooling/package-managers.md); code signing of updates, see
[OTA Updates](./release/ota.md).

## Example

SSL pinning with a backup pin, before the first request:

```ts title="pinning.ts"
import {
  addSslPinningErrorListener,
  initializeSslPinning,
  isSslPinningAvailable,
} from 'react-native-ssl-public-key-pinning';

export async function setUpPinning() {
  if (__DEV__ || !isSslPinningAvailable()) return; // proxies work in debug

  await initializeSslPinning({
    'api.example.com': {
      includeSubdomains: true,
      publicKeyHashes: [
        'CLOmM1/OXvSPjw5UOYbAf9GKOxImEp9hhku9W90fHMk=', // current key
        // highlight-next-line
        'hxqRlPTu1bMS/0DITB1SSu0vd4u/8l8TjPgfaAp63Gc=', // backup key, not yet in use
      ],
      expirationDate: '2027-12-31', // after this, the app falls back to HTTPS only
    },
  });

  addSslPinningErrorListener((error) => {
    // report the host to monitoring: a spike means a rotation or an attack
    console.warn('Pinning failed for', error.serverHostname);
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

- Is Hermes bytecode a protection? No: it is decompiled; treat everything in the
  bundle as public.
- HTTPS already encrypts the traffic; why pin? HTTPS trusts every CA on the
  device, including one the user or an MDM installed; pinning trusts only your
  key. It does not stop the device owner.
- The certificate was rotated and the app stopped working. What went wrong? The
  app pinned the certificate or a single key without a backup; pin the public
  key, ship a backup pin and an expiration.
- Why is client-side root detection not enough? The attacker controls the code
  that runs the check and patches it out; only a verdict signed by Google or
  Apple and checked on the server can be trusted.
- What do Play Integrity and App Attest prove? That the request comes from your
  unmodified app on a genuine device (Play Integrity also reports the device and
  the install source); they do not prove who the user is.
- How do you hide a card number from the app switcher? iOS:
  `enableAppSwitcherProtectionAsync` or an overlay on `inactive`; Android:
  `FLAG_SECURE`.
- What can go wrong with a WebView bridge? A page you did not expect (a
  redirect, an ad iframe) calls `postMessage` and triggers native code, or reads
  a token from injected JS.

## Common Mistakes

- An API key "hidden" in the bundle or in an env variable.
- A single pin without a backup, or pinning a third-party SDK's domain.
- Root detection on the device as the only protection; or blocking rooted
  devices for an app that has nothing to protect.
- `console.log` of tokens and responses left in release builds.
- A WebView with the default `originWhitelist` and an `onMessage` that trusts
  any page.
- Security checks only in the UI: a hidden button, a disabled field.

## See Also

- [Authentication in React Native](./authentication.md)
- [Storage](./storage.md)
- [Deep Linking](./deep-linking.md)
- [XSS](../web-platform/security/xss.md)
- [Security (React Native docs)](https://reactnative.dev/docs/security)
- [OWASP MASVS](https://mas.owasp.org/MASVS/)
