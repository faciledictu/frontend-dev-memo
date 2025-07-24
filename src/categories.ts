interface Category {
  id: string;
  label: string;
  navbarLabel: string;
  description: string;
}

export const common: Category = {
  id: 'common',
  label: 'Common Topics',
  navbarLabel: 'Common',
  description: 'Basic principles of programming',
};

export const git: Category = {
  id: 'git',
  label: 'Git and Gitflow',
  navbarLabel: 'Git',
  description: 'Working with Git',
};

export const javascript: Category = {
  id: 'javascript',
  label: 'JavaScript',
  navbarLabel: 'JS',
  description: 'JavaScript basic concepts',
};

export const browser: Category = {
  id: 'browser',
  label: 'Browser',
  navbarLabel: 'Browser',
  description: 'Working with web-content',
};

export const react: Category = {
  id: 'react',
  label: 'React',
  navbarLabel: 'React',
  description: 'An overview of React and Redux',
};

export const reactNative: Category = {
  id: 'react-native',
  label: 'React Native',
  navbarLabel: 'RN',
  description: 'Framework for building mobile apps using JavaScript and React',
};

export const typescript: Category = {
  id: 'typescript',
  label: 'TypeScript',
  navbarLabel: 'TS',
  description: 'Statically typed superset of JavaScript',
};

export const nextjs: Category = {
  id: 'nextjs',
  label: 'Next.js',
  navbarLabel: 'Next',
  description: 'React framework for building full-stack web applications',
};

export const nodejs: Category = {
  id: 'nodejs',
  label: 'Node.js',
  navbarLabel: 'Node',
  description:
    'JavaScript runtime that allows server-side execution of JavaScript code',
};

export const sql: Category = {
  id: 'sql',
  label: 'SQL',
  navbarLabel: 'SQL',
  description:
    'Structured Query Language for managing and manipulating relational databases',
};

const categories: Category[] = [
  common,
  git,
  javascript,
  typescript,
  browser,
  react,
  reactNative,
  nextjs,
  nodejs,
  sql,
];

export default categories;
