export const SITE = 'https://frontend-dev-memo.vercel.app';

export type Case = {
  id: string;
  title: string;
  /** Path of the page on the site that makes the claims */
  page: string;
  setup: string[];
  steps: string[];
  /** What the page claims; the test confirms or refutes it */
  expected: string[];
  /** What to write in the note */
  record: string[];
};

export const cases: Case[] = [
  {
    id: 'keyboard-avoiding-view',
    title: 'KeyboardAvoidingView',
    page: '/react-native/keyboard',
    setup: [
      'Android 15 or newer: every Expo SDK 58 app is edge-to-edge.',
      'Start from a fresh launch: if the keyboard-controller test ran in this launch, close the app and open it again (the library changes how Android applies insets).',
    ],
    steps: [
      'Open the test. The switches at the top set `behavior` (none, padding, height) and `keyboardVerticalOffset` (0 or the header height).',
      'For each combination, tap the input at the bottom and type a few letters.',
      'Watch the input and the Send button: above the keyboard, covered, or with a gap. The line under the switches shows the window height and the keyboard height.',
    ],
    expected: [
      'iOS: with no behavior the input is covered; `padding` with the header offset keeps it right above the keyboard; without the offset it stays partly covered.',
      "Android: the page follows Expo's guide (no `behavior`) and says that on Android 15+ the keyboard comes as an inset and may cover the input; then set a behavior.",
      'Android: whether the window height shrinks when the keyboard opens (adjustResize) or stays the same (inset only).',
    ],
    record: [
      'Android: which combination keeps the input right above the keyboard, and whether "none" works.',
      'Whether the window height changes when the keyboard opens.',
      'iOS: whether padding + header offset is the only correct combination.',
    ],
  },
  {
    id: 'keyboard-controller',
    title: 'react-native-keyboard-controller',
    page: '/react-native/keyboard',
    setup: [
      'Run after the KeyboardAvoidingView test: this one mounts KeyboardProvider.',
    ],
    steps: [
      'Open the test. The switch at the top picks the chat composer (library KeyboardAvoidingView, padding on both platforms) or a long form (KeyboardAwareScrollView).',
      'Chat: tap the input and type. Form: tap fields near the bottom one after another.',
    ],
    expected: [
      'The same behavior on iOS and Android: the input follows the keyboard frame by frame, with no jump at the end of the animation.',
      'The form scrolls the focused field above the keyboard with a gap (bottomOffset 24).',
    ],
    record: ['Any difference between the platforms, jumps or gaps.'],
  },
  {
    id: 'modal',
    title: 'Modals and overlays',
    page: '/react-native/accessibility',
    setup: ['Turn on VoiceOver (iOS) or TalkBack (Android).'],
    steps: [
      'Open the test. Each button opens a dialog with a Close button over a screen with three "Background item" buttons.',
      'In each dialog, swipe right through all elements, then try touching where a background item is (touch exploration).',
      'Variants: Modal; Modal with transparent; custom overlay with no hiding; custom overlay with aria-modal; custom overlay with the background aria-hidden.',
    ],
    expected: [
      'Modal: the background is not reachable on either platform.',
      'Modal transparent: the page says "check with VoiceOver", no claim.',
      'Custom overlay with no hiding: the background is reachable on both platforms.',
      'Custom overlay with aria-modal: iOS ignores the siblings of the overlay; Android ignores aria-modal, the background stays reachable.',
      'Custom overlay with the background aria-hidden: the background is hidden on both platforms.',
    ],
    record: [
      'For each variant and platform: can you reach a background item by swiping, and by touch?',
      'Where focus lands when the dialog opens.',
    ],
  },
  {
    id: 'grouping',
    title: 'Grouping with accessible',
    page: '/react-native/accessibility',
    setup: ['Turn on VoiceOver or TalkBack.'],
    steps: [
      'Open the test and swipe through it from the top.',
      'Card 1 is a View with accessible containing text and two buttons. Card 2 is the same without accessible. Card 3 is a Pressable with an image, a title and a price.',
    ],
    expected: [
      'Card 1: read as one element with all its text; iOS cannot focus the buttons inside; TalkBack may still reach them.',
      'Card 2: every text and button is a separate stop.',
      'Card 3: read once, the labels of all Text joined with spaces; the image without alt is skipped.',
      'The plain Text with onPress at the bottom is announced as a link.',
    ],
    record: [
      'Card 1 on Android: can you reach the buttons by swiping, by touch, or not at all?',
      'What exactly is read for cards 1 and 3.',
    ],
  },
  {
    id: 'navigation-focus',
    title: 'Focus after navigation',
    page: '/react-native/accessibility',
    setup: [
      'Turn on VoiceOver or TalkBack.',
      'React Navigation 7, native stack.',
    ],
    steps: [
      'Open the test, focus "Open details (no focus management)" and activate it.',
      'Note which element the screen reader focuses on the new screen, then go back and note where focus returns.',
      'Repeat with "Open details (focus the title)", which calls sendAccessibilityEvent(ref, "focus") in useFocusEffect.',
    ],
    expected: [
      'No focus management: the page makes no claim; focus may stay where it was or land at the top.',
      'Focus the title: focus moves to the heading on both platforms.',
    ],
    record: [
      'For both variants and platforms: the element focused after opening and after going back.',
    ],
  },
  {
    id: 'announcements',
    title: 'Announcements and live regions',
    page: '/react-native/accessibility',
    setup: ['Turn on VoiceOver or TalkBack.'],
    steps: [
      'Open the test. Activate each button and listen.',
      'Announce: announceForAccessibility. Queued: announceForAccessibilityWithOptions with queue. Live region: changes a counter that has aria-live="polite".',
    ],
    expected: [
      'iOS: Announce speaks; Queued waits for the current speech; Live region says nothing (live regions do not work on iOS).',
      'Android: Live region speaks the new value; Announce still works, but its API is deprecated since Android 16.',
    ],
    record: [
      'For each button and platform: spoken, not spoken, or interrupted.',
      'The Android version.',
    ],
  },
  {
    id: 'form-fields',
    title: 'Form fields',
    page: '/react-native/accessibility',
    setup: ['Turn on VoiceOver or TalkBack.'],
    steps: [
      'Open the test and swipe through the fields.',
      'Field 1 has aria-label. Field 2 has only a placeholder. Field 3 uses aria-labelledby pointing to the visible "Email" text.',
      'Leave field 1 empty and activate Submit: the error is shown and announced.',
    ],
    expected: [
      'Field 1: the label is read.',
      'Field 2: the placeholder is read while the field is empty and is gone once you type.',
      'Field 3: Android reads "Email"; iOS ignores aria-labelledby.',
      'Submit: the error is announced on both platforms.',
    ],
    record: [
      'What is read for each field, empty and filled.',
      'Whether the error was heard.',
    ],
  },
];

export function findCase(id: string): Case {
  const found = cases.find((item) => item.id === id);
  if (!found) throw new Error(`Unknown case: ${id}`);
  return found;
}
