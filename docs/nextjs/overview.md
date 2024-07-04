---
sidebar_position: 1
---

# Next.js Overview

Next.js is a popular React framework created by Vercel. It is designed to enable
developers to build server-side rendering (SSR) and static web applications with
ease. Next.js offers a range of features that streamline the development
process, enhance performance, and provide a seamless developer experience.

## Key Features

- Server-Side Rendering (SSR): Next.js allows pages to be rendered on the server
  before being sent to the client, improving initial load times and SEO
  performance.

- Static Site Generation (SSG): Next.js can generate static pages at build time,
  which can then be served to users with minimal server overhead. This is ideal
  for content that doesn't change frequently.

- Hybrid Mode: You can mix SSR and SSG within the same application, choosing the
  best rendering method for each page.

- Incremental Static Regeneration (ISR): ISR allows you to update static content
  after it's been deployed, making it possible to have the best of both static
  and dynamic content.

- API Routes: Next.js allows you to create API endpoints within your
  application. This simplifies backend logic by integrating it within the same
  project structure.

- Automatic Code Splitting: Each page only loads the necessary JavaScript and
  CSS, resulting in faster page loads and better performance.

- Image Optimization: Next.js provides an image component that optimizes images
  for faster loading, supporting responsive images and automatic resizing.

- Built-in CSS and Sass Support: Next.js supports importing CSS and Sass files,
  and you can also use CSS-in-JS libraries like styled-components or emotion.

- File-based Routing: Pages in Next.js are based on the filesystem. Each file in
  the pages directory becomes a route in the application.

- TypeScript Support: Next.js has excellent TypeScript support, making it easier
  to catch errors early and improve code quality.

:::tip

Next.js supports Hot Module Replacement (HMR). This feature enables developers
to see changes in real-time without needing to refresh the entire page,
enhancing the development experience.

:::

## When to Use

Next.js is a good choice if you need:

- Improved SEO and performance through SSR or SSG.
- A hybrid application with both static and dynamic content.
- Integrated backend API routes within your application.
- An easy setup with built-in optimizations for images and code splitting.

## Creating a New Project

To create a new Next.js project, run one of the following commands.

```sh
npx create-next-app@latest
```

```sh
yarn create next-app
```

On installation, you'll see the following prompts.

```plaintext
What is your project named? my-app
Would you like to use TypeScript? No / Yes
Would you like to use ESLint? No / Yes
Would you like to use Tailwind CSS? No / Yes
Would you like to use `src/` directory? No / Yes
Would you like to use App Router? (recommended) No / Yes
Would you like to customize the default import alias (@/*)? No / Yes
What import alias would you like configured? @/*
```

:::tip Manual Installation

To manually create a new Next.js app in existing project, install the required
packages.

```sh
npm install next@latest react@latest react-dom@latest
```

And then, add necessacry scripts to `package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

:::

Navigate to your project directory and start the development server.

```sh
cd my-next-app
npm run dev
```

```sh
cd my-next-app
yarn dev
```
