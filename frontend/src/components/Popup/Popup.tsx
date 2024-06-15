import { FC, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Popup.module.css';
import { useNavigate, useLocation } from 'react-router-dom';
import CloseIcon from '../icons/CloseIcon/CloseIcon';

type Props = {
  element: ReactNode;
};

const Popup: FC<Props> = ({ element }) => {
  const rootPortal = document.getElementById('popup');
  const navigate = useNavigate();
  const closePopup = () => {
    navigate(-1);
  };

  if (!rootPortal) {
    return <></>;
  }
  return createPortal(
    <div className={styles.background} onClick={closePopup}>
      <div className={styles.wrapper}>
        <CloseIcon onClick={closePopup} />
        {element}
      </div>
    </div>,
    rootPortal
  );
};
export default Popup;
