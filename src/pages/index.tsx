import type { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageLinks from '@site/src/components/HomepageLinks';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';
import clsx from 'clsx';
import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBg, 'hero')}>
      <div className="container">
        <Heading
          as="h1"
          className={clsx(styles.title, 'hero__title text--primary')}
        >
          {siteConfig.title}
        </Heading>
        <p className={clsx(styles.subtitle, 'hero__subtitle')}>
          Model answers to frontend interview questions, with follow-up
          questions and common mistakes: to refresh before an interview, glance
          at while answering, or use when interviewing others.
        </p>
        <p>Found a mistake? Pull requests are welcome.</p>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <HomepageHeader />
      <main className="padding--lg">
        <HomepageLinks />
      </main>
    </Layout>
  );
}
