---
sidebar_position: 5
description:
  Semantic markup, script loading, block vs inline, data attributes, viewport,
  form validation
---

# HTML

HTML describes the **structure and meaning** of content, not its look. What is
usually asked:

- **Semantic markup**: elements are chosen by meaning (`<nav>`, `<main>`,
  `<button>`), not by appearance.
- **Script loading**: a plain `<script>` blocks the parser; `defer`, `async` and
  `type="module"` do not.
- **Block vs inline**, **`data-*` attributes**, the **viewport meta tag** and
  built-in **form validation**.

## Details

### Semantic Markup

Semantic elements tell the browser, screen readers and search engines what the
content is. They give landmarks and a heading outline for navigation, and native
elements come with keyboard support and focus for free.

| Element                | Meaning                                                     |
| ---------------------- | ----------------------------------------------------------- |
| `<header>`, `<footer>` | introduction and closing part of a page or a section        |
| `<nav>`                | a block of navigation links                                 |
| `<main>`               | the main content, one per page                              |
| `<article>`            | a self-contained piece: a post, a card, a comment           |
| `<section>`            | a thematic group, usually with a heading                    |
| `<aside>`              | content related only indirectly: a sidebar, a note          |
| `<h1>`–`<h6>`          | headings; levels should not be skipped                      |
| `<button>`             | an action on the page                                       |
| `<a href>`             | navigation to another URL                                   |
| `<strong>`, `<em>`     | strong importance and stress emphasis                       |
| `<b>`, `<i>`           | text set apart without extra importance (a keyword, a term) |
| `<div>`, `<span>`      | no meaning; containers for styling                          |

- `<strong>` is not "bold" and `<em>` is not "italic": that is only the default
  style. For a purely visual effect use CSS.
- `<u>` marks a non-textual annotation, such as a misspelled word. For
  underlining use CSS `text-decoration`.

### Loading Scripts

| Script                   | Blocks the parser  | Runs                                     | Order          |
| ------------------------ | ------------------ | ---------------------------------------- | -------------- |
| `<script>`               | yes                | right away, where it is in the document  | document order |
| `<script async>`         | only while it runs | as soon as it is downloaded              | not guaranteed |
| `<script defer>`         | no                 | after parsing, before `DOMContentLoaded` | document order |
| `<script type="module">` | no                 | like `defer`                             | document order |

- `async` suits independent scripts such as analytics; `defer` suits application
  code that needs the DOM or depends on other scripts.
- `defer` and `async` work only with `src`; on an inline classic script they are
  ignored.
- Modules run in strict mode with their own scope, support `import` / `export`,
  and are executed once even when included several times.
- A script added with `document.createElement('script')` behaves as `async`.

### Block vs Inline

|                    | Block                                       | Inline                              |
| ------------------ | ------------------------------------------- | ----------------------------------- |
| Position           | starts on a new line                        | flows inside a line of text         |
| Width              | all available width                         | the width of its content            |
| `width` / `height` | applied                                     | ignored                             |
| Vertical margin    | applied                                     | ignored                             |
| Default for        | `<div>`, `<p>`, `<h1>`, `<ul>`, `<section>` | `<span>`, `<a>`, `<strong>`, `<em>` |

- `inline-block` flows in a line but respects `width`, `height` and vertical
  margins.
- This is the CSS `display` property and can be changed. What HTML itself
  defines is which elements may be nested: a `<p>` cannot contain a `<div>`, the
  parser closes the paragraph before it.

### `data-*` Attributes

- Custom attributes for the page's own data: `<li data-user-id="42">`.
- In JavaScript they are read through `dataset`, with the name in camelCase:
  `element.dataset.userId`. The value is always a string.
- In CSS they are available in selectors: `[data-state='open']`.
- Not a place for content that users must see or for sensitive data.

### Viewport Meta Tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
```

- Without it, a mobile browser lays the page out on a virtual viewport about
  980px wide and zooms out, so media queries for narrow screens do not apply.
- `width=device-width` makes the layout viewport equal to the device width;
  `initial-scale=1` sets the initial zoom to 100%.
- `user-scalable=no` and `maximum-scale=1` should not be used: they take away
  zoom from users who need it.

### Form Validation

| Attribute                           | Checks                                         |
| ----------------------------------- | ---------------------------------------------- |
| `required`                          | the field is filled in                         |
| `type="email"`, `"url"`, `"number"` | the value has this format                      |
| `min`, `max`, `step`                | range of a number or a date                    |
| `minlength`, `maxlength`            | length of the text                             |
| `pattern`                           | the whole value matches the regular expression |

- Validation runs on submit. If a field is invalid, the form is not sent, the
  `submit` event does not fire and the browser shows a message.
- `novalidate` on the form or `formnovalidate` on a button turns it off.
- CSS: `:valid`, `:invalid`, and `:user-invalid`, which applies only after the
  user has interacted with the field.
- JavaScript (Constraint Validation API): `checkValidity()`, `reportValidity()`,
  `setCustomValidity(message)` and the `validity` object.
- Validation in the browser is for convenience only. The server must validate
  the data again.

## Example

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Sign Up</title>
    <script src="app.js" defer></script>
  </head>
  <body>
    <header>
      <nav><a href="/">Home</a></nav>
    </header>
    <main>
      <h1>Sign Up</h1>
      <form action="/signup" method="post" data-form-id="signup">
        <label for="email">Email</label>
        <input id="email" name="email" type="email" required />

        <label for="password">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minlength="8"
        />

        <button>Create account</button>
      </form>
    </main>
  </body>
</html>
```

## Follow-up Questions

- Why is `<!doctype html>` needed? Without it the browser renders the page in
  quirks mode, which emulates the behavior of old browsers.
- What is the default `type` of a `<button>` inside a form? `submit`. A button
  that must not send the form needs `type="button"`.
- Why does an input need a `<label>`? It gives the field a name for screen
  readers, and a click on the label focuses the field.
- What is `alt` for? It is the text alternative of an image. A decorative image
  gets an empty `alt=""`, so that screen readers skip it.

## Common Mistakes

- A `<div>` with a click handler instead of a `<button>`: it cannot be focused
  or activated from the keyboard, and screen readers do not announce it as a
  button.
- "`<strong>` makes text bold." It marks importance; bold is the default style.
- `defer` on an inline script: it has no effect.
- Choosing a heading level by font size instead of the document structure.

## See Also

- [How the Browser Works](./browser-workflow.md)
- [DOM Events](./events.md)
