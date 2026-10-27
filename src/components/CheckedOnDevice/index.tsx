import type { ReactNode } from 'react';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

type Props = {
  platform: 'iOS' | 'Android';
  /** OS version, as in "Android 16" */
  version: string;
  /** Date of the check, YYYY-MM-DD */
  date: string;
  /** The Field Notes post with the details */
  note: string;
};

const dateFormat = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

/** A mark next to a claim that was checked on a device */
export default function CheckedOnDevice({
  platform,
  version,
  date,
  note,
}: Props): ReactNode {
  return (
    <span className={styles.mark}>
      <span aria-hidden="true">✓</span> Checked on {platform} {version},{' '}
      <time dateTime={date}>{dateFormat.format(new Date(date))}</time> ·{' '}
      <Link to={note}>field note</Link>
    </span>
  );
}
