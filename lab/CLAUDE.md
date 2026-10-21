@AGENTS.md

## Memo Lab

The app checks claims of the cheat sheet's React Native pages on real devices.
How to build it, run it and add a case: [README.md](README.md).

- A case is an entry in `src/cases.ts` (setup, steps, what the page claims, what
  to write down) and a test screen in `src/tests/`, registered in
  `src/tests/index.ts`.
- `expected` quotes or paraphrases the page; do not invent claims the page does
  not make.
- Run `pnpm typecheck` and, from the repository root,
  `pnpm prettier --write lab` before committing.
