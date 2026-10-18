---
sidebar_position: 16
description:
  AppState states and events, refresh on return, hiding content in the app
  switcher, why JS stops in the background, expo-background-task, Headless JS,
  foreground services
tags: [middle]
---

# App Lifecycle and Background Work

**`AppState`** reports whether the app is **`active`** (in the foreground),
**`background`** or **`inactive`** (iOS only: a transition, the app switcher, an
incoming call). It is used to refresh data when the user comes back, pause
media, hide private content. In the background iOS **suspends** the app within
seconds and Android may defer or kill it: timers, `fetch` and sockets stop, and
there is no reliable long-running JS. Background work goes through the OS:
periodic tasks (**`expo-background-task`**), silent pushes, background location,
and on Android Headless JS and foreground services. The OS decides when they
run.

Applies to: React Native 0.88, Expo SDK 58.

## Details

### `AppState`

| State        | Meaning                                                                                         |
| ------------ | ----------------------------------------------------------------------------------------------- |
| `active`     | In the foreground, receiving touches                                                            |
| `background` | Another app or the home screen; on Android also another activity (a system picker, autofill)    |
| `inactive`   | iOS only: between foreground and background, the app switcher, Control Center, an incoming call |

| Event           | When                                                                                                                       |
| --------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `change`        | The state changed; the listener gets the new state                                                                         |
| `memoryWarning` | iOS: the system is low on memory; drop caches                                                                              |
| `focus`, `blur` | Android: `blur` when the user stops interacting (the notification drawer) without a state change, `focus` when they return |

`AppState.currentState` gives the state now; `addEventListener` returns a
subscription with `remove()`.

### Typical Uses

- **Refresh on return**: `background` → `active`; with TanStack Query, pass the
  state to `focusManager` (see [Offline Support](./offline.md)).
- **Pause** video, audio, the camera or a game loop; close a socket and reopen
  it on return.
- **Hide private content** in the app switcher: iOS takes a snapshot right after
  `inactive`, so show an overlay then (`expo-screen-capture` has
  `enableAppSwitcherProtectionAsync` on iOS); on Android `FLAG_SECURE`
  (`preventScreenCaptureAsync`) blanks the preview.
- **Lock after a timeout**: save the time on `background`; on `active`, if more
  than N minutes passed, show a PIN or biometric screen
  (`expo-local-authentication`).
- **Save a draft** on `background`: the app may be killed without another event.

**App state is not screen focus.** Leaving a screen in the navigator fires
`useFocusEffect` cleanup but not `AppState`; sending the app to the background
fires `AppState` but not a blur of the screen. A camera screen needs both; see
[Navigation](./navigation.md#mount-vs-focus).

### Why JS Stops in the Background

- **iOS** suspends the app a few seconds after it leaves the foreground; native
  code can ask for about 30 more seconds to finish a task. A suspended app runs
  no code at all.
- **Android** keeps the process for a while, but Doze and App Standby defer
  network and jobs, and the process can be killed at any moment to free memory.
- So `setTimeout(sync, 10 * 60_000)` does not fire on time, a long `fetch` can
  fail, a socket drops. A reminder at a set time is a scheduled local
  notification, not a timer.

### Background Options

| Option                                | What it is for                                             | Limits                                                                             |
| ------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `expo-background-task`                | Periodic deferrable work: sync, prefetch, cleanup          | `minimumInterval` ≥ 15 min, only a hint; runs with enough battery and network      |
| Silent (data-only) push               | The server wakes the app to fetch new data                 | Throttled on iOS; see [Push Notifications](./notifications.md#message-types)       |
| Background location (`expo-location`) | Tracking a trip, geofences                                 | "Always" permission, iOS background mode, Android foreground service; store review |
| Background audio                      | Music and podcast players                                  | iOS `audio` background mode; Android media service                                 |
| Headless JS (Android)                 | JS started by a native service or broadcast                | Native code to start it; no UI; a timeout per task                                 |
| Foreground service (Android)          | Long work the user knows about: upload, navigation, a call | A persistent notification; a declared service type since Android 14                |

- `expo-background-task` uses **WorkManager** on Android and
  **`BGTaskScheduler`** on iOS through `expo-task-manager`. The task is defined
  with `TaskManager.defineTask` at module level, not in a component: the OS may
  start the app without UI just to run it.
- All tasks share one worker, so the last registered task sets the interval.
  `expo-background-fetch` is deprecated in favor of it.

### iOS vs Android

|                        | iOS                                                                                                                         | Android                                                           |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Periodic work          | `BGTaskScheduler`: the system picks the time, often at night on a charger                                                   | WorkManager: at least 15 min, with constraints                    |
| The user kills the app | Background tasks stop until the next launch                                                                                 | Tasks usually continue; a force stop in Settings stops everything |
| Vendor differences     | None                                                                                                                        | Some vendors kill background apps aggressively                    |
| Long-running work      | Special modes (audio, location, VoIP), background `URLSession` transfers, user-started `BGContinuedProcessingTask` (iOS 26) | A foreground service with a notification                          |

### Testing a Background Task

- iOS: a physical device; `BGTaskScheduler` does not run in the simulator.
- `BackgroundTask.triggerTaskWorkerForTestingAsync()` runs the tasks now, in
  development builds only.
- Not in Expo Go for background location and foreground services: use a
  development build.

## Example

```tsx title="useAppLock.ts"
import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

const LOCK_AFTER_MS = 5 * 60_000;

export function useAppLock(onReturn: () => void) {
  const [locked, setLocked] = useState(false);
  const leftAt = useRef<number | null>(null);

  useEffect(() => {
    // highlight-next-line
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        leftAt.current = Date.now();
      } else if (state === 'active' && leftAt.current !== null) {
        if (Date.now() - leftAt.current > LOCK_AFTER_MS) setLocked(true);
        leftAt.current = null;
        onReturn(); // refresh data
      }
    });
    return () => sub.remove();
  }, [onReturn]);

  return { locked, unlock: () => setLocked(false) };
}
```

<details>
<summary>A periodic sync with expo-background-task</summary>

```ts title="backgroundSync.ts"
import * as BackgroundTask from 'expo-background-task';
import * as TaskManager from 'expo-task-manager';

const SYNC_TASK = 'sync-outbox';

// Module level: the OS can start the app without UI just for this
TaskManager.defineTask(SYNC_TASK, async () => {
  try {
    await syncOutbox(); // a short job: the OS gives it limited time
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export async function registerSync() {
  const status = await BackgroundTask.getStatusAsync();
  if (status === BackgroundTask.BackgroundTaskStatus.Available) {
    await BackgroundTask.registerTaskAsync(SYNC_TASK, {
      minimumInterval: 60, // minutes, a hint: the OS picks the time
    });
  }
}

declare function syncOutbox(): Promise<void>;
```

</details>

## Follow-up Questions

- Can JS keep running after the user leaves the app? Not reliably: only inside
  OS-scheduled tasks or special modes (audio, location, a foreground service).
- Why did a background task never run in testing? The iOS simulator does not
  support it, the interval is only a hint, and on iOS a task stops once the user
  swipes the app away.
- How do you refresh data when the user comes back? Listen for `active` in
  `AppState` (or `focusManager` in TanStack Query) and refetch stale data.
- What happens to an in-flight request when the app goes to the background? It
  may finish, fail or hang until the app returns; make writes retryable and
  idempotent, see [Offline Support](./offline.md).
- How does a push arrive when the app is closed? The OS shows it without your
  JS; code runs only for a tap or a background handler, see
  [Push Notifications](./notifications.md).

## Common Mistakes

- Relying on `setInterval` or a long `setTimeout` for background sync.
- Treating `inactive` as background: on iOS it fires for the app switcher and
  incoming calls, and never on Android.
- Defining a background task inside a component: when the OS starts the app for
  the task, the component is not mounted.
- Promising exact background timing: the OS decides, and the user can disable
  background refresh.
- `AppState` listeners without `remove()`.

## See Also

- [Navigation](./navigation.md)
- [Push Notifications](./notifications.md)
- [Permissions](./permissions.md)
- [Offline Support](./offline.md)
