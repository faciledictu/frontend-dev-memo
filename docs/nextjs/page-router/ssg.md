---
sidebar_position: 5
---

# Static Site Generation (SSG)

If a page uses Static Generation, the page HTML-code is generated once at build
time. This HTML is then reused on each request. It can be cached by a CDN.

In Next.js, you can statically generate pages with or without data.

## Pages without Data

If the page doesn't need to fetch external data to be pre-rendered (does not
have 'getServerSideProps' or 'getInitialProps'), Next.js generates a single HTML
file per page during build time using Static Generation.

## Pages with Data

1. `getStaticProps()` fetches data at build time and passes it to the page
   component as props.

2. `getStaticPaths()` generates dynamic routes at build time. Used in
   conjunction with `getStaticProps()` for pages with dynamic paths.

```javascript title="pages/posts/[id].js"
import { useRouter } from 'next/router';
import Link from 'next/link';

// Fetch data at build time
export async function getStaticProps({ params }) {
  const res = await fetch(`https://api.example.com/posts/${params.id}`);
  const post = await res.json();

  return {
    props: {
      post,
    },
  };
}

// Specify dynamic routes to be pre-rendered
export async function getStaticPaths() {
  const res = await fetch('https://api.example.com/posts');
  const posts = await res.json();

  const paths = posts.map((post) => ({
    params: { id: post.id.toString() },
  }));

  return { paths, fallback: false };
}

const Post = ({ post }) => {
  const router = useRouter();

  // If the page is not yet generated, show a loading state
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <p>{post.body}</p>
      <Link href="/posts">Back to posts</Link>
    </div>
  );
};

export default Post;
```

- `getStaticProps`: Fetches data at build time for the post with the given `id`.
- `getStaticPaths` specifies the dynamic routes that should be pre-rendered. It
  fetches all posts and generates a list of paths.
- If `fallback` is `false`, any paths not returned by `getStaticPaths` will
  result in a 404 page.

### Considerations for SSG

Pages suitable for SSG usually:

- Do not require user-specific data.
- Do not change frequently (or can use ISR for updates).
- Can benefit from improved load times.

Common examples include marketing pages (e.g., homepage, about us), blog posts,
documentation, product pages (for e-commerce).
