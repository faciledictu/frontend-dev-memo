---
sidebar_position: 1
description: One line for section cards and search results
tags: [middle]
---

# Term or Question as It Is Asked in an Interview

The model answer: 2–4 sentences or a short list that can be read at a glance and
said out loud. **Key terms** are in bold. Everything between the title and the
first `##` heading is the short answer.

Applies to: React 19.

## Details

What stands behind the short answer: how it works, edge cases, comparison
tables. Lists instead of paragraphs. One topic per page — if a second topic
appears, it is a separate page and a link.

## Example

```javascript
// One minimal example that has actually been run.
// The language of the code block matches its content.
```

Marking lines in code blocks:

Use these tools wherever they apply:

- `// error-next-line` or `// error-start` … `// error-end` — a red line: code
  that throws, does not compile or is the wrong way, even if it compiles. Keep
  the error message, copied from the compiler or the console, in a comment next
  to it.
- `// correct-next-line` or `// correct-start` … `// correct-end` — a green
  line: the right way, shown next to the wrong one.
- `// highlight-next-line`, `// highlight-start` … `// highlight-end` or
  `{1,3-4}` after the language — the key line of an example: the line the
  example is about.
- `title="path/to/file.ts"` after the language — for a block that is a whole
  file or a config (`tsconfig.json`, `app/page.tsx`).
- The comment style follows the language: `{/* error-next-line */}` inside JSX,
  `/* … */` in CSS, `#` in bash. Magic comments are removed from the output.
- A wrong line is not commented out: it is marked and left as code, even if it
  would throw and stop the rest of the example when run.

```typescript
let score = 100;
// error-next-line
score = 'high'; // Error: Type 'string' is not assignable to type 'number'.
```

## Follow-up Questions

- What an interviewer asks next to go deeper.
- Each question either has a one-line answer here or links to its own page.

## Common Mistakes

- Typical wrong or incomplete answers and why they are wrong.

## See Also

- [Related page](./related-page.md)
