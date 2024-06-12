import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Popup.module.css';

type Props = {
  element: ReactNode;
};

const Popup: FC<Props> = ({ element }) => {
  const rootPortal = document.getElementById('popup');

  if (!rootPortal) {
    return <></>;
  }
  return createPortal(
    <div className={styles.background}>
      <div className={styles.wrapper}>{element}</div>
    </div>,
    rootPortal
  );
};
export default Popup;
