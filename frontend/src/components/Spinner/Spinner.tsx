import { FC, useMemo } from 'react';
import styles from './Spinner.module.css';

type Props = {
  sizeInEM?: number;
};

const Spinner: FC<Props> = ({ sizeInEM = 1 }) => {
  return (
    <span
      className={styles.loader}
      style={{
        width: `${sizeInEM}em`,
        height: `${sizeInEM}em`,
        borderTop: '3px solid #fff',
        borderRight: '3px solid transparent',
      }}
    ></span>
  );
};
export default Spinner;