# Batch 10: React Native Accessibility and Security

Status: proposed, not approved. The user chose accessibility and security in
React Native as the batch after batch 9 (see "Later" in
[batch 9](batch-9-react-native.md)). Three new pages in `docs/react-native/`:
`accessibility`, `authentication`, `security`. Starting point: `main` at
1cbd2c4. Batch 9 is written in parallel; this batch starts after it is merged,
and the positions below continue its order.

## Open Questions

To be answered by the user before writing; the plan follows the recommendation.

1. Login and tokens: a separate `authentication.md` or a section of
   `security.md`? Recommendation: a separate page. "How did you build login in
   your app?" is asked on its own, and `security.md` stays a page about the
   threat model.
2. Accessibility: one page or two (font scaling, reduce motion and other system
   settings as a separate page)? Recommendation: one page, like
   `web-platform/accessibility`; split only if it grows past the web page.
3. WebView: a short section in `security.md` now and a full `webview.md` later
   (when to use it, `postMessage`, cookies, performance)? Recommendation: yes,
   `webview.md` goes to "Later".
4. The sidebar grows to 24 entries without subgroups. Keep it flat, as decided
   for batch 9, or group it now? Recommendation: keep it flat in this batch;
   grouping is a separate change, so that two batches do not renumber the same
   pages at once.

## Interview Questions the Section Does Not Answer Yet

Collected from reactnative.dev (Accessibility, AccessibilityInfo, Security),
docs.expo.dev, OWASP MASVS 2.1 and Mobile Top 10 (2024), and current question
lists for middle and senior mobile and cross-platform roles:

- How do you make an app work with VoiceOver and TalkBack? What is the
  difference between `accessibilityLabel` and `accessibilityHint`? `role` or
  `accessibilityRole`, `aria-*` or `accessibility*`?
- A card with an image, a title and a price is read as three items; how do you
  make it one? How do you hide decorative elements?
- How do you announce "Item added" without moving the focus? Why does
  `aria-live` not work on iOS?
- After navigating to a new screen, where is the screen reader focus, and how do
  you move it?
- The user set a large font and the layout broke; what do you do? Should you
  turn off `allowFontScaling`?
- How big should a touch target be? How do you respect "Reduce Motion"?
- How do you test accessibility in a React Native app?
- What can an attacker get from your app's bundle? Is Hermes bytecode a
  protection?
- What is SSL pinning, how do you implement it, and what can go wrong? Is HTTPS
  not enough?
- How do you detect a rooted or jailbroken device, and why is client-side
  detection not enough? What are Play Integrity and App Attest?
- How do you hide sensitive data in screenshots and in the app switcher?
- What are OWASP MASVS and the Mobile Top 10?
- How do you implement OAuth login in React Native? Why the system browser and
  not a WebView? What is PKCE for?
- Where do you keep tokens and how do you refresh them? What happens with
  several requests on an expired token?
- How do you implement biometric login, and why is `LocalAuthentication`
  returning `success: true` not enough?
- Sign in with Apple: when is it required?

Already covered and not repeated: token storage and Keychain accessibility
(`storage.md`), secrets in the bundle (`release/env.md`), deep link params and
scheme hijacking (`deep-linking.md`), auth flow in the navigator
(`navigation.md`), OTA code signing (`release/ota.md`), permissions and asking
for the least (`permissions.md`), WCAG, contrast, ARIA rules
(`web-platform/accessibility`), XSS (`web-platform/security/xss.md`), JWT,
sessions, OAuth and PKCE in general (`web-platform/network/authentication.md`).
Hiding content in the app switcher on `inactive` is in batch 9's
`app-lifecycle.md`.

## Facts Checked When Planning (October 2026; re-verify)

- Versions: **re-check before writing.** On October 18, 2026 the reactnative.dev
  docs show 0.87 as the current version (Accessibility page updated August 12),
  and docs.expo.dev marks SDK 58 as "next" and SDK 57 as latest. Batch 9 noted
  `0.88.0` as `latest` on npm with the release post dated October 19. Pages say
  "Applies to: React Native 0.88, Expo SDK 58" only if both are released by
  then.
- Accessibility props (reactnative.dev): `accessible`, `accessibilityLabel`,
  `accessibilityHint` (iOS reads it only if hints are on; Android always),
  `accessibilityRole` and `role` (`role` takes precedence), `accessibilityState`
  (`disabled`, `selected`, `checked` incl. `'mixed'`, `busy`, `expanded`),
  `accessibilityValue`, `accessibilityActions` + `onAccessibilityAction`
  (standard `activate`, `increment`, `decrement`, `magicTap`, `escape`,
  `longpress`, `expand`, `collapse`; custom ones need a `label`),
  `accessibilityLiveRegion` (Android), `accessibilityViewIsModal` and
  `accessibilityElementsHidden` (iOS), `importantForAccessibility` (Android),
  `accessibilityLabelledBy` (Android), `accessibilityLanguage` (iOS),
  `accessibilityShowsLargeContentViewer` (iOS). `aria-*` equivalents:
  `aria-label`, `aria-hidden`, `aria-busy`, `aria-checked`, `aria-disabled`,
  `aria-expanded`, `aria-selected`, `aria-value*`, `aria-labelledby` and
  `aria-live` (Android only), `aria-modal` (iOS only). The page does not say
  which set is preferred.
- `experimental_accessibilityOrder`: an array of `nativeID`s that sets the focus
  order; experimental, one line at most.
- `AccessibilityInfo`: `isScreenReaderEnabled`, `isReduceMotionEnabled`,
  `isBoldTextEnabled` (iOS), `isHighTextContrastEnabled` (Android),
  `announceForAccessibility`, `announceForAccessibilityWithOptions` (`queue`,
  iOS), `getRecommendedTimeoutMillis` (Android),
  `sendAccessibilityEvent(ref, 'focus')`; `setAccessibilityFocus` is deprecated.
  Events `screenReaderChanged`, `reduceMotionChanged`, `announcementFinished`
  (iOS).
- Reanimated: animations default to `ReduceMotion.System`; `useReducedMotion`
  reads the setting at startup and does not re-render on change;
  `ReducedMotionConfig` overrides it app-wide. The docs found were for 3.x;
  check the Reanimated 4 docs.
- Touch targets: 44 × 44 pt (Apple HIG), 48 × 48 dp (Material). The European
  Accessibility Act covers apps of e-commerce, banking and transport services
  (EN 301 549); one line with a link to the web page.
- Security page (reactnative.dev): no secrets in the bundle; AsyncStorage is not
  for tokens; Keychain / Keystore via `expo-secure-store` or
  `react-native-keychain`; do not leak data into persisted Redux state or crash
  reporters; deep links are not safe for tokens; OAuth with PKCE via
  `react-native-app-auth`; HTTPS plus SSL pinning with the warning about
  certificate rotation.
- OWASP MASVS 2.1 (January 2024): eight groups STORAGE, CRYPTO, AUTH, NETWORK,
  PLATFORM, CODE, RESILIENCE, PRIVACY. L1 / L2 / R are now MAS testing profiles
  in the MASTG, not levels of the MASVS. Mobile Top 10 (2024): M1 Improper
  Credential Usage, M2 Inadequate Supply Chain Security, M3 Insecure
  Authentication/Authorization, M4 Insufficient Input/Output Validation, M5
  Insecure Communication, M6 Inadequate Privacy Controls, M7 Insufficient Binary
  Protections, M8 Security Misconfiguration, M9 Insecure Data Storage, M10
  Insufficient Cryptography. Check the order on owasp.org.
- Hermes bytecode is decompiled by `hermes-dec` (listed in the MASTG) and newer
  tools; release builds lose variable names, but strings, endpoints and logic
  are readable.
- SSL pinning: `react-native-ssl-public-key-pinning` (OkHttp `CertificatePinner`
  on Android, TrustKit on iOS; base64 SHA-256 of the public key; in Expo
  development builds the network inspector must be off). At least two pins per
  domain (current and backup). Android also has `network_security_config.xml`
  with `<pin-set>`.
- Integrity: `@expo/app-integrity` wraps Play Integrity (Android) and App Attest
  (iOS); alpha, the token is verified on the server. Client-side root and
  jailbreak checks (`jail-monkey`, freeRASP) are bypassed with Frida.
- `expo-screen-capture`: `usePreventScreenCapture` (`FLAG_SECURE` on Android,
  also blanks the recent-apps preview), `enableAppSwitcherProtectionAsync` (iOS
  blur), `addScreenshotListener`.
- To verify when writing: App Store Review Guideline 4.8 (Login Services) — what
  it requires now; Google Sign-In on Android through Credential Manager; passkey
  libraries for React Native; `expo-auth-session` vs `react-native-app-auth`
  status; whether `eslint-plugin-react-native-a11y` is maintained; ATS on iOS
  and `usesCleartextTraffic` on Android (cleartext is off by default since API
  28, debug builds allow it for Metro).

## Pages to Write Now

Versions on all pages: "Applies to: React Native 0.88, Expo SDK 58" (plus
library versions where they matter).

1. `react-native/accessibility.md`, "Accessibility in React Native", `[middle]`,
   position 8, after `keyboard`. Answers: how to make an app usable with
   VoiceOver, TalkBack and the system accessibility settings. Includes: short
   answer — props are mapped to the native accessibility APIs, there is no DOM
   and no semantic HTML, so roles and names come from props; table of the main
   props (`accessible`, label, hint, `role`, state, value) with their `aria-*`
   equivalents and platform limits; grouping (`accessible` on a container merges
   the children; `Pressable` is accessible by default) and hiding decorative
   elements (`aria-hidden`, `importantForAccessibility`,
   `accessibilityElementsHidden`); modals (`aria-modal` /
   `accessibilityViewIsModal`, the `Modal` component); focus after navigation
   and `sendAccessibilityEvent(ref, 'focus')`; announcements
   (`announceForAccessibility` on iOS, live regions on Android); custom actions
   for swipe-to-delete and other gestures a screen reader cannot perform; font
   scaling (`allowFontScaling`, `maxFontSizeMultiplier`, `fontScale`, layouts
   without fixed heights); touch target size and `hitSlop`; reduce motion
   (`AccessibilityInfo`, Reanimated `ReduceMotion`); testing (VoiceOver and
   TalkBack by hand, Xcode Accessibility Inspector, Android Accessibility
   Scanner, `getByRole` in React Native Testing Library). Example: an icon
   button and a card grouped into one element (red / green lines). WCAG,
   contrast, the ARIA rules and the laws are a link to
   `web-platform/accessibility/accessibility.md`; animations and gestures are
   links to `animations/*`.
2. `react-native/authentication.md`, "Authentication in React Native",
   `[middle, senior]`, position 20, after `offline`. Answers: how to build login
   and keep the user signed in. Includes: OAuth / OIDC in the **system browser**
   (`ASWebAuthenticationSession`, Custom Tabs) and why not a WebView (the app
   can read the password, no shared sign-in, providers block it);
   `expo-auth-session` + `expo-web-browser` vs `react-native-app-auth`; PKCE in
   one line with a link; the redirect URI (custom scheme vs verified link, link
   to `deep-linking.md`); native sign-in (Sign in with Apple, Google) and when
   Apple requires it; passkeys in one or two lines; token lifecycle table
   (access token in memory, refresh token in the Keychain, restore on launch
   behind the splash screen, refresh on `401` with one in-flight refresh shared
   by all requests, logout: revoke on the server and clear); biometrics:
   `expo-local-authentication` alone is a UI gate that can be patched, the
   proper way is a Keychain item with access control (`requireAuthentication`)
   or a key pair in the Secure Enclave / Keystore that signs a server challenge.
   Example: a fetch wrapper that refreshes the token once for parallel requests;
   the OAuth call under a spoiler. JWT, sessions and OAuth in general are a link
   to `web-platform/network/authentication.md`; storage is a link to
   `storage.md`; the navigator part is a link to `navigation.md`.
3. `react-native/security.md`, "Mobile App Security", `[middle, senior]`,
   position 21, after `authentication`. Answers: how to secure a React Native
   app and what an attacker can do with it. Includes: threat model — the app
   runs on a device the attacker controls, so the server is the trust boundary;
   table of MASVS groups → what it means in React Native → tool or page (most
   rows are links: STORAGE → `storage.md`, AUTH → `authentication.md`, PLATFORM
   → `deep-linking.md` and WebView, PRIVACY → `permissions.md`); the Mobile Top
   10 in one line; what the bundle reveals (Hermes bytecode is decompiled,
   obfuscation only slows down, secrets are a link to `release/env.md`);
   network: HTTPS, ATS and cleartext defaults, SSL pinning (public key pins, a
   backup pin, what breaks on rotation, debugging proxies, when it is worth it);
   device integrity: root and jailbreak detection vs server-side attestation
   (Play Integrity, App Attest, `@expo/app-integrity`); sensitive data on screen
   and in logs (`expo-screen-capture`, the app switcher — link to
   `app-lifecycle.md`, `console.log` and crash reporters, clipboard,
   `secureTextEntry`); WebView: `originWhitelist`,
   `onShouldStartLoadWithRequest`, checking `onMessage`, no tokens in injected
   JS; OTA code signing and dependencies as links (`release/ota.md`,
   `tooling/package-managers.md`). Example: SSL pinning setup with two pins;
   screen capture protection on a payment screen.

New order (after batch 9): overview 1, architecture 2, core-components 3,
stylesheet 4, flexbox 5, safe-area 6, keyboard 7, accessibility 8, lists 9,
navigation 10, deep-linking 11, platform-specific-code 12, native-modules 13,
Animations 14, permissions 15, notifications 16, app-lifecycle 17, storage 18,
offline 19, authentication 20, security 21, performance 22, debugging 23, Build
and Release 24. Renumber the pages from `lists` on and the `_category_.json` of
`animations` (13 → 14) and `release` (21 → 24).

## Changes to Existing Pages

- `web-platform/accessibility/accessibility.md`: See Also →
  `react-native/accessibility.md`.
- `web-platform/network/authentication.md`: the PKCE line for mobile clients
  links to `react-native/authentication.md`; See Also → the same.
- `stylesheet.md`, "Screen Size": `fontScale` links to `accessibility.md`.
- `animations/gestures.md`: the `hitSlop` follow-up links to `accessibility.md`
  (target size); See Also → `accessibility.md`.
- `animations/reanimated.md` and `animations/animated.md`: one line on reduce
  motion with a link to `accessibility.md`.
- `storage.md`: `requireAuthentication` links to `authentication.md`
  (biometrics); the refresh / access token follow-up shortens to a link to
  `authentication.md`; See Also → `security.md`.
- `release/env.md`: See Also → `security.md`.
- `deep-linking.md`: the PKCE line links to `authentication.md`; See Also →
  `authentication.md`, `security.md`.
- `navigation.md`, "Auth Flow": one line that the session itself (login, tokens,
  restore on launch) is in `authentication.md`.
- `release/ota.md`: See Also → `security.md`.
- `debugging.md`: one line in "Network" that SSL pinning blocks debugging
  proxies, link to `security.md`.
- Batch 9 pages, if merged by then: `core-components.md` (`Pressable`, `Text`
  and `TextInput` link to `accessibility.md`; `secureTextEntry` to
  `security.md`), `app-lifecycle.md` (See Also → `security.md`).
- `tooling/testing.md`, "React Native": `getByRole` in the component row links
  to `react-native/accessibility.md`.

## Later

Candidates after this batch, by priority (items 3–5 carried over from batch 9):

1. `webview.md`: `react-native-webview`, when to use it, `postMessage` both
   ways, cookies and sessions, performance; the security part stays in
   `security.md`.
2. Sidebar subgroups for React Native (see question 4).
3. `testing.md` in React Native, only if `tooling/testing.md` gets too long.
4. `localization.md`, after i18n on the web side.
5. Upgrading React Native and Expo SDK, brownfield, monorepos: follow-ups in
   `overview.md` first.
