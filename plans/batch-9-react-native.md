# Batch 9: React Native

Status: proposed, not approved. React Native is the current focus of the cheat
sheet. This batch covers the topics batch 6 deferred: core components, safe area
and keyboard, `AppState` and background work, offline. It also adds native
modules, a standard senior question. Six new pages in `docs/react-native/`, plus
a list of pages for later. Starting point: `main` at 10f5e01.

## Interview Questions the Section Does Not Answer Yet

Collected from reactnative.dev, docs.expo.dev and current question lists for
middle and senior mobile and cross-platform roles:

- What are the core components, and why must every string be inside `<Text>`?
  `Image` from a URL shows nothing; why? Controlled vs uncontrolled `TextInput`.
- How do you handle the notch and the home indicator? Why is `SafeAreaView` from
  `react-native` not enough? What is edge-to-edge on Android?
- The keyboard covers the input; how do you fix it on iOS and Android? A tap on
  a button closes the keyboard but does not press the button; why?
- What happens to the app in the background? Can JS run there? How do you
  refresh data when the user comes back? How do you sync data periodically?
- How do you build an app that works offline? How do you know the device is
  online? What happens to a request made offline?
- How do you write a native module? Turbo Module, Expo Module or Nitro? Sync or
  async?

Already covered and not repeated: architecture, Hermes, navigation, deep links,
lists, animations and gestures, permissions, push notifications, storage,
performance, debugging, build and release, Expo vs bare. Testing has a section
in `tooling/testing.md`.

## Facts Checked When Planning (October 2026; re-verify)

- Versions: React Native 0.88 (React 19.3), Expo SDK 58 on React Native 0.88.
  0.88 adds `SceneDelegate` lifecycle support on iOS; one line at most.
- `SafeAreaView` from `react-native` is deprecated since 0.81 and covers iOS
  only; the docs point to `react-native-safe-area-context` (`SafeAreaProvider`,
  `SafeAreaView` with `edges`, `useSafeAreaInsets`).
- Edge-to-edge: Android 15 enforces it for apps targeting API 35, Android 16
  removes the opt-out. React Native 0.86 fixed `KeyboardAvoidingView`,
  `measureInWindow`, `Dimensions` and `StatusBar` in that mode; enable it with
  the `edgeToEdgeEnabled=true` Gradle property. Check which Expo SDK made
  edge-to-edge the only mode.
- Keyboard (Expo guide): `KeyboardAvoidingView` with `behavior="padding"` on
  iOS; on Android the default window resize often suffices;
  `softwareKeyboardLayoutMode: "pan"` in `app.json` or `tabBarHideOnKeyboard`
  for tabs that jump above the keyboard. `react-native-keyboard-controller`
  (needs Reanimated and a development build): `KeyboardProvider`,
  `KeyboardAwareScrollView`, `KeyboardToolbar`, `useKeyboardHandler` for
  per-frame keyboard height.
- `AppState`: `active`, `background`, `inactive` (iOS only); events `change`,
  `memoryWarning` (iOS), `focus` / `blur` (Android: the notification drawer
  fires `blur` without a state change).
- Background work: `expo-background-fetch` is deprecated in favor of
  `expo-background-task` (WorkManager on Android, `BGTaskScheduler` on iOS,
  through `expo-task-manager`). `minimumInterval` is at least 15 minutes on
  Android and only a hint; the OS picks the time (battery, network, usage); a
  task stops if the user kills the app; the iOS simulator does not run it; all
  tasks share one worker.
- Offline: TanStack Query does not detect network or focus in React Native by
  itself: `onlineManager.setEventListener` with NetInfo (or `expo-network`),
  `focusManager.setFocused` from `AppState`. Paused queries and mutations resume
  when the device is back online.
- Native modules: Turbo Native Module = a TypeScript spec extending
  `TurboModule` + `TurboModuleRegistry.getEnforcing` + `codegenConfig` in
  `package.json`, then Kotlin / Java and Objective-C++ (`.mm`) code. The
  reactnative.dev guide does not mention the Expo Modules API or Nitro; take
  those from docs.expo.dev and the Nitro docs.

## Pages to Write Now

Versions on all pages: "Applies to: React Native 0.88, Expo SDK 58" (plus
library versions where they matter).

1. `react-native/core-components.md`, "Core Components", `[junior]`, position 3.
   Answers: what the basic building blocks are and how they differ from HTML.
   Includes: table `View` / `Text` / `Image` / `TextInput` / `Pressable` /
   `ScrollView` / `Modal` / `ActivityIndicator` / `Switch` → native view and
   use; `Text`: strings only inside `<Text>` (the error message), nested `Text`
   is inline, `numberOfLines`, `onPress` on text; `Image`: `require` for local
   files vs `{ uri }` that needs a size, `resizeMode`, no cache control →
   `expo-image` (caching, placeholders, formats); `TextInput`: controlled vs
   uncontrolled, `keyboardType`, `secureTextEntry`, `autoComplete` /
   `textContentType` for autofill; `Modal` vs a navigation modal; deprecated
   core components (`SafeAreaView` → link). `Pressable` vs `Touchable*` is a
   link to `animations/gestures.md`, lists are a link to `lists.md`.
2. `react-native/safe-area.md`, "Safe Area and Edge-to-Edge", `[middle]`,
   position 6. Answers: how to keep content clear of the notch, the status bar
   and the navigation bar. Includes: what insets are; `SafeAreaProvider`,
   `SafeAreaView` with `edges`, `useSafeAreaInsets` (and why the hook is
   preferred for a header or a bottom bar); edge-to-edge on Android 15+ and what
   it changes for old layouts; `StatusBar` and the navigation bar; navigators
   already apply insets to headers and tab bars (do not add them twice);
   landscape and iPad.
3. `react-native/keyboard.md`, "Keyboard Handling", `[middle]`, position 7.
   Answers: how to keep the focused input visible and control the keyboard.
   Includes: `KeyboardAvoidingView` behaviors per platform and its usual
   pitfalls (a parent without `flex: 1`, a header height in
   `keyboardVerticalOffset`); Android window mode (`adjustResize` / `pan`);
   `keyboardShouldPersistTaps` on scroll views and lists; `Keyboard.dismiss()`
   and listeners (`keyboardDidShow`, cleanup);
   `react-native-keyboard-controller` for forms and chats; moving to the next
   field (`returnKeyType`, `onSubmitEditing`, refs).
4. `react-native/native-modules.md`, "Native Modules", `[senior]`, position 12,
   after `platform-specific-code`. Answers: how to call platform code from JS
   and which way to choose. Includes: when a library is not enough; table Turbo
   Native Module / Expo Modules API / Nitro Modules (language, Codegen or not,
   where it fits); steps of a Turbo Module (spec, `codegenConfig`, native
   class); sync vs async methods and why most stay async; sending events to JS;
   Fabric Native Component for a native view (short); config plugins for native
   setup in Expo. Architecture background is a link to `rn-architecture.md`.
5. `react-native/app-lifecycle.md`, "App Lifecycle and Background Work",
   `[middle]`, position 16. Answers: what happens when the app goes to the
   background and what JS can still do there. Includes: `AppState` states and
   events (table), typical uses (refresh on return, pause media, hide content in
   the app switcher on `inactive`, lock the app after a timeout); app state vs
   screen focus (link to `navigation.md`); why timers and `fetch` stop in the
   background; options table: `expo-background-task`, silent push (link to
   `notifications.md`), background location, Android Headless JS and foreground
   services; iOS vs Android limits; testing a background task.
6. `react-native/offline.md`, "Offline Support", `[middle, senior]`, position
   18, after `storage`. Answers: how to make an app work without a network.
   Includes: NetInfo / `expo-network`, `isConnected` vs `isInternetReachable`;
   levels: cached reads → queued writes → offline-first with a local database;
   TanStack Query in React Native (`onlineManager`, `focusManager`, persisted
   cache, paused mutations); optimistic updates; sync engines on SQLite (one
   line each, no comparison); conflicts (last write wins, server wins, merge)
   and idempotent requests; showing offline state to the user. Storage choice is
   a link to `storage.md`.

New order: overview 1, architecture 2, core-components 3, stylesheet 4, flexbox
5, safe-area 6, keyboard 7, lists 8, navigation 9, deep-linking 10,
platform-specific-code 11, native-modules 12, Animations 13, permissions 14,
notifications 15, app-lifecycle 16, storage 17, offline 18, performance 19,
debugging 20, Build and Release 21. Renumber the existing pages and the
`_category_.json` of `animations` (9 → 13) and `release` (15 → 21).

## Changes to Existing Pages

- `overview.md`: the primitives row of "React vs React Native" links to
  `core-components.md`.
- `stylesheet.md`, "Screen Size": one line on insets with a link to
  `safe-area.md`.
- `rn-architecture.md`, "Native Libraries and Linking": keep autolinking and the
  interop layer; the Turbo / Fabric / Expo Modules lines shrink to a link to
  `native-modules.md`.
- `storage.md`, "Relational and Offline Data": the sync-engine line becomes a
  link to `offline.md`; See Also → `offline.md`.
- `navigation.md`, "Mount vs Focus": one line that screen focus is not app
  focus, link to `app-lifecycle.md`; See Also → `safe-area.md`.
- `notifications.md`: the background handler row and the follow-ups about
  background delivery link to `app-lifecycle.md`.
- `permissions.md`: background location links to `app-lifecycle.md`.
- `lists.md`: `keyboardShouldPersistTaps` is a link to `keyboard.md` if it comes
  up; See Also → `keyboard.md`.
- `performance.md`, "Memory Leaks": `AppState` and `Keyboard` listeners link to
  the new pages.
- `animations/gestures.md`: See Also → `core-components.md`.
- `react/state-management/tanstack-query.md`: one follow-up "Why does refetch on
  focus not work in React Native?" with a link to `offline.md`.

## Later

Candidates for the next React Native batch, by priority:

1. `accessibility.md`: `accessibilityLabel` / `accessibilityRole` /
   `accessibilityState`, VoiceOver and TalkBack, font scaling
   (`allowFontScaling`, `maxFontSizeMultiplier`), touch target size. Mirror
   `web-platform/accessibility` for the shared principles.
2. `security.md`: what an attacker can read from the bundle, SSL pinning,
   jailbreak and root detection, OWASP MASVS; secrets and tokens stay links to
   `release/env.md` and `storage.md`.
3. `testing.md` in React Native: mocking native modules, `jest-expo`, React
   Native Testing Library queries, Maestro vs Detox. Only if
   `tooling/testing.md` gets too long for it; otherwise extend the section
   there.
4. `localization.md`: `expo-localization`, `Intl` in Hermes, RTL and
   `I18nManager`. Waits for i18n on the web side (see ROADMAP, "На будущее").
5. Upgrading React Native and Expo SDK (Upgrade Helper,
   `npx expo install --fix`), brownfield (React Native inside an existing native
   app), monorepos: follow-ups in `overview.md` first, pages only if questions
   pile up.

## Questions for the User

1. Safe area and keyboard: two pages (`safe-area`, `keyboard`) or one? I
   recommend two: both are frequent questions with different APIs, and one page
   would break "one topic per page".
2. `AppState` and background work: one page `app-lifecycle` or two? I recommend
   one: `AppState` alone is a table and a hook, and the interview question is
   usually "what happens in the background" as a whole.
3. The sidebar grows to 21 items. Keep it flat or add subgroups (for example
   "UI", "Device and OS", "Data")? I recommend keeping it flat in this batch and
   deciding together with the "Later" pages.
4. `native-modules` as a `[senior]` page with a short Fabric component section,
   or modules only? I recommend including the short section: "how do you wrap a
   native view" is the usual next question.
5. Which "Later" pages go into the next batch? I recommend accessibility and
   security first.
