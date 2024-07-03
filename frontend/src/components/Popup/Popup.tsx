import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Popup.module.css';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '../icons/CloseIcon/CloseIcon';

type Props = {
  element: ReactNode;
  format?: 'classic' | 'friendList';
  closePopupCb?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};

const Popup: FC<Props> = ({ format = 'classic', element, closePopupCb }) => {
  const rootPortal = document.getElementById('popup');
  const navigate = useNavigate();
  const wrapperStyle =
    format === 'classic' ? styles.wrapper_classic : styles.wrapper_friendList;
  const closePopup = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (e.currentTarget === e.target) {
      closePopupCb ? closePopupCb() : navigate(-1);
    }
    return;
  };

  if (!rootPortal) {
    return <></>;
  }

  return createPortal(
    <div className={styles.background} onClick={closePopup}>
      <div className={wrapperStyle}>
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
