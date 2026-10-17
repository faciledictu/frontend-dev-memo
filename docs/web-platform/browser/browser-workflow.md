---
sidebar_position: 1
description:
  From a URL to pixels - DNS, connection, parsing, the rendering pipeline
---

# How the Browser Works

What happens after a user enters a URL:

1. **DNS lookup**: the domain name is resolved to an IP address.
2. **Connection**: a TCP handshake, then a TLS handshake for HTTPS.
3. **Request and response**: the browser sends an HTTP request and gets HTML.
4. **Parsing**: HTML becomes the **DOM**, CSS becomes the **CSSOM**; scripts are
   executed along the way and can block the parser.
5. **Rendering**: style → **layout** → **paint** → **composite**.

## Details

### Network

- **DNS.** The browser checks its own cache, then the cache of the operating
  system, and only then asks a DNS resolver.
- **TCP and TLS.** TCP sets up a reliable connection with a three-way handshake.
  For HTTPS, a TLS handshake follows: the server presents its certificate and
  both sides agree on encryption keys. HTTP/3 uses QUIC, which combines both
  handshakes.
- **HTTP.** The request contains the method, the path, headers and cookies. The
  response contains a status code, headers and the body. See
  [HTTP](../network/http.md).
- Every other resource found in the HTML (styles, scripts, images, fonts) is a
  separate request.

### Rendering Pipeline

1. **Parse HTML → DOM.** The parser works incrementally, while the bytes are
   still arriving.
2. **Parse CSS → CSSOM.** CSS is **render-blocking**: nothing is painted until
   the styles found so far are loaded and parsed.
3. **Run scripts.** A `<script>` without attributes is **parser-blocking**: the
   parser stops until the script is downloaded and executed, and the script
   itself waits for the stylesheets above it. `defer`, `async` and
   `type="module"` scripts are downloaded without blocking the parser. See
   [HTML](../../html-css/html.md#loading-scripts).
4. **Style.** The DOM and the CSSOM are combined into the **render tree**: only
   the nodes that take part in rendering, with their computed styles.
   `display: none` elements are not in it.
5. **Layout** (reflow). The size and position of every box are calculated.
6. **Paint.** The boxes are drawn into layers: text, colors, borders, shadows.
7. **Composite.** The layers are put together on the screen, usually on the GPU
   and off the main thread.

`DOMContentLoaded` fires when the HTML is parsed and deferred scripts have run;
`load` fires when all resources, including images, are loaded.

### Reflow and Repaint

After the first render, a change reruns the pipeline from the step it affects:

| What changes                                                       | What reruns                                      |
| ------------------------------------------------------------------ | ------------------------------------------------ |
| Geometry: `width`, `margin`, `font-size`, adding or removing nodes | layout → paint → composite                       |
| Appearance: `color`, `background`, `box-shadow`                    | paint → composite                                |
| `transform`, `opacity`                                             | composite only, if the element has its own layer |

- That is why animations should use `transform` and `opacity` instead of `top` /
  `left` or `width` / `height`.
- **Layout thrashing.** The browser postpones layout until the next frame is
  rendered. Reading a layout property (`offsetWidth`, `getBoundingClientRect()`)
  after a style change forces it to run immediately. Doing it in a loop means a
  layout per iteration. Fix: read everything first, then write.

## Example

```javascript
// error-start
// Bad: reads after a write, so every iteration forces a layout
for (const item of items) {
  item.style.width = `${container.offsetWidth / 2}px`;
}
// error-end

// correct-start
// Good: one read, then only writes
const width = container.offsetWidth / 2;

for (const item of items) {
  item.style.width = `${width}px`;
}
// correct-end
```

## Follow-up Questions

- What blocks the first render? CSS in `<head>` and parser-blocking scripts.
  That is why scripts get `defer` and critical CSS is kept small. See
  [Critical Rendering Path and Loading Performance](../performance/loading-performance.md).
- What is the difference between `display: none` and `visibility: hidden`? The
  first removes the element from the render tree; the second keeps its place in
  the layout, but it is not painted.
- How does JavaScript fit into rendering? Rendering happens between tasks, so a
  long task delays the next frame. See
  [Event Loop](../../javascript/event-loop.md).

## Common Mistakes

- "The browser builds the whole DOM and then runs JavaScript." Scripts run
  during parsing and block it unless they are `defer`, `async` or modules.
- "Any style change causes a reflow." Changes of `transform` and `opacity` can
  be handled by the compositor alone.

## See Also

- [HTTP](../network/http.md)
- [HTML](../../html-css/html.md)
- [Critical Rendering Path and Loading Performance](../performance/loading-performance.md)
- [Rendering in React](../../react/rendering/reconciliation.md)
