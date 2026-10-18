---
sidebar_position: 1
description:
  LCP, INP and CLS, thresholds, field vs lab data, how to improve each metric
tags: [middle]
---

# Core Web Vitals

**Core Web Vitals** are Google's three user-experience metrics, also used as a
**ranking signal** in Search:

- **LCP** (Largest Contentful Paint), **loading**: when the largest image or
  text block in the viewport is rendered. Good: **≤ 2.5 s**.
- **INP** (Interaction to Next Paint), **responsiveness**: from an input to the
  next frame, close to the slowest interaction of the visit. Good: **≤ 200 ms**
  (replaced FID in 2024).
- **CLS** (Cumulative Layout Shift), **visual stability**: how much the content
  jumps around unexpectedly. Good: **≤ 0.1**.

A page passes when the **75th percentile** of real visits (**field data**) is in
the good range. Lighthouse gives **lab data**: useful for debugging, not the
same thing.

## Details

### Thresholds

| Metric | Good     | Needs improvement | Poor     |
| ------ | -------- | ----------------- | -------- |
| LCP    | ≤ 2.5 s  | ≤ 4 s             | > 4 s    |
| INP    | ≤ 200 ms | ≤ 500 ms          | > 500 ms |
| CLS    | ≤ 0.1    | ≤ 0.25            | > 0.25   |

Supporting metrics: **TTFB** (time to the first byte of the response, good ≤ 0.8
s), **FCP** (the first text or image, good ≤ 1.8 s), **TBT** (total blocking
time, the lab stand-in for INP).

### Field vs Lab

|         | Field (RUM)                                                                        | Lab                                         |
| ------- | ---------------------------------------------------------------------------------- | ------------------------------------------- |
| Source  | real users: CrUX (Chrome only, not on iOS), the `web-vitals` library, RUM services | one run on one device: Lighthouse, DevTools |
| Shows   | what users get, on their devices and networks                                      | why it is slow, reproducibly                |
| INP     | yes                                                                                | no: nobody clicks, so TBT is used instead   |
| Used in | Google Search ranking, Search Console                                              | development, CI                             |

### LCP

The LCP time is made of four parts: **TTFB** → **resource load delay** (until
the browser discovers the image) → **resource load duration** → **render
delay**. What helps:

- A fast server response: caching, a CDN, server-side rendering instead of
  rendering the content in the browser.
- The LCP image is **discoverable in the HTML**: an `<img>`, not a CSS
  background or an element created by JavaScript. Otherwise
  `<link rel="preload">`.
- **`fetchpriority="high"`** on the LCP image, and **never `loading="lazy"`** on
  it.
- Smaller images. See
  [Critical Rendering Path and Loading Performance](./loading-performance.md#images).
- No render-blocking CSS and scripts in the way. See
  [Critical Rendering Path and Loading Performance](./loading-performance.md).

### INP

An interaction is made of **input delay** (the main thread is busy) →
**processing** (event handlers) → **presentation delay** (rendering the next
frame). What helps:

- **Break long tasks** (over 50 ms): show feedback first, then yield to the
  browser with `scheduler.yield()` or `setTimeout`, and do the rest.
- Less JavaScript on the main thread: code splitting, fewer third-party scripts,
  heavy computation in a [Web Worker](../browser/web-workers.md).
- In React: `startTransition` for non-urgent updates, fewer re-renders. See
  [Concurrent Rendering](../../react/rendering/concurrent-rendering.md).
- A smaller DOM and no layout thrashing. See
  [How the Browser Works](../browser/browser-workflow.md#reflow-and-repaint).

### CLS

The score of a shift is the share of the viewport that moved times the distance
it moved. CLS takes the worst burst of shifts (a **session window**: shifts less
than 1 s apart, up to 5 s in total). Shifts within 500 ms after a click or a key
press do not count. Only Chromium reports CLS; LCP and INP are reported by all
major browsers. What helps:

- **`width` and `height`** (or `aspect-ratio`) on images, videos and iframes, so
  that the space is reserved before they load.
- Reserved space for ads, embeds and banners; no content inserted above what the
  user is reading.
- Fonts: `font-display: optional`, or a fallback font adjusted with
  `size-adjust`, so that the text does not change size when the font arrives.
- Animations through `transform`, not `top` or `height`.

## Example

Collecting field data with the `web-vitals` library:

```javascript
import { onCLS, onINP, onLCP } from 'web-vitals';

function sendToAnalytics({ name, value, rating, id }) {
  // highlight-start
  navigator.sendBeacon(
    '/analytics',
    JSON.stringify({ name, value, rating, id })
  );
  // highlight-end
}

onCLS(sendToAnalytics);
onINP(sendToAnalytics);
onLCP(sendToAnalytics);
```

Improving INP by yielding to the browser in a long click handler:

```javascript
function yieldToMain() {
  if (globalThis.scheduler?.yield) return scheduler.yield();
  return new Promise((resolve) => setTimeout(resolve, 0));
}

button.addEventListener('click', async () => {
  showSpinner(); // visible feedback in the next frame
  // highlight-next-line
  await yieldToMain(); // the browser paints here
  runHeavyWork();
});
```

## Follow-up Questions

- Why INP instead of FID? FID measured only the input delay of the **first**
  interaction. INP measures the whole interaction, up to the next frame, for the
  slowest interactions of the visit.
- Why is the score good in Lighthouse but poor in Search Console? Lighthouse is
  one run with an emulated mid-range phone and slow network, with an empty cache
  and no interactions. Field data is the real spread of devices, networks, cache
  states and user actions.
- Why does `loading="lazy"` on the hero image make LCP worse? The browser waits
  for layout to decide whether the image is in the viewport, so the download
  starts later.
- How do you find which interaction is slow? Record it in the **Performance**
  panel: the Interactions track splits it into input delay, processing and
  presentation. In the field, the `web-vitals/attribution` build reports the
  element and the longest phase for each metric.

## Common Mistakes

- Listing FID, FCP or TTI as Core Web Vitals. FID was replaced by INP; FCP, TTFB
  and TBT are supporting metrics.

- Optimizing only the Lighthouse score: the field data is what counts.
- "CLS is about the page load." Shifts are counted during the whole visit, for
  example when content loads after scrolling.
- "INP is the average delay." It is close to the worst interaction of the visit.
- Lazy-loading the LCP image, or loading it from CSS or JavaScript.

## See Also

- [Critical Rendering Path and Loading Performance](./loading-performance.md)
- [Optimization Tools in Next.js](../../nextjs/optimization.md)
- [Bundle Optimization](./bundle-optimization.md)
