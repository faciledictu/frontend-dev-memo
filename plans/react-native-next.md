# React Native: Next Steps

Status: approved by the user. Starting point: `main` at a16c016, after batch 10
and the Memo Lab device checks (PR #56–#61).

Two tracks: new interview pages and device checks of existing pages. Findings
where React Native behaves differently from its docs go to Field Notes, not to
interview pages.

## Decisions

Approved by the user.

1. **Findings live in a blog-like section**, made with the Docusaurus blog
   plugin (now off), not on interview pages. Findings such as "`aria-modal` on
   `View` does nothing" are dated, tied to a version and have an upstream issue
   or PR whose status changes. One post per finding: date, versions, the claim,
   how it was checked, the result, the upstream link. An interview page keeps
   one line ("`View` drops `aria-modal`, use `accessibilityViewIsModal`") and a
   link to the post. The two "Differs from the official docs" notes on
   `keyboard` and `accessibility` move there. The section is called "Field
   Notes": not every finding is a gotcha.
2. **The two tracks run in parallel.** Sidebar grouping stays a separate task.
3. **Formatting.** A compact "checked on a device" mark (a small MDX component
   in `src/components/`: platform, OS version, date, link to the post) replaces
   note blocks. Docusaurus `Tabs` where a page compares iOS and Android at
   length; tables stay the default.
4. **No live code.** No Expo Snack embeds or other runnable examples: the site
   reworks the official docs into answers, it does not repeat them; readers go
   to the official site for the docs.

## Verification Rule

Claims about platform behavior (accessibility, keyboard, focus, lifecycle) are
checked in [Memo Lab](https://github.com/faciledictu/memo-lab) before a page is
merged, or worded as unverified. Cheaper ways than a screen reader by gesture:

| What is checked                                      | iOS                                                                               | Android                                                     |
| ---------------------------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| The accessibility tree: labels, roles, traits, state | AXe on the Simulator (dumps the tree, no VoiceOver)                               | `adb shell uiautomator dump`, Accessibility Scanner         |
| Speech: announcements, live regions, focus order     | VoiceOver on a device                                                             | TalkBack; on the emulator control it with `adb`, not clicks |
| Repeated checks without tapping                      | Test screens that change by themselves (timers), as in the live region reproducer | The same                                                    |

The tree shows what the screen reader will find, not what it will say:
announcements and live regions still need VoiceOver or TalkBack.

## Track A: Batch 11, New Pages

Interview questions the section does not answer yet. Positions and the final
list are agreed before writing, as in the other batches.

1. `brownfield`: embedding React Native into an existing native app. Why and
   when; the host app owns navigation and the lifecycle; one or several React
   Native screens and instances; passing data both ways; Expo in an existing
   app; the costs (app size, startup, two release trains).
2. `testing`: Jest and React Native Testing Library (queries by role, the
   `*ByRole` limits from `accessibility`), mocking native modules, E2E with
   Maestro and Detox, what runs in CI. Now split between `tooling/testing` and
   `accessibility`.
3. `view-flattening`, or a section in `rn-architecture`: why a `View` may not
   exist in the native tree, what keeps it (`collapsable={false}`, some
   accessibility props, `nativeID`, transforms), why it matters for `measure`,
   refs to native views and live regions.
4. `i18n`: `Intl` on Hermes, `expo-localization`, RTL with `I18nManager` and the
   restart it needs, plurals and number formats.
5. `media`: `expo-image` (cache, placeholders), `expo-video`, the camera, SVG.
6. `code-sharing`: React Native Web, a monorepo with a web app, shared packages.

Later, if there is demand: app extensions (widgets, Live Activities, App Clips).

## Track B: Memo Lab Checks of Existing Pages

Claims that are cheap to check and likely to be wrong or outdated:

- `lists`: FlashList v2, `maintainVisibleContentPosition`, `getItemLayout`.
- `safe-area`: edge-to-edge insets on rotation and with the keyboard.
- `deep-linking`: cold and warm start from a link, `getInitialURL`.
- `app-lifecycle`: which `AppState` events each platform really sends.
- `animations/gestures`: a gesture inside a scroll view.

Each check is a Memo Lab case; results go into the page, a finding into Field
Notes.
