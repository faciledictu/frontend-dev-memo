---
sidebar_position: 7
description:
  Custom URL schemes vs Universal Links and App Links, linking config, cold
  start vs a running app, opening a screen from a notification
tags: [middle]
---

# Deep Linking

A **deep link** is a URL that opens a specific screen of the app. The OS hands
the URL to the app; the navigation library parses it into a screen and params.
There are two kinds: a **custom scheme** (`myapp://profile/42`), which any app
can register, and **Universal Links** (iOS) / **App Links** (Android): ordinary
`https://` links that open the app only if **your domain confirms** the app with
a file in `/.well-known/`. The app receives a URL in two ways: **at launch**
(cold start) and **while running** (an event).

Applies to: React Native 0.88, React Navigation 7, Expo SDK 58.

## Details

### Scheme vs Verified Links

|                   | Custom scheme `myapp://`                           | Universal Links / App Links `https://`                |
| ----------------- | -------------------------------------------------- | ----------------------------------------------------- |
| Setup             | `scheme` in `app.json` (or `Info.plist`, manifest) | A file on your domain + entitlements / intent filters |
| App not installed | The link fails                                     | Opens the website instead                             |
| Ownership         | Not verified: another app can claim the scheme     | Verified: the OS checks the domain                    |
| Use               | Development, OAuth redirects, app-to-app calls     | Links in email, messages, the web, marketing          |

- **iOS**: `apple-app-site-association` (JSON, no extension) at
  `https://example.com/.well-known/`, served over HTTPS without redirects, and
  `associatedDomains: ['applinks:example.com']` in the app.
- **Android**: `assetlinks.json` at `/.well-known/` with the package name and
  the signing certificate's SHA-256 fingerprint, and an intent filter with
  `autoVerify: true`. With Play App Signing the fingerprint is Google's key, not
  the upload key.
- A hijacked scheme can catch an OAuth redirect with the authorization code;
  this is why OAuth in apps uses **PKCE** or verified links.

### From URL to Screen

- **React Navigation**: pass `linking` to the navigation container with
  `prefixes` (`myapp://`, `https://example.com`) and a map of screens to paths
  (`Profile: 'user/:id'`). In the static API, `enabled: 'auto'` generates paths
  for all screens; a screen can override its own `linking`.
- **Expo Router**: every file is already a path; nothing to configure.
  `+native-intent.tsx` rewrites incoming URLs that do not match the files (an
  old path, a third-party link format).
- A deep link to a nested screen builds the whole state: the parent navigators
  and the screens under it, so "back" works.

### Cold Start vs Running App

| App state                          | How the URL arrives                      |
| ---------------------------------- | ---------------------------------------- |
| Not running                        | `Linking.getInitialURL()` once at launch |
| Running (foreground or background) | `Linking.addEventListener('url', …)`     |

React Navigation and Expo Router handle both; you write this code yourself only
for URLs that do not go through them, such as notification taps. A frequent bug
is handling only one of the two: links work when the app is open and not from a
cold start, or the other way round.

### Opening a Screen from a Notification

A push notification is not a URL, but the same idea works: put a URL into the
notification's `data`, and on a tap navigate to it. Like links, a tap has two
paths: `getLastNotificationResponse()` for a cold start and
`addNotificationResponseReceivedListener` for a running app. With React
Navigation the same can go into `linking.getInitialURL` and `linking.subscribe`,
so links and notification taps share one parser.

### Validating Params

A deep link is input from outside: anyone can send
`myapp://transfer?to=…&sum=…`.

- Treat params like a query string from the web: parse and validate (`id` is a
  number, the screen exists).
- A link must not perform an action (pay, delete, change settings) without
  confirmation on the screen.
- Private screens behind a link still require a session: the auth flow decides,
  not the link.

## Example

React Navigation, static API, with notification taps in the same config:

```tsx title="App.tsx"
import { createStaticNavigation } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { RootStack } from './navigation'; // Profile has linking: 'user/:id'

const Navigation = createStaticNavigation(RootStack);

const linking = {
  prefixes: [Linking.createURL('/'), 'https://example.com'],
  // highlight-next-line
  enabled: 'auto' as const,
  // Cold start: a link or a notification tap that launched the app
  async getInitialURL() {
    const url = await Linking.getInitialURL();
    if (url) return url;
    const response = Notifications.getLastNotificationResponse();
    return response?.notification.request.content.data?.url as
      string | undefined;
  },
  // Running app: new links and notification taps
  subscribe(listener: (url: string) => void) {
    const link = Linking.addEventListener('url', ({ url }) => listener(url));
    const tap = Notifications.addNotificationResponseReceivedListener((r) => {
      const url = r.notification.request.content.data?.url;
      if (typeof url === 'string') listener(url);
    });
    return () => {
      link.remove();
      tap.remove();
    };
  },
};

export default function App() {
  return <Navigation linking={linking} />;
}
```

<details>
<summary>Universal Links and App Links in app.json, testing</summary>

```json title="app.json"
{
  "expo": {
    "scheme": "myapp",
    "ios": { "associatedDomains": ["applinks:example.com"] },
    "android": {
      "intentFilters": [
        {
          "action": "VIEW",
          "autoVerify": true,
          "data": [{ "scheme": "https", "host": "example.com" }],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

```bash
# Open a link in a simulator or an emulator
npx uri-scheme open "myapp://user/42" --ios
adb shell am start -W -a android.intent.action.VIEW -d "https://example.com/user/42"
```

</details>

## Follow-up Questions

- Why does a Universal Link open Safari instead of the app? The association file
  is not reachable (redirect, wrong content type, not on HTTPS), the entitlement
  is missing, or the user tapped a link on the same domain inside Safari; iOS
  also caches the file, so a fix may need a reinstall.
- Why can a link typed into Safari's address bar not open the app? Universal
  Links open the app only on a tap from another context; typing the URL loads
  the website.
- How do you open the app from a link if it is not installed and then land on
  the right screen after install? A deferred deep link: the store does not pass
  the URL, so it needs a service (Branch, AppsFlyer) or a backend that matches
  the click with the first launch.
- How do you test App Link verification on Android?
  `adb shell pm get-app-links <package>` shows whether each domain is
  `verified`.
- A logged-out user opens a link to a private screen; where do they land after
  login? Without extra code, on the default screen: the auth flow drops the URL.
  Save the intended path before showing the login screen and `replace` to it
  after login.

## Common Mistakes

- Handling only `getInitialURL` or only the `url` event.
- Using a custom scheme for links that leave the app (email, the web): it fails
  without the app and can be claimed by another app.
- Trusting params from a link: an ID or an action taken as is.
- An `assetlinks.json` with the upload key's fingerprint while the store build
  is signed by Google.

## See Also

- [Navigation](./navigation.md)
- [Push Notifications](./notifications.md)
- [Authentication](../web-platform/network/authentication.md)
