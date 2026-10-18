# Batch 6: React Native and Next.js

Status: approved by the user. React Native is the current focus of the cheat
sheet; the section will be extended further later. Eight new pages: five in
`docs/react-native/`, three in `docs/nextjs/`.

## Decisions

- No separate Expo page: `react-native/overview.md` and `release/*` cover it.
  Add two follow-ups to `overview.md` instead: "What is a config plugin?" and
  "When do you need a new native build instead of an OTA update?" (link to
  `release/ota.md`).
- RSC vs SSR is already covered in `nextjs/app-router/server-components.mdx`;
  Next.js navigation and performance are covered too. Not in this batch.
- Proxy gets its own page `nextjs/proxy.md` and becomes the single place for
  Proxy. `nextjs/authentication.md` keeps only the auth angle (optimistic check,
  the CVE-2025-29927 line, "Why is Proxy not enough?") plus a link; the login +
  `proxy.ts` example stays there. This reverses the earlier decision to keep
  Proxy only in `authentication`.
- A Next.js environment variables page is included.
- Deep linking is its own page, not a section of navigation.
- React Native pages stay flat (no `navigation/` subgroup).
- Deferred: RN core components, keyboard and safe area, `AppState`, background
  tasks, offline (one line about offline in `storage.md` only).
- Versions: "Applies to: React Native 0.88, React Navigation 7, Expo SDK 58" on
  the RN navigation pages; "Next.js 16.4" on the Next.js pages. React Navigation
  8 is pre-release: at most one line in Details. Re-check versions before
  writing.

## Facts checked when planning (October 2026; re-verify)

- Next.js 16.4: Proxy runs on Node.js; setting `runtime` in the Proxy file
  throws. Proxy runs after `headers` and `redirects` from `next.config`, before
  `beforeFiles` rewrites and filesystem routes. Without a `matcher` it runs on
  every request, static files included.
- Metadata: `generateMetadata` streams for dynamic pages; bots that do not run
  JavaScript still get it in `<head>`. With Cache Components, reading request
  data in `generateMetadata` while the rest of the page is fully prerendered is
  a build error; fix with `'use cache'` or an explicit dynamic marker.
- React Native DevTools: Console, Sources, Network and Performance panels (since
  0.83), Memory, Components, Profiler.
- Startup advice: Hermes bytecode, `React.lazy` for screens, inline requires
  (off by default in Expo).
- React Navigation 7 is current, static API recommended; 8 is pre-release.
- Expo Router (SDK 58): automatic deep link for every screen, typed routes,
  `Stack.Protected guard={…}` (`redirectTo` needs SDK 58; client-side check
  only). Since SDK 56 it uses its own fork of React Navigation: import from
  `expo-router/react-navigation`, not `@react-navigation/*`.
- Storage: react-native-mmkv 4 is a Nitro module (`createMMKV()`); Expo lists
  SecureStore, SQLite, FileSystem and AsyncStorage.

## React Native pages

1. `react-native/navigation.md`, "Navigation: React Navigation and Expo Router",
   `[junior, middle]`, position 6. Answers: how navigation works and React
   Navigation or Expo Router. Includes: comparison table (code config vs
   file-based, static vs dynamic API); native stack vs JS stack, tabs (native
   tabs), drawer; screens in a stack stay mounted: focus vs mount,
   `useFocusEffect`; `navigate` / `push` / `popTo`; typed params; auth flow:
   conditional screens vs `Stack.Protected`; Expo Router files (`_layout`,
   `(group)`, `[id]`); one line on the SDK 56 fork.
2. `react-native/deep-linking.md`, "Deep Linking", `[middle]`, position 7.
   Answers: how a URL opens a specific screen. Includes: custom scheme vs
   Universal Links / App Links (`apple-app-site-association`, `assetlinks.json`,
   why a scheme can be hijacked); `linking` config vs automatic links in Expo
   Router; cold start vs running app (`getInitialURL` vs the `url` listener);
   opening a screen from a notification tap; validating params from a link.
3. `react-native/storage.md`, "Storing Data on the Device", `[junior, middle]`,
   position 12. Answers: AsyncStorage, MMKV, SecureStore or SQLite — where each
   kind of data goes. Includes: table (sync or async, encrypted or not, use);
   tokens in Keychain / Keystore via `expo-secure-store` or
   `react-native-keychain`; MMKV encryption is not for secrets; relational and
   offline data: expo-sqlite / op-sqlite; persisting Zustand and TanStack Query
   (links); iOS Keychain data survives an uninstall.
4. `react-native/performance.md`, "Performance in React Native",
   `[middle, senior]`, position 13. Answers: why an app lags and how to find and
   fix it. Includes: 16.67 ms frame budget for the JS and UI threads, Perf
   Monitor; measure only in release builds; causes and fixes table, mostly links
   (re-renders → React pages, lists → `lists.md`, JS-driven animation →
   Reanimated, heavy `onPress` work, `console.log`, image sizes); startup:
   Hermes bytecode, lazy screens, inline requires, fewer modules at startup;
   memory leaks. Tools are linked to the debugging page.
5. `react-native/debugging.md`, "Debugging React Native", `[junior, middle]`,
   position 14. Answers: how to debug a React Native app. Includes: React Native
   DevTools (open with `j` or the Dev Menu; panels table); what it replaced
   (Flipper, Chrome remote debugging; one line, re-check versions); LogBox;
   native logs (Xcode, `adb logcat`); production crash reporting (Sentry, source
   maps, symbolication).

New React Native order: overview 1, architecture 2, stylesheet 3, flexbox 4,
lists 5, navigation 6, deep-linking 7, platform-specific-code 8, Animations 9,
permissions 10, notifications 11, storage 12, performance 13, debugging 14,
Build and Release 15. Renumber `platform-specific-code` 6 → 8, `permissions` 8 →
10, `notifications` 9 → 11; `animations/_category_.json` 7 → 9,
`release/_category_.json` 10 → 15.

## Next.js pages

6. `nextjs/app-router/metadata.md`, "Metadata and SEO", `[middle]`, App Router
   position 9. Answers: how to set the title, meta tags and OG images, and how
   sitemap and robots work. Includes: `metadata` vs `generateMetadata` (Server
   Components only, not both in one segment); shallow merge from root to page;
   `title.template` / `default` / `absolute`; `metadataBase`; file-based
   metadata (`icon`, `opengraph-image` with `ImageResponse`, `sitemap.ts`,
   `robots.ts`); `viewport` / `generateViewport`; sharing a request with the
   page via `cache` / `fetch` memoization; streaming metadata and bots; the
   Cache Components build error; React 19 `<title>` vs the Metadata API;
   `next/head` in the Pages Router (one line).
7. `nextjs/proxy.md`, "Proxy (Middleware)", `[middle]`, position 3. Answers:
   what Proxy is, what it is for and not for. Includes: place in the execution
   order; `matcher` with `has` / `missing` and excluding static files;
   `NextResponse` `next` / `redirect` / `rewrite`, request vs response headers,
   cookies, responding directly; `waitUntil`; Node.js runtime; uses (locale and
   A/B rewrites, headers, optimistic auth check); not for data fetching or slow
   work; Server Actions are covered by the page's matcher; `middleware` →
   `proxy` rename and codemod.
8. `nextjs/environment-variables.md`, "Environment Variables",
   `[junior, middle]`. Answers: what `NEXT_PUBLIC_` variables are and when they
   are inlined. Includes: build-time inlining vs server-only variables; `.env*`
   load order; the "build once, deploy many" problem in Docker. Mirror
   `react-native/release/env.md` where it helps; Node vs Edge runtime and
   deploying outside Vercel stay out.

Next.js order: overview 1, App Router 2, proxy 3, authentication 4, optimization
5, environment-variables 6, Pages Router 7.

## Changes to existing pages

React Native:

- `overview.md`: navigation row and the "Expo Router or React Navigation?"
  follow-up → link to `navigation.md`; "Is a React Native app slower…" → also
  `performance.md`; the two Expo follow-ups above.
- `release/env.md`: the token-storage follow-up → one line plus a link to
  `storage.md`.
- `notifications.md`: "How do you open a screen on tap?" → link to
  `deep-linking.md`.
- `lists.md`, `animations/reanimated.md`, `rn-architecture.md` (Hermes): See
  Also → `performance.md`.
- `web-platform/tools/debugging.md`: See Also → `react-native/debugging.md`.
- `web-platform/network/storage.md`: See Also → `react-native/storage.md`.

Next.js:

- `app-router/overview.md`: shorten the "Where does `<title>` come from?"
  follow-up to a link to `metadata.md`.
- `authentication.md`: the `### Proxy` section shrinks to the auth angle with a
  link to `proxy.md`; position 3 → 4.
- `app-router/navigation.md` and `page-router/overview.md`: redirect tables link
  to `proxy.md` instead of `authentication.md#proxy`.
- `overview.md`: the "What is Proxy for?" follow-up links to `proxy.md`.
- `optimization.md` 4 → 5; `page-router/_category_.json` position → 7.
- `react/react-19.md` (document metadata): See Also →
  `nextjs/app-router/metadata.md`.
