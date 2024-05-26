import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import HomepageLinks from '@site/src/components/HomepageLinks';
import Heading from '@theme/Heading';
import Layout from '@theme/Layout';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="hero hero--dark">
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">
          Here are answers to some of the most common questions about JavaScript
          and React that you might be asked in a job interview.
        </p>
        <p>
          All the info on this site has been pulled together from different
          sources, so it might not be 100% accurate or complete. Please feel
          free to submit pull requests with any updates or changes you think are
          needed.
        </p>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
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
