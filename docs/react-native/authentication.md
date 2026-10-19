---
sidebar_position: 20
description:
  OAuth and OIDC in the system browser, expo-auth-session and
  react-native-app-auth, native Apple and Google sign-in, token lifecycle and
  refresh, biometric login
tags: [middle, senior]
---

# Authentication in React Native

A mobile app is a **public client**: it cannot keep a secret, so login goes
through **OAuth 2.0 / OIDC** with the **authorization code flow and PKCE**, in
the **system browser** (`ASWebAuthenticationSession` on iOS, Custom Tabs on
Android), never in a WebView. The app gets the code on its redirect URI and
exchanges it for tokens. The **refresh token** goes into the Keychain /
Keystore, the short-lived **access token** stays in memory; on a `401` the app
refreshes once and retries. **Biometrics** should unlock a key or a Keychain
item, not just return `true`.

Applies to: React Native 0.88, Expo SDK 58, react-native-app-auth 8.

## Details

### Why the System Browser, Not a WebView

RFC 8252 (OAuth for native apps) says native apps **must** use an external user
agent and **must not** use embedded ones. In a WebView:

- the app controls the page: it can inject JS and read the password, so the user
  has to trust the app with credentials it should never see;
- there is no shared sign-in: the user logs in again, and password managers and
  passkeys work worse;
- providers block it: Google returns `disallowed_useragent` for WebViews.

The system browser session is isolated from the app, and only the calling app
gets the redirect, even if another app registered the same scheme.

### Libraries

|               | `expo-auth-session` + `expo-web-browser`                       | `react-native-app-auth`                             |
| ------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| Built on      | Expo modules; `openAuthSessionAsync` opens the browser session | AppAuth-iOS and AppAuth-Android (the OpenID SDKs)   |
| API           | `useAuthRequest` → `promptAsync`, then `exchangeCodeAsync`     | `authorize(config)`, `refresh`, `revoke`            |
| PKCE          | On by default (`usePKCE`)                                      | On by default                                       |
| Token helpers | `refreshAsync`, `revokeAsync`, discovery from the issuer       | Token exchange inside `authorize`                   |
| Fits          | Expo apps; recommended by the Expo guide                       | Bare apps, or when the AppAuth behavior is required |

- PKCE: the app sends a hash of a random verifier with the request and the
  verifier with the code exchange, so a stolen code is useless; see
  [Authentication and Authorization](../web-platform/network/authentication.md).
- A **client secret** never goes into the app: a provider that requires one
  needs the code exchange on your server.
- OAuth does not work in Expo Go; test it in a development build.

### Redirect URI

| Kind                                  | Example                              | Notes                                                                  |
| ------------------------------------- | ------------------------------------ | ---------------------------------------------------------------------- |
| Private-use scheme                    | `com.example.app:/oauth`             | Reverse-DNS form (RFC 8252); any app can register it, PKCE protects    |
| Claimed HTTPS (Universal / App Links) | `https://example.com/oauth/callback` | Preferred by RFC 8252: the domain proves the app; needs verified links |

`makeRedirectUri()` in `expo-auth-session` builds the right one for the build.
Setting up schemes and verified links: [Deep Linking](./deep-linking.md).

### Native Sign-In

- **Sign in with Apple** (`expo-apple-authentication`): native sheet, no
  browser. App Store guideline 4.8: an app whose main login is a third-party or
  social one (Google, Facebook) must also offer an equivalent option that limits
  data to name and email, lets the user hide the email and does not track; Sign
  in with Apple is the usual one. Not needed when the app has only its own
  accounts.
- **Google** on Android: the native flow is **Credential Manager**; the old
  Google Sign-In for Android SDK is deprecated. Google no longer accepts custom
  schemes for Android OAuth clients, so browser-based Google login on Android
  needs a verified link or the native SDK. React Native wrappers need a
  development build.
- The native SDK returns an **ID token**; send it to your server, verify it
  there and issue your own session.
- **Passkeys**: WebAuthn through community libraries (`react-native-passkey`);
  they need associated domains on iOS and `assetlinks.json` on Android, the same
  files as verified links.

### Token Lifecycle

| Step     | What happens                                                                                             |
| -------- | -------------------------------------------------------------------------------------------------------- |
| Login    | Code + PKCE → access token, refresh token, ID token                                                      |
| Storage  | Access token in memory; refresh token in `expo-secure-store` / `react-native-keychain`                   |
| Launch   | Keep the splash screen, read the refresh token, refresh; then show the app or the login screen           |
| Request  | `Authorization: Bearer …`; on `401`, refresh **once** for all waiting requests and retry                 |
| Rotation | The server returns a new refresh token on every refresh; a reused old one revokes the session (RFC 9700) |
| Logout   | Revoke the refresh token on the server, delete it from the secure store, clear caches and state          |

- Several requests fail with `401` at once: without a shared promise each starts
  its own refresh, and with rotation the second one uses an already rotated
  token and logs the user out.
- Refresh fails (expired, revoked): clear the session and show the login screen;
  the navigator switches screens by the session, see
  [Navigation](./navigation.md#auth-flow).
- Background refresh while the device is locked needs a Keychain class that
  allows it, see [Storage](./storage.md#secrets).

### Biometric Login

| Approach                                                           | What an attacker on a rooted device does                     |
| ------------------------------------------------------------------ | ------------------------------------------------------------ |
| `LocalAuthentication.authenticateAsync()` → `if (success) login`   | Hooks the call (Frida) to return `success: true`             |
| Secret in a Keychain / Keystore item with `requireAuthentication`  | The OS releases it only after a real biometric check         |
| Key pair in the Secure Enclave / Keystore signs a server challenge | The private key never leaves the hardware; the server checks |

- `expo-local-authentication` alone is a **UI gate**: fine for "lock the app
  after 5 minutes", not as the only check before giving out a token.
- With `requireAuthentication: true` in `expo-secure-store`, reading the refresh
  token shows the system prompt, and the item becomes unreadable when the user
  adds a fingerprint or re-enrolls Face ID. Handle `null` as "log in with the
  password again".
- On Android require **strong** biometrics (`biometricsSecurityLevel: 'strong'`)
  for anything that unlocks credentials.

## Example

A fetch wrapper that shares one refresh between parallel requests:

```ts title="api.ts"
import * as SecureStore from 'expo-secure-store';

const API = 'https://api.example.com';
let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;

async function refreshTokens(): Promise<string | null> {
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) return null;
  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) {
    await SecureStore.deleteItemAsync('refreshToken');
    return null; // the caller shows the login screen
  }
  const tokens: { accessToken: string; refreshToken: string } =
    await res.json();
  await SecureStore.setItemAsync('refreshToken', tokens.refreshToken); // rotated
  accessToken = tokens.accessToken;
  return accessToken;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const send = (token: string | null) =>
    fetch(`${API}${path}`, {
      ...init,
      headers: { ...init.headers, Authorization: `Bearer ${token}` },
    });

  const res = await send(accessToken);
  if (res.status !== 401) return res;

  // highlight-next-line
  refreshing ??= refreshTokens().finally(() => (refreshing = null));
  const token = await refreshing;
  return token ? send(token) : res;
}
```

<details>
<summary>Login with expo-auth-session</summary>

```tsx title="LoginButton.tsx"
import { useEffect } from 'react';
import { Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession(); // closes the browser on web

const clientId = 'mobile-app';

export function LoginButton({
  onTokens,
}: {
  onTokens: (tokens: AuthSession.TokenResponse) => void;
}) {
  const discovery = AuthSession.useAutoDiscovery('https://auth.example.com');
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'com.example.app',
  });

  // PKCE is on by default: the request holds the code verifier
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId, redirectUri, scopes: ['openid', 'profile', 'offline_access'] },
    discovery
  );

  useEffect(() => {
    if (response?.type !== 'success' || !discovery || !request?.codeVerifier) {
      return;
    }
    AuthSession.exchangeCodeAsync(
      {
        clientId,
        redirectUri,
        code: response.params.code,
        // highlight-next-line
        extraParams: { code_verifier: request.codeVerifier },
      },
      discovery
    ).then(onTokens);
  }, [response]);

  return (
    <Button title="Sign in" disabled={!request} onPress={() => promptAsync()} />
  );
}
```

</details>

## Follow-up Questions

- Why not log in with a native form that posts the password to the API? It works
  for your own accounts (as your own endpoint: the OAuth password grant must not
  be used, RFC 9700), but you lose SSO, passkeys and the provider's MFA and
  fraud checks, and a phishing app looks the same.
- What does PKCE protect against on mobile? Another app that registered the same
  custom scheme and caught the redirect: without the verifier the code is
  useless.
- Is the implicit flow acceptable for a mobile app? No: RFC 9700 says clients
  should not use it; the token comes in the URL and there is no refresh token.
- Where does the user's session live: in the app or on the server? The server
  owns it (refresh token, revocation); the app only holds the tokens. Logout
  must revoke on the server, deleting the local copy is not enough.
- Why does Apple reject an app with only "Sign in with Google"? Guideline 4.8: a
  third-party login needs an equivalent privacy-focused option next to it.
- Biometrics changed and the secure item is gone: is this a bug? No, it is the
  point: a newly added fingerprint must not unlock the old secret. Fall back to
  the password.
- How do you restore the session without a flash of the login screen? Keep the
  splash screen until the refresh finishes
  (`SplashScreen.preventAutoHideAsync`).

## Common Mistakes

- Login in a WebView "to keep the user in the app".
- A client secret in the app or in `EXPO_PUBLIC_*` variables: it is in the
  bundle, see [Environment Configuration](./release/env.md).
- Tokens in AsyncStorage or in persisted Redux state, see
  [Storage](./storage.md).
- `if (await authenticateAsync()).success` as the only check before using a
  stored token.
- Every failed request refreshing on its own: parallel refreshes with rotation
  log the user out.
- Logout that only deletes the local token.

## See Also

- [Authentication and Authorization](../web-platform/network/authentication.md)
- [Storage](./storage.md)
- [Deep Linking](./deep-linking.md)
- [Navigation](./navigation.md)
- [Mobile App Security](./security.md)
- [Authentication (Expo docs)](https://docs.expo.dev/guides/authentication/)
