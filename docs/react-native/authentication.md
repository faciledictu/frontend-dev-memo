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

The system browser session is isolated from the app. On iOS,
`ASWebAuthenticationSession` returns the callback only to the calling app; on
Android another app can register the same custom scheme and catch the redirect,
which is what PKCE and verified links are for.

### Libraries

|               | `expo-auth-session` + `expo-web-browser`                       | `react-native-app-auth`                             |
| ------------- | -------------------------------------------------------------- | --------------------------------------------------- |
| Built on      | Expo modules; `openAuthSessionAsync` opens the browser session | AppAuth-iOS and AppAuth-Android (the OpenID SDKs)   |
| API           | `useAuthRequest` → `promptAsync`, then `exchangeCodeAsync`     | `authorize(config)`, `refresh`, `revoke`            |
| PKCE          | On by default (`usePKCE`)                                      | On by default                                       |
| Token helpers | `refreshAsync`, `revokeAsync`, discovery from the issuer       | Token exchange inside `authorize`                   |
| Fits          | Expo apps; the library the Expo guide uses                     | Bare apps, or when the AppAuth behavior is required |

- PKCE and the code flow in general: see
  [Authentication and Authorization](../web-platform/network/authentication.md).
- A **client secret** never goes into the app: it is in the bundle, see
  [Environment Configuration](./release/env.md). A provider that requires one
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
  data to name and email, lets the user hide the email and does not collect
  interactions for advertising without consent; Sign in with Apple is the usual
  one. Not needed when the app has only its own accounts.
- **Google** on Android: the native flow is **Credential Manager**; the old
  Google Sign-In for Android SDK is deprecated, and Google no longer accepts
  custom schemes for Android OAuth clients. Use a wrapper library around the
  native flow; it needs a development build.
- The native SDK returns an **ID token**; send it to your server, verify it
  there and issue your own session.
- **Passkeys**: WebAuthn through community libraries (`react-native-passkey`);
  they need the same domain association files as verified links, with their own
  entries (`webcredentials:` on iOS, `get_login_creds` in `assetlinks.json`).

### Token Lifecycle

The refresh-once pattern and rotation are the same as on the web, see
[Authentication and Authorization](../web-platform/network/authentication.md).
On mobile:

| Step    | What happens                                                                                      |
| ------- | ------------------------------------------------------------------------------------------------- |
| Login   | Code + PKCE → access token, refresh token, ID token                                               |
| Storage | Access token in memory; refresh token in `expo-secure-store` / `react-native-keychain`            |
| Launch  | Keep the splash screen, read the refresh token, refresh; then show the app or the login screen    |
| Refresh | Write the **rotated** refresh token back to the secure store before the old one is used again     |
| Logout  | Revoke on the server, delete from the secure store, clear caches and state; ignore late refreshes |

- Refresh fails with `400` / `401` (expired, revoked): clear the session and
  show the login screen; the navigator switches screens by the session, see
  [Navigation](./navigation.md#auth-flow). A network error or `5xx` is not a
  logout.
- Background refresh while the device is locked needs a Keychain class that
  allows it, see [Storage](./storage.md#secrets).

### Biometric Login

| Approach                                                           | Against hooking (Frida) on a rooted device                   |
| ------------------------------------------------------------------ | ------------------------------------------------------------ |
| `LocalAuthentication.authenticateAsync()` → `if (success) login`   | Hooked to return `success: true`: the check is gone          |
| Secret in a Keychain / Keystore item with `requireAuthentication`  | The OS releases it only after a real biometric check         |
| Key pair in the Secure Enclave / Keystore signs a server challenge | The private key never leaves the hardware; the server checks |

- `expo-local-authentication` alone is a **UI gate**: fine for "lock the app
  after 5 minutes", not as the only check before giving out a token.
  `biometricsSecurityLevel: 'strong'` makes the gate use only strong sensors on
  Android, but it is still a gate.
- `requireAuthentication: true` in `expo-secure-store` shows the system prompt
  on every read (and on Android on every write), and the item becomes unreadable
  when the user adds a fingerprint or re-enrolls Face ID: handle `null` as "log
  in with the password again".
- So do not put the refresh token that rotates on every refresh behind it:
  silent refresh would prompt every time. Protect a separate secret that is read
  once at launch to restore the session, or use a key pair (the last row).

## Example

A fetch wrapper that keeps the refresh token in the secure store and shares one
refresh between parallel requests:

```ts title="api.ts"
import * as SecureStore from 'expo-secure-store';

const API = 'https://api.example.com';
let accessToken: string | null = null;
let refreshing: Promise<string | null> | null = null;
let session = 0; // bumped on logout, so a late refresh cannot restore it

let onSessionExpired = () => {};
export const setOnSessionExpired = (cb: () => void) => (onSessionExpired = cb);

async function refreshTokens(): Promise<string | null> {
  const started = session;
  const refreshToken = await SecureStore.getItemAsync('refreshToken');
  if (!refreshToken) return null;
  const res = await fetch(`${API}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (res.status === 400 || res.status === 401) {
    await logout(); // revoked or expired: back to the login screen
    onSessionExpired();
    return null;
  }
  if (!res.ok) return null; // 5xx or offline: keep the session, retry later
  const tokens: { accessToken: string; refreshToken: string } =
    await res.json();
  if (started !== session) return null; // logged out meanwhile
  // highlight-next-line
  await SecureStore.setItemAsync('refreshToken', tokens.refreshToken); // rotated
  accessToken = tokens.accessToken;
  return accessToken;
}

export async function apiFetch(path: string, init: RequestInit = {}) {
  const send = (token: string | null) => {
    const headers = new Headers(init.headers);
    if (token) headers.set('Authorization', `Bearer ${token}`);
    return fetch(`${API}${path}`, { ...init, headers });
  };

  const sentWith = accessToken;
  const res = await send(sentWith);
  if (res.status !== 401) return res;
  // Another request has already refreshed: just retry
  if (accessToken && accessToken !== sentWith) return send(accessToken);

  refreshing ??= refreshTokens().finally(() => (refreshing = null));
  const token = await refreshing;
  return token ? send(token) : res;
}

export async function logout() {
  session++;
  accessToken = null;
  await SecureStore.deleteItemAsync('refreshToken');
  // and revoke the refresh token on the server
}
```

<details>
<summary>Login with expo-auth-session</summary>

```tsx title="LoginButton.tsx"
import { useEffect, useRef } from 'react';
import { Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession(); // closes the popup on web

const clientId = 'mobile-app';

export function LoginButton({
  onTokens,
  onError,
}: {
  onTokens: (tokens: AuthSession.TokenResponse) => void;
  onError: (error: unknown) => void;
}) {
  const discovery = AuthSession.useAutoDiscovery('https://auth.example.com');
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: 'com.example.app',
  });
  const exchanged = useRef(false); // a code can be used only once

  // PKCE is on by default: the request holds the code verifier
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    { clientId, redirectUri, scopes: ['openid', 'profile', 'offline_access'] },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'error') onError(response.error);
    if (response?.type !== 'success' || !discovery || !request?.codeVerifier) {
      return;
    }
    if (exchanged.current) return;
    exchanged.current = true;
    AuthSession.exchangeCodeAsync(
      {
        clientId,
        redirectUri,
        code: response.params.code,
        // highlight-next-line
        extraParams: { code_verifier: request.codeVerifier },
      },
      discovery
    ).then(onTokens, onError);
  }, [response]);

  return (
    <Button title="Sign in" disabled={!request} onPress={() => promptAsync()} />
  );
}
```

</details>

## Follow-up Questions

- Why not log in with a native form that posts the password to the API? It works
  for your own accounts through your own login endpoint (not the OAuth password
  grant, which RFC 9700 forbids), but you lose SSO, passkeys and the provider's
  MFA and fraud checks, and a phishing app looks the same.
- Is the implicit flow acceptable for a mobile app? No: RFC 9700 says clients
  should not use it; the token comes in the URL and there is no refresh token.
- Why does Apple reject an app with only "Sign in with Google"? Guideline 4.8: a
  third-party login needs an equivalent privacy-focused option next to it.
- How do you restore the session without a flash of the login screen? Keep the
  splash screen until the refresh finishes
  (`SplashScreen.preventAutoHideAsync`).
- The user reinstalled the app on iOS and is still signed in. Why? Keychain
  items can survive an uninstall; clear them on the first launch, see
  [Storage](./storage.md#secrets).

## Common Mistakes

- Login in a WebView "to keep the user in the app".
- A client secret in the app; tokens in AsyncStorage or in persisted Redux
  state.
- `if ((await authenticateAsync()).success)` as the only check before using a
  stored token.
- The rotating refresh token behind `requireAuthentication`: a biometric prompt
  on every silent refresh.
- Logging the user out on any failed refresh, including a timeout or a `503`.
- A refresh that finishes after logout and writes the token back.

## See Also

- [Authentication and Authorization](../web-platform/network/authentication.md)
- [Storage](./storage.md)
- [Deep Linking](./deep-linking.md)
- [Navigation](./navigation.md)
- [Mobile App Security](./security.md)
- [Authentication (Expo docs)](https://docs.expo.dev/guides/authentication/)
