---
sidebar_position: 4
---

# Optimisaton Tools

## Code Splitting

:::info

Code splitting is the practice of breaking up your JavaScript into smaller
chunks, which can be loaded on demand. This helps improve the initial load time
by only loading the necessary code for the current page.

:::

Next.js automatically splits your code of into separate bundles for each page
(using Page Router) or for every Server Component (for App Router), reducing the
amount of JavaScript that needs to be loaded initially.

You can use dynamic imports to load components only when they are needed. There
are to ways to achieve this:

- Using dynamic imports with `next/dynamic`
- Using `React.lazy()` with `Suspense`

```tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(
  () => import('../components/DynamicComponent')
);

const AdditionalComponent = dynamic(
  () => import('../components/ConditionalComponent')
);

export default function Componets({ showMore }: { showMore: true }) {
  return (
    <>
      {/* Load immediately, but in a separate client bundle */}
      <DynamicComponent />;{/* Load on demand, only if `showMore` prop is true */}
      {showMore && <AdditionalComponent />}
    </>
  );
}
```

### Lazy Loads on Client Side

When using React.lazy() and Suspense, Client Components will be pre-rendered
(SSR) by default.

If you want to disable pre-rendering for a Client Component, you can use the ssr
option set to false:

```jsx
const ComponentC = dynamic(() => import('../components/C'), { ssr: false });
```

### Loading External Libraries

External libraries can be loaded on demand using the import() function.

In this
[exapmle](https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading#loading-external-libraries),
the module `fuse.js` is only loaded on the client after the user types in the
search input.

```jsx
'use client';

import { useState } from 'react';

const names = ['Tim', 'Joe', 'Bel', 'Lee'];

export default function Page() {
  const [results, setResults] = useState();

  return (
    <div>
      <input
        type="text"
        placeholder="Search"
        onChange={async (e) => {
          const { value } = e.currentTarget;
          // Dynamically load fuse.js
          const Fuse = (await import('fuse.js')).default;
          const fuse = new Fuse(names);

          setResults(fuse.search(value));
        }}
      />
      <pre>Results: {JSON.stringify(results, null, 2)}</pre>
    </div>
  );
}
```

## Image Optimization

The `next/image` module automatically optimizes images on demand, providing
features like lazy loading, resizing, and serving modern formats like WebP.

- `src` contains the link to the image file. The image source can be eiter a
  local file (statically imported) or a remote resource (URL). The module
  supports `.jpg`, `.png`, and `.webp` formats.

- `width` and `height` properties allows a browser to allocate the necessary
  space in the layout before the image loads. Next.js can determite properties
  automatically for statically imported images. For remote images you need to
  specify them explicitly, because Next.js does not have access to them.

- `fill` property indicates that image fills the parent container. With `fill`,
  we don't need to specify `width` and `height`

- `placeholder` is an optional property that specifies the content that will be
  displayed until the original file is downloaded.
  - When `empty`, the image container will be empty
  - When `blur`, the container will be filled by blurred image. If the image is
    statically imported, the blurred version will be generated automatically.
    Otherwise, you should provide it using `blurDataUrl` property.
  - When `data:image/...`, the provided `Data URL` will be user as the
    placeholder.

:::tip

The `priority` prop gives the image a higher loading priority. This means the
browser will start loading it sooner, even before other lower-priority
resources.

This is useful for above-the-fold images (hero images or key visual elements).
It's recommended to use this property with the images detected as the Largest
Contentful Paint (LCP) elements.

:::

```jsx
import Image from 'next/image';

export default function HomePage() {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <Image
        src="/path/to/important-image.jpg"
        width={800}
        height={600}
        alt="Important description"
        priority
      />
      <p>Other content on the page...</p>
      <Image
        src="/path/to/image.jpg"
        width={300}
        height={300}
        alt="Description"
      />
    </div>
  );
}
```

## Font Optimization

The `next/font` module allows you to load and optimize fonts from Google Fonts
or local sources with built-in support for optimizing font loading and reducing
layout shifts.

Fonts imported by `next/font` are self-hosted. This means that the files are
stored on your server, and the browser requests them from the same domain as
your deployment, rather than from external services such as Google Fonts.

```jsx
import { GoogleFont } from 'next/font/google';

const roboto = GoogleFont({
  name: 'Roboto',
  weights: ['400', '700'],
  styles: ['normal', 'italic'],
});

export default function HomePage() {
  return (
    <div className={roboto.className}>
      <p>Hello, world!</p>
    </div>
  );
}
```

## Script Optimization

The `next/script` module helps you optimize loading third-party scripts. You can
control how and when scripts are loaded using strategies like
`beforeInteractive`, `afterInteractive`, and `lazyOnload`.

```jsx
import Script from 'next/script';

export default function HomePage() {
  return (
    <>
      <Script src="https://example.com/script.js" strategy="lazyOnload" />
      <p>Content</p>
    </>
  );
}
```

### Strategies

Strategy next/script loads third-party scripts on any page or layout by default.
However, you can customise its behaviour via the strategy property:

- `beforeInteractive`: Loads the script before any Next.js code and before any
  page hydration occurs.

- `afterInteractive`: (default) Loads the script earlier, but after some some
  hydration on the page occurs.

- `lazyOnload`: Loads the script later while the browser is idle.

- `worker`: Loads the script in web worker.

```tsx
import Script from 'next/script';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script
          src="https://example.com/script.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
```
