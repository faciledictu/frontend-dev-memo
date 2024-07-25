interface Category {
  id: string;
  label: string;
  description: string;
}

export const common: Category = {
  id: 'common',
  label: 'Common Topics',
  description: 'Basic principles of programming',
};

export const git: Category = {
  id: 'git',
  label: 'Git and Gitflow',
  description: 'Working with Git',
};

export const javascript: Category = {
  id: 'javascript',
  label: 'JavaScript',
  description: 'JavaScript basic concepts',
};

export const browser: Category = {
  id: 'browser',
  label: 'Browser',
  description: 'Working with web-content',
};

export const react: Category = {
  id: 'react',
  label: 'React',
  description: 'An overview of React and Redux',
};

export const typescript: Category = {
  id: 'typescript',
  label: 'TypeScript',
  description: 'Statically typed superset of JavaScript',
};

export const nextjs: Category = {
  id: 'nextjs',
  label: 'Next.js',
  description: 'React framework for building full-stack web applications',
};

export const nodejs: Category = {
  id: 'nodejs',
  label: 'Node.js',
  description: 'JavaScript runtime that allows server-side execution of JavaScript code',
};

export const sql: Category = {
  id: 'sql',
  label: 'SQL',
  description: 'Structured Query Language for managing and manipulating relational databases',
};

const categories: Category[] = [
  common,
  git,
  javascript,
  typescript,
  browser,
  react,
  nextjs,
  nodejs,
  sql
];

export default categories;
