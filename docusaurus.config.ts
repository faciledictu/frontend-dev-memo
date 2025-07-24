import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import categories from './src/categories';

const REPO_URL = `https://github.com/faciledictu/frontend-dev-memo`;
const SITE_URL = `https://${process.env.VERCEL_URL}`;
const SITE_NAME = 'Frontend Developer Memo';

type CustomNavbarItem = {
  type: 'docSidebar';
  sidebarId: string;
  label: string;
  position: 'left';
};

const navbarItems = categories.map(
  ({ id, label }): CustomNavbarItem => ({
    type: 'docSidebar',
    sidebarId: id,
    label,
    position: 'left',
  })
);

const config: Config = {
  title: SITE_NAME,
  tagline: 'Information to help you prepare for a frontend developer interview',
  favicon: '/img/logo.svg',
  organizationName: 'Dmitrii Zhigulin',
  projectName: SITE_NAME,

  url: SITE_URL,
  baseUrl: '/',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

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
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      title: SITE_NAME,
      logo: {
        alt: ' ',
        src: 'img/logo.svg',
        width: 32,
        height: 32,
      },
      items: [
        ...navbarItems,
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
  },
  themes: ['@docusaurus/theme-mermaid'],
};

export default config;
