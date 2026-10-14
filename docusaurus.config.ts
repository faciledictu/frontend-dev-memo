import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import type { PluginOptions as SearchLocalOptions } from '@easyops-cn/docusaurus-search-local';
import { themes as prismThemes } from 'prism-react-renderer';
import {
  generalCategories,
  mainCategories,
  relatedCategories,
} from './src/categories';

const REPO_URL = `https://github.com/faciledictu/frontend-dev-memo`;
const SITE_URL = 'https://frontend-dev-memo.vercel.app';
const SITE_NAME = 'Frontend Developer Memo';

type CustomNavbarItem = {
  type: 'docSidebar';
  sidebarId: string;
  label: string;
  position: 'left';
};

const toNavbarItem = ({
  id,
  navbarLabel,
}: (typeof mainCategories)[number]): CustomNavbarItem => ({
  type: 'docSidebar',
  sidebarId: id,
  label: navbarLabel,
  position: 'left',
});

const navbarItems = mainCategories.map(toNavbarItem);

const toDropdownItem = ({ id, label }: (typeof mainCategories)[number]) => ({
  type: 'docSidebar',
  sidebarId: id,
  label,
});

const config: Config = {
  title: SITE_NAME,
  tagline: 'Information to help you prepare for a frontend developer interview',
  favicon: '/img/logo.svg',
  organizationName: 'Dmitrii Zhigulin',
  projectName: SITE_NAME,

  url: SITE_URL,
  baseUrl: '/',

  onBrokenLinks: 'throw',

  future: {
    faster: true,
    v4: true,
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  plugins: [
    [
      'vercel-analytics',
      {
        debug: false,
        mode: 'auto',
      },
    ],
  ],

  presets: [
    [
      'classic',
      {
        docs: {
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
          editUrl: `${REPO_URL}/tree/main/`,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      logo: {
        alt: ' ',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        ...navbarItems,
        {
          type: 'dropdown',
          label: 'General',
          position: 'left',
          items: generalCategories.map(toDropdownItem),
        },
        {
          type: 'dropdown',
          label: 'Related',
          position: 'left',
          items: relatedCategories.map(toDropdownItem),
        },
        {
          href: REPO_URL,
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [{ label: 'GitHub', href: REPO_URL }],
      copyright: `Built with Docusaurus`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'typescript'],
      magicComments: [
        {
          className: 'theme-code-block-highlighted-line',
          line: 'highlight-next-line',
          block: { start: 'highlight-start', end: 'highlight-end' },
        },
        {
          className: 'code-block-error-line',
          line: 'error-next-line',
          block: { start: 'error-start', end: 'error-end' },
        },
        {
          className: 'code-block-correct-line',
          line: 'correct-next-line',
          block: { start: 'correct-start', end: 'correct-end' },
        },
      ],
    },
    mermaid: {
      theme: { light: 'base', dark: 'base' },
      options: {
        themeVariables: {
          primaryColor: '#0062ff',
          primaryTextColor: '#ffffff',
          primaryBorderColor: '#0062ff',
          lineColor: '#0062ff',
          secondaryColor: '#4d91ff',
          tertiaryColor: '#ffffff',
        },
      },
    },
  } satisfies Preset.ThemeConfig,

  markdown: {
    mermaid: true,
    hooks: {
      onBrokenMarkdownLinks: 'throw',
    },
  },
  themes: [
    '@docusaurus/theme-mermaid',
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexBlog: false,
        docsRouteBasePath: '/',
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      } satisfies SearchLocalOptions,
    ],
  ],
};

export default config;
