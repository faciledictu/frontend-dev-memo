type Group = 'main' | 'general' | 'related';

interface Category {
  id: string;
  label: string;
  navbarLabel: string;
  description: string;
  group: Group;
}

export const javascript: Category = {
  id: 'javascript',
  label: 'JavaScript',
  navbarLabel: 'JS',
  description:
    'Types, scope and closures, this, prototypes, event loop, promises and modules',
  group: 'main',
};

export const typescript: Category = {
  id: 'typescript',
  label: 'TypeScript',
  navbarLabel: 'TS',
  description:
    'Types and narrowing, generics, utility types, tsconfig and typing React',
  group: 'main',
};

export const htmlCss: Category = {
  id: 'html-css',
  label: 'HTML & CSS',
  navbarLabel: 'HTML/CSS',
  description:
    'Semantic HTML, the cascade, box model, Flexbox, Grid, positioning, responsive design and custom properties',
  group: 'main',
};

export const webPlatform: Category = {
  id: 'web-platform',
  label: 'Web Platform',
  navbarLabel: 'Web',
  description:
    'Network, how the browser renders a page, performance, security, accessibility, bundle size and debugging tools',
  group: 'main',
};

export const react: Category = {
  id: 'react',
  label: 'React',
  navbarLabel: 'React',
  description:
    'Components, hooks, rendering, performance, state management and ecosystem',
  group: 'main',
};

export const nextjs: Category = {
  id: 'nextjs',
  label: 'Next.js',
  navbarLabel: 'Next',
  description:
    'App Router, Server Components, data fetching, caching and Server Actions',
  group: 'main',
};

export const reactNative: Category = {
  id: 'react-native',
  label: 'React Native',
  navbarLabel: 'RN',
  description:
    'Architecture, styling, lists, animations, native features and releases',
  group: 'main',
};

export const programming: Category = {
  id: 'programming',
  label: 'Programming',
  navbarLabel: 'Programming',
  description: 'Principles of good code, paradigms, patterns and algorithms',
  group: 'general',
};

export const tooling: Category = {
  id: 'tooling',
  label: 'Tooling and Process',
  navbarLabel: 'Tooling',
  description:
    'Testing, package managers, CI/CD, code review and methodologies',
  group: 'general',
};

export const git: Category = {
  id: 'git',
  label: 'Git',
  navbarLabel: 'Git',
  description:
    'Merge vs rebase, undoing changes, stash, tags and branching models',
  group: 'general',
};

export const nodejs: Category = {
  id: 'nodejs',
  label: 'Node.js',
  navbarLabel: 'Node',
  description: 'Event loop, modules, errors and core modules',
  group: 'related',
};

export const sql: Category = {
  id: 'sql',
  label: 'SQL',
  navbarLabel: 'SQL',
  description:
    'Queries and joins, constraints, indexes and transactions in PostgreSQL',
  group: 'related',
};

const categories: Category[] = [
  javascript,
  typescript,
  htmlCss,
  webPlatform,
  react,
  nextjs,
  reactNative,
  programming,
  tooling,
  git,
  nodejs,
  sql,
];

export const mainCategories = categories.filter(
  ({ group }) => group === 'main'
);

export const generalCategories = categories.filter(
  ({ group }) => group === 'general'
);

export const relatedCategories = categories.filter(
  ({ group }) => group === 'related'
);

export default categories;
