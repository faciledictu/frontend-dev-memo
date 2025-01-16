import Link from '@docusaurus/Link';
import Heading from '@theme/Heading';
import clsx from 'clsx';
import categories from '../../categories';
import styles from './index.module.css';

type Icon = React.ComponentType<React.ComponentProps<'svg'>>;

type CategoryLink = {
  label: string;
  Icon: Icon;
  description: JSX.Element;
  link: string;
};

const icons = new Map<string, Icon>([
  ['common', require('@site/static/img/category-common.svg').default],
  ['git', require('@site/static/img/category-git.svg').default],
  ['javascript', require('@site/static/img/category-javascript.svg').default],
  ['browser', require('@site/static/img/category-browser.svg').default],
  ['react', require('@site/static/img/category-react.svg').default],
  ['react-native', require('@site/static/img/category-react.svg').default],
  ['nextjs', require('@site/static/img/category-nextjs.svg').default],
  ['typescript', require('@site/static/img/category-typescript.svg').default],
  ['nodejs', require('@site/static/img/category-nodejs.svg').default],
  ['sql', require('@site/static/img/category-sql.svg').default],
]);

const getIcon = (id: string) => icons.get(id) ?? icons.get('common');

const categoryLinks: CategoryLink[] = categories.map(
  ({ id, label, description }) => ({
    label,
    Icon: getIcon(id),
    link: `/${id}`,
    description: <>{description}</>,
  })
);

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

export default function HomepageLinks(): JSX.Element {
  return (
    <section>
      <div className="container">
        <div className={clsx('row', styles.stretch)}>
          {categoryLinks.map((props, idx) => (
            <CategoryLink key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
