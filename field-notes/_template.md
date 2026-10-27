---
title: The Claim in One Short Sentence
description: One line for the list of notes and search results
tags: [react-native, accessibility, android]
---

What the docs or a guide say and what actually happens, in one to three
sentences. Everything above the truncate marker is shown in the list of notes.

<!-- truncate -->

The file name gives the date of the check:
`2026-10-27-view-drops-aria-modal.md`. Tags come from [tags.yml](tags.yml).

|          |                                                           |
| -------- | --------------------------------------------------------- |
| Versions | React Native 0.88, Expo SDK 58                            |
| Devices  | iOS 27 on an iPhone; Android 16 on a Samsung phone        |
| Upstream | [facebook/react-native#00000](https://github.com/) — open |

## How It Was Checked

- The Memo Lab case or a minimal reproducer, with the code that matters.
- How the result was read: VoiceOver or TalkBack, AXe, `uiautomator dump`.

```tsx
// The smallest code that shows the behavior.
```

## Result

- What happened on each platform, and what works instead.
- What was not checked: other platforms, versions, the old architecture.

## Upstream

- The issue or PR and its status on the date of the post.
- A fix version is named only if it was checked: the release notes or the
  release tag contain the commit. Otherwise "merged into `main`, not released".

## Updates

- 2026-12-01: fixed in React Native 0.90, checked on iOS 27 and Android 16.

A post is not rewritten when the behavior changes: a new check goes here as a
dated line, or a new post when the result differs a lot.
