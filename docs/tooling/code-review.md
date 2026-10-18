---
sidebar_position: 4
description:
  Why code review exists, what to look at, how to give and receive feedback
tags: [middle]
---

# Code Review

Code review is reading a teammate's change before it is merged, usually in a
pull request. Its goals: **catch bugs and design problems early**, keep the code
**consistent**, and **share knowledge** so more than one person understands
every part. Machines check formatting, lint and tests; people look at
correctness, design and readability. Good reviews are **small**, **fast** and
**specific**, and comment on the code, not the author.

## Details

### How It Works

1. The author opens a pull request: a focused change with a description of what
   and why, how it was tested, screenshots for UI.
2. CI runs checks; reviewers read the change and leave comments.
3. The author answers or fixes; reviewers approve.
4. The change is merged.

### What to Look At

| Area          | Questions                                                                   |
| ------------- | --------------------------------------------------------------------------- |
| Correctness   | Does it do what the task says? Edge cases, errors, empty and loading states |
| Design        | Is it in the right place? Too clever, duplicated, or coupled to details?    |
| Readability   | Names, size of functions and components, would a newcomer follow it?        |
| Tests         | Is the behavior covered? Do the tests check results, not implementation?    |
| Security      | User input, secrets, permissions, XSS                                       |
| Performance   | Unneeded re-renders, N+1 requests, bundle size of new dependencies          |
| Accessibility | Semantic elements, labels, keyboard access                                  |

### Giving Feedback

- Explain **why**, suggest an alternative, ask questions instead of commanding:
  "What happens if `items` is empty?"
- Mark the weight of a comment: blocking vs a **nit** (minor, optional).
- Leave style to the formatter and linter instead of arguing in comments.
- Praise good solutions too.
- Review quickly: a pull request waiting for days blocks the author.

### As the Author

- Keep pull requests small (a few hundred lines): large ones get shallow
  reviews.
- Answer every comment: fix, or explain why not.
- Move long discussions to a call, then write the outcome in the thread.

## Follow-up Questions

- What if you disagree with a reviewer? Discuss the trade-offs with arguments;
  if it is a matter of taste and not a defect, the author decides or the team
  writes down a convention.
- How big should a pull request be? Small enough to review in one sitting; split
  refactoring and feature work into separate pull requests.
- What is `CODEOWNERS`? A file that maps paths to owners; GitHub requests their
  review automatically, GitLab (Premium) adds them as required approvers, and
  branch protection can require their approval.
- How to review a change that is too big? Ask for stacked PRs (a chain of small
  PRs, each based on the previous one's branch), or review commit by commit if
  the commits are clean.

## Common Mistakes

- Treating review as a gate for finding blame rather than a shared
  responsibility for the code.
- Approving without reading because the change is large.
- Reviewing only the diff of a risky UI change without running it locally or
  opening its preview deployment.

## See Also

- [CI/CD](./ci-cd.md)
- [Best Practices](../programming/best-practices.md)
