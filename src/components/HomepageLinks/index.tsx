import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import CategoryBrowser from '@site/static/img/category-browser.svg';
import CategoryCommon from '@site/static/img/category-common.svg';
import CategoryGit from '@site/static/img/category-git.svg';
import CategoryHtmlCss from '@site/static/img/category-html-css.svg';
import CategoryJavascript from '@site/static/img/category-javascript.svg';
import CategoryNextjs from '@site/static/img/category-nextjs.svg';
import CategoryNodejs from '@site/static/img/category-nodejs.svg';
import CategoryReact from '@site/static/img/category-react.svg';
import CategoryReactNative from '@site/static/img/category-react-native.svg';
import CategorySql from '@site/static/img/category-sql.svg';
import CategoryTooling from '@site/static/img/category-tooling.svg';
import CategoryTypescript from '@site/static/img/category-typescript.svg';
import {
  generalCategories,
  mainCategories,
  relatedCategories,
} from '../../categories';
import styles from './index.module.css';

type Icon = React.ComponentType<React.ComponentProps<'svg'>>;

type CategoryLink = {
  id: string;
  label: string;
  Icon: Icon;
  description: ReactNode;
  link: string;
};

const icons: Record<string, Icon> = {
  'programming': CategoryCommon,
  'git': CategoryGit,
  'tooling': CategoryTooling,
  'javascript': CategoryJavascript,
  'web-platform': CategoryBrowser,
  'html-css': CategoryHtmlCss,
  'react': CategoryReact,
  'react-native': CategoryReactNative,
  'nextjs': CategoryNextjs,
  'typescript': CategoryTypescript,
  'nodejs': CategoryNodejs,
  'sql': CategorySql,
};

const getIcon = (id: string) => icons[id] ?? CategoryCommon;

const toCategoryLink = ({
  id,
  label,
  description,
}: (typeof mainCategories)[number]): CategoryLink => ({
  id,
  label,
  Icon: getIcon(id),
  link: `/${id}`,
  description: <>{description}</>,
});

const mainLinks = [...mainCategories, ...generalCategories].map(toCategoryLink);
const relatedLinks = relatedCategories.map(toCategoryLink);

function CategoryLink({ label, Icon, link, description }: CategoryLink) {
  return (
    <div className="col col--3 margin-bottom--lg">
      <Link to={link} className={clsx('card padding--md', styles.card)}>
        <Icon width={64} height={64} role="img" className="margin-bottom--md" />
        <Heading as="h3">{label}</Heading>
        <p>{description}</p>
      </Link>
    </div>
  );
}

export default function HomepageLinks(): ReactNode {
  return (
    <section>
      <div className="container">
        <div className={clsx('row', styles.stretch)}>
          {mainLinks.map((props) => (
            <CategoryLink key={props.id} {...props} />
          ))}
        </div>
        <Heading as="h2" className="margin-bottom--md">
          Related
        </Heading>
        <div className={clsx('row', styles.stretch)}>
          {relatedLinks.map((props) => (
            <CategoryLink key={props.id} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
