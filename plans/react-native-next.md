# React Native: Next Steps

Status: approved by the user. Starting point: `main` at a16c016, after batch 10
and the Memo Lab device checks (PR #56–#61).

Three tracks: new interview pages, device checks of existing pages, and findings
where React Native behaves differently from its docs. The tracks run in parallel
and stay apart: interview pages stay short, findings go elsewhere.

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
2. **The three tracks run in parallel.** Sidebar grouping stays a separate task.
3. **Formatting.** A compact "checked on a device" mark (a small MDX component
   in `src/components/`: platform, OS version, date, link to the post) replaces
   note blocks. Docusaurus `Tabs` where a page compares iOS and Android at
   length; tables stay the default.
4. **No live code.** No Expo Snack embeds or other runnable examples: the site
   reworks the official docs into answers, it does not repeat them; readers go
   to the official site for the docs.

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

Each check is a Memo Lab case; results go into the page, a finding into Field
Notes.

## Track C: Docs Against Code

A systematic pass instead of chance finds: for each core component, the props
its types accept against the props it passes to the native side. Passes over
`aria-*` on `main` (October 2026); only the rows marked "device" were checked on
a device (in Memo Lab or the
[reproducer](https://github.com/faciledictu/rn-aria-props-repro)), the rest are
read from the code.

How `aria-*` reaches the native side: each JS component converts the props to
`accessibility*` itself (`View.js`, `Text.js`, `TextInput.js`, `Image.*.js`).
The native view configs list raw `aria-*`, but neither the Fabric C++ props
parser nor the Android view managers read them, so a prop the JS component does
not convert is dropped silently.

| Component                                                              | Typed but not mapped                                                                                      | Status                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `View`                                                                 | `aria-modal`                                                                                              | Device (iOS); react/react-native#59328 open, approved                                                                                                                                                                                                |
| `View`                                                                 | `aria-live` works, but a `View` with only a live region is flattened                                      | Device (Android); issue react/react-native#59329, fix react/react-native#59335 open                                                                                                                                                                  |
| `Text`                                                                 | `aria-live`                                                                                               | Device (Android); fixed by react/react-native#59330, merged on 22 October 2026, after 0.88                                                                                                                                                           |
| `Text`                                                                 | `aria-labelledby`, `aria-modal`, `aria-value*`                                                            | Code                                                                                                                                                                                                                                                 |
| `TextInput`                                                            | `aria-live`, `aria-modal`, `aria-value*`                                                                  | Code                                                                                                                                                                                                                                                 |
| `Image`                                                                | `aria-live`, `aria-modal`, `aria-value*`                                                                  | Code                                                                                                                                                                                                                                                 |
| `Switch`, `ScrollView`, `ActivityIndicator`, `RefreshControl`, `Modal` | All `aria-*`, `id` and `tabIndex`: none are converted; `role` works, the native side reads it             | Device (Android): `aria-label` on `Switch`, `ActivityIndicator`, `ScrollView`; iOS: `Switch` only, `ActivityIndicator` ignores even `accessibilityLabel`, `ScrollView` is not an element; fix react/react-native#59379; `aria-hidden` also in #59072 |
| `TouchableOpacity`, `TouchableNativeFeedback`                          | `role`, `aria-labelledby`                                                                                 | Device (Android, iOS): `role` on `TouchableOpacity`; fix react/react-native#59378; `aria-labelledby`: #58173                                                                                                                                         |
| `TouchableHighlight`                                                   | `role`, `aria-labelledby`, `aria-busy`, `aria-checked`, `aria-disabled`, `aria-expanded`, `aria-selected` | Device (Android, iOS): `aria-checked`; fix react/react-native#59378                                                                                                                                                                                  |
| `TouchableWithoutFeedback`                                             | `role`, `aria-label`, `aria-labelledby`                                                                   | Device (Android, iOS): `aria-label`; fix react/react-native#59378                                                                                                                                                                                    |

Not every gap is a bug: some props make no sense on some components
(`aria-labelledby` on `Text`, `aria-modal` on `Image`). The `Switch` row is the
opposite: `aria-label` on a switch is the common case, and the `Switch` docs
list all `View` props.

`aria-labelledby` itself:

- On the web it takes a space-separated list of ids; `View.js` splits it by
  commas, `TextInput` and `Image` pass the string as is. A web-style
  `aria-labelledby="title hint"` is one id that matches nothing.
- On Android only the first id is used (`BaseViewManager`); iOS has no
  `accessibilityLabelledBy` at all.

Already in progress upstream, by other authors (open PRs, October 2026):
react/react-native#59072 maps `aria-hidden` on `ScrollView` and
`ActivityIndicator` (not on `Switch` and `RefreshControl`, on purpose);
react/react-native#58173 passes `accessibilityLabelledBy` and `aria-labelledby`
through `Button` and `Touchable*`. Nobody covers `aria-label` and the state
props on `Switch`, `ScrollView` and `ActivityIndicator`. The Memo Lab case
`aria-pass-through` checks these rows; a fix waits for its results and builds on
#59072 instead of repeating it.

Checked: every component exported from `react-native` except the deprecated ones
(`DrawerLayoutAndroid`, `ProgressBarAndroid`), `SafeAreaView`,
`InputAccessoryView` and `VirtualView`. `Pressable`, `Button`,
`KeyboardAvoidingView`, `ImageBackground` and the lists render a `View`,
`ScrollView` or `Image` and inherit their gaps. `Touchable*` copy a fixed list
of props to their `View`, and `role` is not on any of the lists. Next areas:
keyboard events. `Switch` on iOS is covered by react/react-native#59333 (not
ours), which maps `disabled` only.

`ActivityIndicator` on iOS ignores `accessibilityLabel` too (device, iOS 27):
the label goes to the host view, which is not an accessibility element, and
VoiceOver reads the inner `UIActivityIndicatorView` ("In progress"). With
`accessible` the host is read with the label but loses the indicator's value.
`RCTSwitchComponentView` solves the same case by returning the inner view from
`accessibilityElement`; a separate issue and a native PR after #59377.

Upstream so far: react/react-native#59328, #59329, #59330 (merged), #59335,
#59377 (the `aria-*` and `role` gaps above) with the fixes #59378 (`Touchable*`)
and #59379 (`Switch`, `ScrollView`, `ActivityIndicator`); expo/expo#52032.
