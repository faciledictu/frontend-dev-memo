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

Next.js automatically splits your code into separate bundles for each page,
reducing the amount of JavaScript that needs to be loaded initially.

You can use dynamic imports to load components only when they are needed.

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
