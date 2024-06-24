import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Popup.module.css';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '../icons/CloseIcon/CloseIcon';

type Props = {
  element: ReactNode;
};

const Popup: FC<Props> = ({ element }) => {
  const rootPortal = document.getElementById('popup');
  const navigate = useNavigate();
  const closePopup = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.currentTarget === e.target) {
      navigate(-1);
    }
    return;
  };

  if (!rootPortal) {
    return <></>;
  }
  return createPortal(
    <div className={styles.background} onClick={closePopup}>
      <div className={styles.wrapper}>
        <div className={styles.close_icon}>
          <CloseIcon onClick={closePopup} />
        </div>
        {element}
      </div>
    </div>,
    rootPortal
  );
};
export default Popup;
