---
sidebar_position: 9
description:
  How push notifications work, device tokens, notification vs data messages,
  foreground / background / quit behavior, APNs keys, libraries
tags: [middle]
---

# Push Notifications

A push goes **your server → a push service → the device**: **APNs** on iOS,
**FCM** (Firebase Cloud Messaging) on Android. The app asks the user for
permission (iOS always, Android 13+ too), registers with the push service and
gets a **device token** for this installation, and sends the token to your
backend. The backend sends a message to APNs / FCM with that token, and the
service delivers it. What the user sees depends on the **message type** and on
whether the app is in the **foreground, background or quit**.

Applies to: React Native 0.88, Expo SDK 58.

## Details

### Flow

1. Ask for permission (`POST_NOTIFICATIONS` on Android 13+).
2. Get a token: from APNs / FCM, or an Expo push token that wraps them.
3. Send it to the backend with the user ID; update it when it changes (the token
   can be refreshed, and it changes after reinstalling).
4. The backend sends a message to FCM / APNs (or to the Expo push service) with
   the token.
5. The OS shows the notification, or the app handles it in code.
6. A tap on the notification opens the app; read the payload to navigate.

### Message Types

| Type         | Content                             | Who shows it                                               |
| ------------ | ----------------------------------- | ---------------------------------------------------------- |
| Notification | `title`, `body` (+ optional `data`) | The OS, when the app is in the background or quit          |
| Data-only    | Only `data`                         | Nobody: the app receives it in code and decides what to do |

Data-only messages are not guaranteed: iOS treats them as low-priority
background pushes, may throttle them and does not deliver them to an app the
user has swiped away; Android delivers nothing to an app force-stopped in
Settings.

### App State

| App state  | Notification message                                                                                              | Data-only message                                           |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| Foreground | OS default: **not shown**, the app gets an event; `expo-notifications` shows it unless the handler says otherwise | Event in the app                                            |
| Background | Shown by the OS; tap opens the app                                                                                | Background handler, with a short time limit                 |
| Quit       | Shown by the OS; tap launches the app with the payload                                                            | Background handler on Android; usually not delivered on iOS |

### Libraries

| Library                            | Notes                                                                                                               |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `expo-notifications`               | Permissions, tokens (Expo or native), foreground display, local and scheduled notifications. Works in bare apps too |
| `@react-native-firebase/messaging` | FCM on both platforms (FCM forwards to APNs on iOS); does not display foreground notifications on Android           |
| Notifee                            | Was the usual pair for Firebase to display local notifications; archived, its authors point to `expo-notifications` |
| `react-native-push-notification`   | Common in older projects; last release in 2021, the repository is archived                                          |

### Credentials

- **iOS**: an **APNs authentication key** (`.p8`) from the Apple Developer
  account, uploaded to Firebase or Expo. A team-scoped key works for all apps of
  the team and does not expire. The older per-app `.p12` certificate expires
  every year.
- **Android**: a Firebase project and `google-services.json` in the app; the
  backend authenticates to the **FCM HTTP v1 API** with a service account (the
  legacy API with a server key was shut down in 2024).

## Example

Expo: permission, token and handlers.

```tsx
import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';

// How to present notifications while the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export async function registerForPush(projectId: string) {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') return null;

  const { data: token } = await Notifications.getExpoPushTokenAsync({
    projectId,
  });
  return token; // send it to the backend
}

export function useNotificationTap(
  onOpen: (data?: Record<string, unknown>) => void
) {
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => onOpen(response.notification.request.content.data)
    );
    return () => subscription.remove();
  }, [onOpen]);
}
```

<details>
<summary>FCM HTTP v1 request from the backend</summary>

```json
{
  "message": {
    "token": "dXzlLpz...abc123",
    "notification": { "title": "Hi!", "body": "You have a new message" },
    "data": { "chatId": "42" }
  }
}
```

Sent as `POST https://fcm.googleapis.com/v1/projects/{project-id}/messages:send`
with an OAuth 2.0 access token of a service account.

</details>

## Follow-up Questions

- Expo push token or device token? With the Expo token one call to Expo's push
  service covers both platforms; with device tokens the backend talks to APNs
  and FCM itself.
- What is an Android notification channel? On Android 8+ the importance, sound
  and vibration belong to a channel, which must exist before the first
  notification (on Android 13+, before the permission prompt); after creation
  only the user can change it, the app only its name and description.
- How do you open a screen on tap? Read `data` in the response listener and
  navigate; for a cold start use `useLastNotificationResponse()`.

## Common Mistakes

- Testing remote pushes in Expo Go on Android: since SDK 53 they need a
  development build.
- Expecting a notification to appear while the app is open with Firebase
  messaging: it is delivered to the code; with `expo-notifications` the handler
  decides.
- Relying on data-only pushes for important updates on iOS.
- Storing the token once: it must be refreshed and tied to the current user, and
  removed on logout.
- Sending the legacy FCM payload with `to` and a server key: that API no longer
  works.

## See Also

- [Permissions](./permissions.md)
- [Platform-Specific Code](./platform-specific-code.md)
