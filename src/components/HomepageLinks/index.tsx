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
  ['nextjs', require('@site/static/img/category-nextjs.svg').default],
  ['typescript', require('@site/static/img/category-typescript.svg').default],
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
    <div className={clsx(styles.card, 'col col--3 padding-vert--lg')}>
      <Icon width={64} height={64} role="img" />
      <Heading as="h3">
        <Link to={link}>{label}</Link>
      </Heading>
      <p>{description}</p>
    </div>
  );
}

export default function HomepageLinks(): JSX.Element {
  return (
    <section>
      <div className="container">
        <div className="row">
          {categoryLinks.map((props, idx) => (
            <CategoryLink key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
