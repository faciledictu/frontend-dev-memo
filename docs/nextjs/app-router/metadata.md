---
sidebar_position: 9
description:
  Metadata API (metadata vs generateMetadata, merging, title templates), OG
  images, sitemap and robots, viewport, streaming metadata
tags: [middle]
---

# Metadata and SEO

In the App Router `<title>`, meta tags and Open Graph tags come from the
**Metadata API**: a layout or a page exports a static **`metadata`** object or
an async **`generateMetadata()`** function (only in Server Components). Next.js
merges the objects from the root layout down to the page and renders the tags
into `<head>`. Icons, OG images, `sitemap.xml` and `robots.txt` are **files** in
`app/`: static, or code that generates them.

Applies to: Next.js 16.4.

## Details

### `metadata` vs `generateMetadata`

| Export               | Use                                                                  |
| -------------------- | -------------------------------------------------------------------- |
| `metadata`           | Static values: the site name, a description, the root `metadataBase` |
| `generateMetadata()` | Values from data: the post title, its cover as the OG image          |

- Only in `layout.tsx` and `page.tsx`, only in Server Components. Exporting both
  from the same segment is an error.
- **Shallow merge** from the root layout to the page: a field set lower replaces
  the parent's. A nested object (`openGraph`, `robots`) is replaced **as a
  whole**, so a page that sets `openGraph.title` loses the parent's
  `openGraph.images`; keep shared parts in a variable and spread it.
- `generateMetadata` receives `params` and `searchParams` like the page. A
  `fetch` with the same URL and options runs once for metadata and the page;
  other data loaders are wrapped in React `cache` for the same effect.

### Title and URLs

- `title: { template: '%s | Acme', default: 'Acme' }` in the root layout: a page
  with `title: 'Blog'` gets `Blog | Acme`; a page without a title gets `Acme`.
  The template applies to child segments, not to the segment that defines it.
- `title: { absolute: 'Acme' }` ignores the parent's template.
- **`metadataBase`** (`new URL('https://acme.com')` in the root layout) turns
  relative URLs in `openGraph.images`, `alternates.canonical` and others into
  absolute ones; a relative URL without it is a build error.

### File-Based Metadata

| File in `app/`                              | Result                                                      |
| ------------------------------------------- | ----------------------------------------------------------- |
| `favicon.ico`, `icon.png`, `apple-icon.png` | `<link rel="icon">`, `<link rel="apple-touch-icon">`        |
| `opengraph-image.png`, `twitter-image.png`  | `og:image`, `twitter:image` for this segment and below      |
| `opengraph-image.tsx`                       | The image generated from JSX by `ImageResponse` (`next/og`) |
| `sitemap.ts`                                | `/sitemap.xml` from a `MetadataRoute.Sitemap` array         |
| `robots.ts`                                 | `/robots.txt` from a `MetadataRoute.Robots` object          |
| `manifest.ts`                               | `/manifest.webmanifest`                                     |

- A file takes precedence over the `metadata` object for the same tag.
- `ImageResponse` supports flexbox and a subset of CSS (no grid).
- A large site splits the sitemap with `generateSitemaps()`: one file holds at
  most 50,000 URLs.

### Viewport

`themeColor`, `colorScheme` and the viewport meta tag are a separate export:
`viewport` or `generateViewport()`, with the same rules as metadata. Inside
`metadata` these fields are deprecated.

### Streaming Metadata

- For a page rendered on request, `generateMetadata` does not block the HTML:
  the page streams, and the tags are added when they resolve (in `<body>`;
  browsers and crawlers that run JavaScript handle it).
- Bots that read only HTML (social previews: `facebookexternalhit`, Twitterbot,
  Slackbot; detected by user agent, the `htmlLimitedBots` option) get blocking
  metadata in `<head>`.
- A prerendered page has its metadata in `<head>` already.
- With **Cache Components**, metadata that reads request data (`cookies()`,
  `headers()`, `params`, `searchParams`) or uncached data, on a page that is
  otherwise fully prerendered, is a **build error**. Fix it with `'use cache'`
  in `generateMetadata` if the data is not request data, or by marking the page
  dynamic on purpose (a component that awaits `connection()` inside
  `<Suspense>`).

### Other Ways to Set Tags

- React 19 hoists `<title>` and `<meta>` rendered in any component to `<head>`.
  In Next.js the Metadata API is preferred: it merges segments and streams; a
  React `<title>` is the fallback where the API is not available, for example in
  `global-error.tsx`, which is a Client Component.
- The Pages Router uses `<Head>` from `next/head` on each page.

## Example

```tsx title="app/layout.tsx"
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://acme.com'),
  // highlight-next-line
  title: { template: '%s | Acme', default: 'Acme' },
  description: 'Acme online store',
};
```

```tsx title="app/blog/[slug]/page.tsx"
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPost } from '@/lib/posts'; // wrapped in React cache()

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post?.title, // → "Hello | Acme"
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { images: post ? [post.cover] : [] },
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug); // the same call: not run twice
  if (!post) notFound();
  return <h1>{post.title}</h1>;
}
```

<details>
<summary>OG image, sitemap and robots</summary>

```tsx title="app/blog/[slug]/opengraph-image.tsx"
import { ImageResponse } from 'next/og';
import { getPost } from '@/lib/posts';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  return new ImageResponse(
    <div style={{ display: 'flex', fontSize: 64, padding: 48 }}>
      {post?.title}
    </div>,
    size
  );
}
```

```typescript title="app/sitemap.ts"
import type { MetadataRoute } from 'next';
import { getPosts } from '@/lib/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: 'https://acme.com', lastModified: new Date() },
    ...posts.map((post) => ({
      url: `https://acme.com/blog/${post.slug}`,
      lastModified: post.updatedAt,
    })),
  ];
}
```

```typescript title="app/robots.ts"
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin/' },
    sitemap: 'https://acme.com/sitemap.xml',
  };
}
```

</details>

## Follow-up Questions

- Why can a Client Component not export `metadata`? Metadata is resolved on the
  server as part of rendering; a page that needs client code keeps the metadata
  in the page and moves the interactive part into a child component.
- A page sets only `openGraph.title`; why did the OG image disappear? The merge
  is shallow: the page's `openGraph` replaced the layout's whole object.
- How do you avoid duplicate content between `/blog?page=1` and `/blog`?
  `alternates.canonical`.
- Does `robots.txt` hide a page from search? No, it only asks crawlers not to
  crawl it; a page linked from elsewhere can still be indexed. Use
  `robots: { index: false }` (`noindex`) on the page.
- How do you add structured data (JSON-LD)? Render
  `<script type="application/ld+json">` in the page; the Metadata API does not
  cover it.
- How do you link localized versions of a page? `alternates.languages`
  (`hreflang` links), resolved against `metadataBase`.

## Common Mistakes

- Exporting `metadata` and `generateMetadata` from the same file.
- Relative OG image URLs without `metadataBase`.
- Loading the same data separately for metadata and the page without `fetch`
  memoization or `cache`, so it runs twice.
- Using `next/head` in the App Router: it is not supported there.

## See Also

- [App Router](./overview.md)
- [Server Components](./server-components.mdx)
- [React 19](../../react/react-19.md)
