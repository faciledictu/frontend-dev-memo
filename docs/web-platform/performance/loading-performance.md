---
sidebar_position: 2
description:
  The critical rendering path, render-blocking resources, resource hints and
  fetchpriority, images, fonts, compression and caching
tags: [middle, senior]
---

# Critical Rendering Path and Loading Performance

The **critical rendering path** is the work the browser must do before the first
paint: download the HTML, build the DOM and the CSSOM, run the blocking scripts,
lay out and paint (see [How the Browser Works](../browser/browser-workflow.md)).
To make a page load faster:

- **Fewer critical resources**: inline the critical CSS, load scripts with
  `defer` or `async`, lazy-load what is below the fold.
- **Fewer bytes**: compression, modern image formats, less JavaScript.
- **Fewer round trips, started earlier**: a CDN, caching, **resource hints**
  (`preconnect`, `preload`) and **`fetchpriority`** for the main image.

## Details

### What Blocks the First Paint

| Resource                              | Blocks                            | Fix                                                                                     |
| ------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------- |
| `<link rel="stylesheet">` in `<head>` | rendering                         | inline the critical CSS, load the rest without blocking; `media` for conditional CSS    |
| `<script>` without attributes         | the parser                        | `defer`, `async` or `type="module"`. See [HTML](../../html-css/html.md#loading-scripts) |
| CSS `@import`                         | rendering, one more round trip    | `<link>` tags instead                                                                   |
| Web fonts                             | hide the text for up to about 3 s | `font-display: swap` or `optional`, preload the main font                               |

A stylesheet whose `media` does not match (`media="print"`) is still downloaded,
but with a low priority and without blocking the render.

### Resource Hints and Priorities

| Hint                                   | What it does                                                                                         |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `<link rel="preconnect" href="…">`     | opens the connection (DNS, TCP, TLS) to an origin in advance                                         |
| `<link rel="dns-prefetch" href="…">`   | only resolves DNS; cheaper, for less important origins                                               |
| `<link rel="preload" href="…" as="…">` | downloads a resource needed on this page that the browser finds late (fonts, the LCP image from CSS) |
| `<link rel="modulepreload" href="…">`  | the same for an ES module, also parsed in advance                                                    |
| `<link rel="prefetch" href="…">`       | downloads with low priority for the **next** navigation                                              |
| `fetchpriority="high"` / `"low"`       | raises or lowers the priority of an `<img>`, `<script>`, `<link>` or `fetch`                         |

- Preload only what is used on the current page soon after the load: an unused
  preload takes bandwidth from what is needed, and the console warns about it.
- A preloaded font needs `crossorigin`, even from the same origin, otherwise it
  is downloaded twice.
- **Speculation Rules** (`<script type="speculationrules">`) can prefetch or
  prerender the next page completely; supported in Chromium.

### Images

- `loading="lazy"` for images below the fold, never for the LCP image.
- `width` and `height` to reserve space (against CLS).
- AVIF or WebP; `srcset` and `sizes` so that a phone does not download the
  desktop image.

### Network and Caching

- Compression: **Brotli** or gzip for text resources (HTML, CSS, JS, SVG).
- HTTP/2 or HTTP/3 and a **CDN** close to the user.
- Files with a hash in the name: `Cache-Control: max-age=31536000, immutable`.
  HTML: `no-cache`, so that it is revalidated and points to the new files. See
  [HTTP](../network/http.md).
- **103 Early Hints**: the server sends `Link: rel=preload` headers while the
  HTML is still being generated.

### Rendering Strategy

With client-side rendering the content appears only after the JavaScript is
downloaded and executed. Server-side rendering or static generation puts the
content into the HTML, so the first paint and LCP do not wait for the bundle.
See [Next.js](../../nextjs.mdx) and
[Bundle Optimization](../tools/bundle-optimization.md).

## Example

The `<head>` and the first screen of an optimized page:

```html
<head>
  <!-- Connect early to the origin of images -->
  <link rel="preconnect" href="https://cdn.example.com" />
  <!-- The font used on the first screen -->
  <link
    rel="preload"
    href="/fonts/inter.woff2"
    as="font"
    type="font/woff2"
    crossorigin
  />
  <!-- Critical CSS inline, the rest does not block rendering.
       onload is an inline handler: under a strict CSP it needs a nonce -->
  <style>
    /* styles of the first screen */
  </style>
  <link
    rel="stylesheet"
    href="/styles.css"
    media="print"
    onload="this.media='all'"
  />
  <!-- Does not block the parser, runs after parsing -->
  <script src="/app.js" defer></script>
</head>
<body>
  <!-- highlight-start -->
  <img
    src="https://cdn.example.com/hero.avif"
    width="1200"
    height="600"
    fetchpriority="high"
    alt="Product photo"
  />
  <!-- highlight-end -->
  <!-- Below the fold -->
  <img
    src="https://cdn.example.com/team.avif"
    width="600"
    height="300"
    loading="lazy"
    alt="Our team"
  />
</body>
```

## Follow-up Questions

- Why is CSS render-blocking and JavaScript parser-blocking? Painting without
  styles would show unstyled content and then repaint it. A script may change
  the DOM (`document.write`) or read styles, so the parser waits for it.
- What is the difference between `preload` and `prefetch`? `preload` is for the
  current page, with the priority of its `as` type (high for fonts and styles,
  low for images unless `fetchpriority="high"`); `prefetch` is for a future
  navigation, with the lowest priority.
- What do you do first on a slow page? Measure: find the LCP element and the
  request waterfall in front of it (Lighthouse, WebPageTest, the **Network**
  panel), then shorten the longest chain. See
  [Debugging](../tools/debugging.md).
- How did HTTP/2 change the advice? Many small files are cheap over one
  multiplexed connection, so domain sharding, sprites and inlining everything
  are no longer needed. Bundling still helps compression and tree shaking.

## Common Mistakes

- "Put scripts at the end of `<body>`." That is the advice from before `defer`:
  `<script defer>` in `<head>` starts the download earlier and still runs after
  parsing.
- Preloading everything: priorities stop meaning anything.
- `loading="lazy"` on every image, including the hero image.
- Measuring only on a fast laptop and a fast network: use CPU and network
  throttling in DevTools, or field data.
- Long chains of requests: HTML → CSS → `@import` → font, each waiting for the
  previous one.

## See Also

- [Core Web Vitals](./web-vitals.md)
- [How the Browser Works](../browser/browser-workflow.md)
- [Bundle Optimization](../tools/bundle-optimization.md)
