# React Native: Next Steps

Status: proposal, not approved yet. Starting point: `main` at a16c016, after
batch 10 and the Memo Lab device checks (PR #56–#61).

Three tracks: new interview pages, device checks of existing pages, and findings
where React Native behaves differently from its docs. The tracks are kept apart:
interview pages stay short, findings go elsewhere (decision 1).

## Decisions for the User

1. **Where findings live.** Findings such as "`aria-modal` on `View` does
   nothing" are not interview answers: they are dated, tied to a version and
   have an upstream issue or PR whose status changes. Proposal: a separate "Lab
   notes" section on the site, made with the Docusaurus blog plugin (now off),
   one note per finding: date, versions, the claim, how it was checked, the
   result, the upstream link. An interview page keeps one line ("`View` drops
   `aria-modal`, use `accessibilityViewIsModal`") and a link to the note. The
   two "Differs from the official docs" notes on `keyboard` and `accessibility`
   move there.
2. **Order.** Proposal: sidebar grouping first (24 pages already), then batch
   11, with Memo Lab checks and findings between batches, as time allows.
3. **Page formatting.** If a page needs more than admonitions, `<details>` and
   tables (for example iOS / Android tabs, or a compact "checked on a device"
   mark instead of a note block), list the cases first; then decide between
   Docusaurus `Tabs` and a small MDX component in `src/components/`.

## Verification Rule

Claims about platform behavior (accessibility, keyboard, focus, lifecycle) are
checked in [Memo Lab](../lab/README.md) before a page is merged, or worded as
unverified. Cheaper ways than a screen reader by gesture:

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

Each check is a Memo Lab case; results go into the page, a finding into Lab
notes.

## Track C: Docs Against Code

A systematic pass instead of chance finds: for each core component, the props
its types accept against the props it passes to the native side. A first pass
over `aria-*` on `main` (October 2026), not yet checked on a device:

| Component   | Typed but not mapped                                                                   |
| ----------- | -------------------------------------------------------------------------------------- |
| `View`      | `aria-modal` (react/react-native#59328)                                                |
| `Text`      | `aria-live` (react/react-native#59330), `aria-labelledby`, `aria-modal`, `aria-value*` |
| `TextInput` | `aria-live`, `aria-modal`, `aria-value*`                                               |
| `Image`     | `aria-live`, `aria-modal`, `aria-value*`                                               |

Not every gap is a bug: some props make no sense on some components. The first
candidate is `aria-labelledby` on `Text`. Next areas: `Switch` (see
react/react-native#59333), `Modal`, `ScrollView`, keyboard events.

Upstream so far: react/react-native#59328, #59329, #59330 and the C++ fix for
#59329; expo/expo#52032.
