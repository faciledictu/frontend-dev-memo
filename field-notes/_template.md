---
title: The Claim in One Short Sentence
slug: short-stable-slug
description: One line for the list of notes and search results
tags: [react-native, accessibility, android]
---

What the docs or a guide say and what actually happens, in one to three
sentences. Everything above the truncate marker is shown in the list of notes.

{/* truncate */}

The file name gives the date of the post: `2026-10-27-view-aria-modal.md`; the
`slug` keeps the URL free of the date. Tags come from [tags.yml](tags.yml).

- **Checked:** 21 October 2026
- **Versions:** React Native 0.88.0, Expo SDK 58
- **Devices:** iPhone, iOS 27; Samsung phone, Android 16; or the Simulator and
  the emulator
- **Upstream:**
  [react/react-native#00000](https://github.com/react/react-native/pull/00000):
  open

## How It Was Checked

- The Memo Lab case or a minimal reproducer, with the code that matters.
- How the result was read: VoiceOver or TalkBack, Accessibility Inspector,
  `uiautomator dump`. A Simulator or emulator check is named as such.
- What was read from the code and not run is marked "read from the code".

```tsx
// The smallest code that shows the behavior.
```

## Result

- What happened on each platform, and what works instead.
- The cause, if it is known.
- What was not checked: other platforms, versions.

## Upstream

- The issue or PR and its status on the date of the post.
- A fix version is named only if it was checked: the release notes or the
  release tag contain the commit. Otherwise "merged into `main`, not in a
  release on <date>".

## Updates

Added only when there is one. A post is not rewritten when the behavior changes:
a new check goes here as a dated line ("2026-12-01: fixed in React Native 0.90,
checked on iOS 27 and Android 16"), or a new post when the result differs a lot.
