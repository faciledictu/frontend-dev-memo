---
sidebar_position: 20
description: Creating regular expressions, flags, methods and basic syntax
tags: [junior, middle]
---

# Regular Expressions

A regular expression is a **pattern for searching and replacing text**. In
JavaScript it is a `RegExp` object, created with a literal (`/abc/i`) or with
the constructor when the pattern is built dynamically. It is used through
`regex.test(str)` and the string methods `match`, `matchAll`, `replace` and
`split`.

## Details

### Creating

```javascript
const word = 'abc';
const literal = /abc/i; // 'abc' pattern, case-insensitive
const dynamic = new RegExp(word, 'i'); // the pattern comes from a variable
```

In the constructor the pattern is a string, so backslashes are doubled:
`new RegExp('\\d+')`.

### Flags

| Flag | Meaning                                                                  |
| ---- | ------------------------------------------------------------------------ |
| `g`  | all matches, not only the first; required by `matchAll` and `replaceAll` |
| `i`  | case-insensitive                                                         |
| `m`  | `^` and `$` match at line breaks, not only at the string ends            |
| `s`  | `.` also matches a newline                                               |
| `u`  | full Unicode: `\u{1F600}`, `\p{Letter}`                                  |
| `v`  | like `u`, plus set operations in character classes (ES2024)              |
| `y`  | sticky: matches only at `lastIndex`                                      |

### Methods

| Method                     | Returns                                                   |
| -------------------------- | --------------------------------------------------------- |
| `regex.test(str)`          | `true` / `false`                                          |
| `regex.exec(str)`          | match array (`[0]`, groups, `index`, `groups`) or `null`  |
| `str.match(regex)`         | the first match array, or all matches as strings with `g` |
| `str.matchAll(regex)`      | an iterator of match arrays with groups; needs `g`        |
| `str.replace(regex, repl)` | a new string; `$1`, `$<name>` or a function in `repl`     |
| `str.replaceAll(regex, r)` | the same for all matches; needs `g`                       |
| `str.split(regex)`         | an array of parts                                         |
| `str.search(regex)`        | the index of the first match or `-1`                      |

```javascript
const regex = /(\d+)-(\d+)/;
console.log(regex.exec('id 10-20')); // [ '10-20', '10', '20', index: 3, input: 'id 10-20', groups: undefined ]
console.log(/x/.exec('abc')); // null
```

With the `g` or `y` flag a `RegExp` object is **stateful**: `test` and `exec`
advance `lastIndex`, so the same object gives different results on repeated
calls. Prefer `match` / `matchAll` / `replaceAll`, or reset `lastIndex = 0`.

### Syntax

| Group       | Syntax                     | Meaning                                                |
| ----------- | -------------------------- | ------------------------------------------------------ |
| Classes     | `[abc]`, `[a-z]`, `[^abc]` | one of the characters, a range, none of them           |
|             | `.`                        | any character except a newline                         |
|             | `\d`, `\w`, `\s`           | a digit, a word character (`[A-Za-z0-9_]`), whitespace |
|             | `\D`, `\W`, `\S`           | the opposite of the lowercase ones                     |
| Anchors     | `^`, `$`                   | the start and the end of the string                    |
|             | `\b`                       | a word boundary                                        |
| Quantifiers | `*`, `+`, `?`              | 0 or more, 1 or more, 0 or 1 times                     |
|             | `{n}`, `{n,}`, `{n,m}`     | exactly n, n or more, from n to m times                |
|             | `*?`, `+?`                 | lazy: as few as possible                               |
| Groups      | `( )`                      | a capturing group: `$1`, `match[1]`                    |
|             | `(?:…)`                    | a non-capturing group                                  |
|             | `(?<name>…)`               | a named group: `$<name>`, `match.groups.name`          |
|             | `a\|b`                     | alternation: `a` or `b`                                |

## Example

```javascript
const date = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;
const { groups } = '2026-10-17'.match(date);
console.log(groups.year, groups.month); // 2026 10

// highlight-next-line
console.log('2026-10-17'.replace(date, '$<day>.$<month>.$<year>')); // 17.10.2026
console.log([...'a1b22c333'.matchAll(/\d+/g)].map((m) => m[0])); // ['1', '22', '333']

console.log('<b>x</b><b>y</b>'.match(/<b>.+<\/b>/)[0]); // '<b>x</b><b>y</b>': greedy
console.log('<b>x</b><b>y</b>'.match(/<b>.+?<\/b>/)[0]); // '<b>x</b>': lazy
```

## Follow-up Questions

- What is the difference between greedy and lazy quantifiers? `+` and `*` take
  as much as possible, `+?` and `*?` as little as possible.
- When do you need the constructor instead of a literal? When the pattern comes
  from a variable. Escape user input first (`RegExp.escape()`, ES2025, Node.js
  24+), or its characters become part of the pattern.
- Why can a regular expression freeze the page? Nested quantifiers like `(a+)+$`
  backtrack exponentially on input that does not match (catastrophic
  backtracking, ReDoS). Avoid them on user input and limit the input length.

## Common Mistakes

- Reusing one `/…/g` object with `test()` in a loop or a validator: `lastIndex`
  is kept between calls, so every second call fails.
- Single backslashes in the constructor: `new RegExp('\d+')` is the pattern
  `d+`.
- Using `match` with `g` and expecting groups: with `g` it returns only the
  matched strings. Use `matchAll`.
