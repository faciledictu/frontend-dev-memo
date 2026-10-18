---
sidebar_position: 9
description:
  React Navigation vs Expo Router, stack / tabs / drawer, screens that stay
  mounted, navigate vs push vs popTo, typed params, auth flow
tags: [junior, middle]
---

# Navigation: React Navigation and Expo Router

React Native has no URL bar or history: navigation is a library. **React
Navigation** is configured in code: **navigators** (stack, tabs, drawer) hold
**screens**. **Expo Router** builds the same navigators from **files** in
`app/`, like Next.js, and gives every screen a URL and a deep link. In a
**stack**, opening a screen pushes it on top and the previous one **stays
mounted**: a screen is notified about **focus**, not remounted.

Applies to: React Native 0.88, React Navigation 7, Expo SDK 58.

## Details

### React Navigation or Expo Router

|              | React Navigation                                                          | Expo Router                                   |
| ------------ | ------------------------------------------------------------------------- | --------------------------------------------- |
| Routes       | In code: the static API (an object, recommended) or the dynamic API (JSX) | Files: `app/profile/[id].tsx` → `/profile/42` |
| Deep links   | A `linking` config; the static API can generate it                        | Every screen has a URL automatically          |
| Typed params | A param list per navigator                                                | Typed routes (beta)                           |
| Works in     | Any React Native app                                                      | Apps on Expo CLI, bare ones included          |
| Web          | Possible                                                                  | URLs, static rendering                        |

- The **static API** (`createNativeStackNavigator({ screens })`) is an object
  known before render: it generates deep links and types. The **dynamic API**
  (`<Stack.Navigator>` with `<Stack.Screen>`) can change screens at render time,
  at the cost of writing types and links by hand.
- Expo Router was built on React Navigation; since SDK 56 it ships its own fork,
  and app code imports its APIs from `expo-router` entry points (for example
  `expo-router/react-navigation`), not from `@react-navigation/*`.

### Navigators

| Navigator    | What it is                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| Native stack | `UINavigationController` / Android fragments: native transitions, gestures and headers (default)                                       |
| Stack (JS)   | Drawn in JS: fully customizable transitions, slower                                                                                    |
| Bottom tabs  | A JS tab bar; native tabs (`UITabBarController`) are unstable in React Navigation 7, stable in Expo Router (`expo-router/native-tabs`) |
| Drawer       | A side menu opened by a swipe                                                                                                          |

Navigators nest: a typical app is a root stack with a tab navigator as one of
its screens and a stack inside each tab.

### Mount vs Focus

- Going forward in a stack keeps the previous screen mounted; going back
  unmounts the top one.
- Tab screens mount on the first visit (`lazy`) and then stay mounted.
- So `useEffect` with `[]` runs once per mount, not each time the user returns
  to the screen. For "on every visit" (refresh data, start a camera) use
  **`useFocusEffect`** with a `useCallback`; `useIsFocused()` returns a boolean
  for rendering.
- Screen focus is not app focus: sending the app to the background does not blur
  the screen; see [App Lifecycle](./app-lifecycle.md).

### Moving Between Screens

| Call                          | In a stack                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `navigate('Profile', params)` | Pushes the screen, or updates params if it is already focused; in v7 it no longer goes back to an earlier `Profile` |
| `push('Profile', params)`     | Always pushes a new copy, even if the same screen is on top                                                         |
| `popTo('Home')`               | Goes back to `Home` in the stack (new in v7)                                                                        |
| `goBack()` / `pop(n)`         | Back by one / by `n` screens                                                                                        |
| `replace('Home')`             | Replaces the current screen: no way back to it                                                                      |
| `setParams({ … })`            | Updates the current screen's params                                                                                 |

In Expo Router the same moves are `router.push('/profile/42')`,
`router.navigate`, `router.back()`, `router.replace`, `router.dismissTo`, and
`<Link href="/profile/42">`.

Params go into the URL in a deep link, so keep them small and serializable: an
ID, not a whole object.

### Auth Flow

- Do not navigate to the login screen imperatively. **Render only the screens
  that are allowed**: when the session changes, the navigator switches the set,
  and a logged-out user has no way back to private screens.
- React Navigation static API: `if: useIsSignedIn` on a screen or a group.
  Dynamic API: `{isSignedIn ? <Stack.Screen …/> : <Stack.Screen …/>}`.
- Expo Router: `<Stack.Protected guard={isSignedIn}>` around the screens;
  `redirectTo` (SDK 58) names where a denied navigation goes (by default, the
  first available screen). It is a client-side check: the API still verifies the
  token.

### Expo Router Files

| File                     | Route                                                          |
| ------------------------ | -------------------------------------------------------------- |
| `app/_layout.tsx`        | The navigator for the folder: `<Stack />`, `<Tabs />`          |
| `app/index.tsx`          | `/`                                                            |
| `app/profile/[id].tsx`   | `/profile/42`; `useLocalSearchParams()` returns `{ id: '42' }` |
| `app/(tabs)/_layout.tsx` | A group: its own navigator, not part of the URL                |
| `app/+not-found.tsx`     | Unmatched URLs                                                 |

## Example

React Navigation, static API, with an auth flow:

```tsx title="App.tsx"
import {
  createStaticNavigation,
  type StaticParamList,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useSession } from './session';
import { HomeScreen, LoginScreen, ProfileScreen } from './screens';

const useIsSignedIn = () => useSession() !== null;
const useIsSignedOut = () => useSession() === null;

const RootStack = createNativeStackNavigator({
  groups: {
    SignedIn: {
      // highlight-next-line
      if: useIsSignedIn,
      screens: { Home: HomeScreen, Profile: ProfileScreen },
    },
    SignedOut: {
      if: useIsSignedOut,
      screens: { Login: LoginScreen },
    },
  },
});

type RootStackType = typeof RootStack;
export type RootStackParamList = StaticParamList<RootStackType>;

declare module '@react-navigation/native' {
  interface RootNavigator extends RootStackType {}
}

const Navigation = createStaticNavigation(RootStack);

export default function App() {
  return <Navigation />;
}
```

<details>
<summary>Typed params, useFocusEffect and the same in Expo Router</summary>

```tsx title="screens/profile.tsx"
import { useCallback } from 'react';
import { Button, Text } from 'react-native';
import {
  useFocusEffect,
  useNavigation,
  type StaticScreenProps,
} from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App';
import { refetchProfile } from '../api';

type Props = StaticScreenProps<{ id: string }>;

export function ProfileScreen({ route }: Props) {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      refetchProfile(route.params.id); // on every visit, not only on mount
    }, [route.params.id])
  );

  return (
    <>
      <Text>Profile {route.params.id}</Text>
      <Button title="Home" onPress={() => navigation.popTo('Home')} />
    </>
  );
}
```

```tsx title="app/_layout.tsx"
import { Stack } from 'expo-router';
import { useSession } from '@/session';

export default function RootLayout() {
  const isSignedIn = useSession() !== null;
  return (
    <Stack>
      <Stack.Protected guard={isSignedIn} redirectTo="/login">
        <Stack.Screen name="index" />
        <Stack.Screen name="profile/[id]" />
      </Stack.Protected>
      <Stack.Protected guard={!isSignedIn}>
        <Stack.Screen name="login" />
      </Stack.Protected>
    </Stack>
  );
}
```

</details>

## Follow-up Questions

- Native stack or JS stack? Native stack by default: platform transitions and
  gestures, less JS work. The JS stack when a transition must look custom or the
  same on both platforms.
- Why does a screen not refresh when the user comes back to it? It was never
  unmounted; refresh in `useFocusEffect` or with a query library's
  refetch-on-focus.
- How do you pass a result back to the previous screen?
  `popTo('Edit', { result }, { merge: true })` (without `merge` the screen's
  params are replaced), or keep the data in shared state.
- Why does a tab screen keep its scroll position? Tabs stay mounted; pressing
  the active tab again scrolls a list to the top (`useScrollToTop`).
- What is `getId`? A function that returns an ID from params, so that
  `navigate('Profile', { id: 2 })` opens a new `Profile` instead of updating the
  one for `id: 1`.
- How do you navigate from outside a component (a push handler, an API
  interceptor)? A ref from `createNavigationContainerRef()` passed to the
  container: `navigationRef.navigate(…)` once `isReady()`. In Expo Router,
  `router` can be imported anywhere.
- How do you open a screen inside a nested navigator?
  `navigate('Tabs', { screen: 'Profile', params })`; in Expo Router, just the
  URL.

## Common Mistakes

- Loading data in `useEffect([])` and expecting it to run when the user returns
  to the screen.
- Navigating to `Login` on logout instead of switching the rendered screens: the
  user can swipe back to a private screen.
- Passing whole objects or callbacks as params: they are not serializable and
  break deep links and state persistence.
- Importing `@react-navigation/*` in an Expo Router app on SDK 56+.

## See Also

- [Deep Linking](./deep-linking.md)
- [Safe Area and Edge-to-Edge](./safe-area.md)
- [Routing in React](../react/ecosystem/routing.md)
- [App Router in Next.js](../nextjs/app-router/overview.md)
