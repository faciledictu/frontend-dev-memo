type Category = {
  id: string;
  label: string;
  description: string;
};

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

const categories: Category[] = [common, git, javascript, browser];

export default categories;
