---
sidebar_position: 3
description: Code splitting and next/dynamic, next/image, next/font, next/script
---

# Optimization Tools

Next.js optimizes out of the box: it **splits code per route**, keeps Server
Component code out of the browser, and provides components for the usual causes
of slow pages: **`next/image`** (resized, lazy-loaded images in modern formats
with reserved space, against CLS and for LCP), **`next/font`** (self-hosted
fonts without layout shift), **`next/script`** (third-party scripts with a
loading strategy) and **`next/dynamic`** (lazy-loaded client components).

Applies to: Next.js 16.

## Details

### Code Splitting

- Each route segment gets its own client bundle; shared code goes into common
  chunks.
- Server Components are not sent to the browser at all; only Client Components
  add JavaScript.
- `next/dynamic` (or `React.lazy` with `Suspense`) moves a Client Component into
  a separate chunk that loads when it is rendered.
- `ssr: false` skips the server render of a component that needs browser APIs.
  It is allowed only inside a Client Component.
- A library can be loaded on demand with `await import('lib')` in an event
  handler.

### `next/image`

| Prop              | What it does                                                                                                                |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `src`, `alt`      | Required. A static import gives `width`, `height` and a blur placeholder automatically                                      |
| `width`, `height` | Reserve space before loading (no CLS). Required for remote images unless `fill` is set                                      |
| `fill`            | The image fills a positioned parent; used with `sizes` and CSS `object-fit`                                                 |
| `sizes`           | How wide the image is at each breakpoint; without it the browser assumes `100vw` and may download a bigger file than needed |
| `loading`         | `lazy` by default; `eager` for images visible on the first screen                                                           |
| `preload`         | Adds a `<link rel="preload">` in `<head>` for the LCP image. Replaces `priority`, deprecated in 16                          |
| `placeholder`     | `empty` (default), `blur` (with `blurDataURL` for remote images) or a `data:image/...` URL                                  |
| `quality`         | 75 by default; allowed values are listed in `images.qualities`                                                              |

- Images are resized on demand and served as WebP (AVIF if enabled in
  `images.formats`) depending on the browser's `Accept` header.
- Remote hosts must be allowed in `images.remotePatterns`.
- For the LCP image use `preload`, or `loading="eager"` with
  `fetchPriority="high"`; never leave it lazy.

### `next/font`

- Google Fonts and local files are downloaded at build time and **served from
  your own domain**: no request to Google, no extra connection.
- A fallback font with adjusted metrics is generated, so swapping fonts does not
  shift the layout.
- The font is imported by name:
  `Roboto({ weight: ['400', '700'], subsets: ['latin'] })`.

### `next/script`

| `strategy`                   | When the script loads                                                       |
| ---------------------------- | --------------------------------------------------------------------------- |
| `beforeInteractive`          | Before hydration; only in the root layout (`_document` in the Pages Router) |
| `afterInteractive` (default) | After some hydration on the page                                            |
| `lazyOnload`                 | When the browser is idle                                                    |
| `worker`                     | In a web worker through Partytown; experimental, Pages Router only          |

## Example

<details>
<summary>Examples</summary>

```tsx title="app/page.tsx"
import Image from 'next/image';
import hero from './hero.jpg';

export default function Page() {
  return (
    <>
      {/* LCP image: preloaded, size and blur placeholder from the import */}
      <Image src={hero} alt="Mountains at sunrise" preload placeholder="blur" />

      {/* Responsive image in a grid: sizes keeps the download small */}
      <div style={{ position: 'relative', aspectRatio: '4 / 3' }}>
        <Image
          src="https://images.example.com/card.jpg"
          alt="Product photo"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ objectFit: 'cover' }}
        />
      </div>
    </>
  );
}
```

```tsx title="app/layout.tsx"
import { Roboto } from 'next/font/google';
import Script from 'next/script';

const roboto = Roboto({ weight: ['400', '700'], subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={roboto.className}>
      <body>
        {children}
        <Script src="https://example.com/analytics.js" strategy="lazyOnload" />
      </body>
    </html>
  );
}
```

```tsx title="app/dashboard/chart-panel.tsx"
'use client';

import dynamic from 'next/dynamic';

// A heavy chart that uses window: separate chunk, no server render
const Chart = dynamic(() => import('./chart'), {
  ssr: false,
  loading: () => <p>Loading chart...</p>,
});

export function ChartPanel({ show }: { show: boolean }) {
  return show ? <Chart /> : null;
}
```

</details>

## Follow-up Questions

- How does `next/image` help Core Web Vitals? Reserved width and height prevent
  CLS; `preload` or `fetchPriority="high"` on the hero image improves LCP; lazy
  loading of the rest saves bandwidth.
- Why is `sizes` important with `fill`? Without it the generated `srcset`
  assumes the image is as wide as the viewport, and a small card downloads a
  full-width file.
- Why self-host fonts? No extra connection to another origin and no layout shift
  when the font arrives.

## See Also

- [Bundle Optimization](../web-platform/tools/bundle-optimization.md)
- [Performance in React](../react/performance/optimization.md)
