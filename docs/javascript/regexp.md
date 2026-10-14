---
sidebar_position: 20
description: Creating regular expressions, methods and basic syntax
---

# Regular Expressions

A regular expression is a **pattern for searching and replacing text**. In
JavaScript it is a `RegExp` object, created with a literal (`/abc/i`) or with
the constructor when the pattern is built dynamically. It is used through
`regex.test(str)` and the string methods `match`, `matchAll`, `replace` and
`split`.

## Creating RegExp object

There are two primary ways to create a RegExp object in JavaScript:

### Literal notation

```javascript
const regex = /abc/i; // 'abc' pattern, case-insensitive
```

### Constructor function

```javascript
const regex = new RegExp('abc', 'i'); // 'abc' pattern, case-insensitive
```

## Methods

### `test()`

Tests for a match in a string and returns `true` or `false`.

```javascript
const regex = /abc/;
console.log(regex.test('abcdef')); // true
```

### `exec()`

Executes a search for a match in a string and returns an array of results or
`null`.

```javascript
const regex = /abc/;
console.log(regex.exec('abcdef')); // ["abc"]
```

## Basic syntax[^1]

### Character Classes

`[ ]` Match any one of the specified characters.

```javascript
const regex = /[abc]/; // Matches 'a', 'b', or 'c'
const regexRange = /[a-z]/; // Matches all characters from 'a' to 'z'
```

### Metacharacters

Special characters with specific meanings.

- `.` Any character except newline.
- `\d` Any digit.
- `\w` Any word character (alphanumeric + underscore).
- `\s` Any whitespace character.
- `^` Start of the string.
- `$` End of the string.

```javascript
const regex = /\d+/; // Matches one or more digits
```

### Quantifiers: Specify the number of occurrences

- `*` 0 or more times.
- `+` 1 or more times.
- `?` 0 or 1 time.
- `{n}` Exactly n times.
- `{n,}` n or more times.
- `{n,m}` Between n and m times.

```javascript
const regex = /a{2,4}/; // Matches 'aa', 'aaa', or 'aaaa'
```

### Grouping and Alternation

- `( )` Grouping.
- `|` Alternation (OR).

```javascript
const regex = /(abc|def)/; // Matches 'abc' or 'def'
```

[^1]: https://regex101.com
