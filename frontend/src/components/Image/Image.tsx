import { FC } from 'react';
import styles from './Image.module.css';
import { useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import DefaultAvatarIcon from '../icons/DefaultAvatarIcon/DefaultAvatarIcon';
import EditPencilIcon from '../icons/EditPencilIcon/EditPencilIcon';
import Button from '../Button/Button';
import { useLocation, useNavigate } from 'react-router-dom';

type Props = {
  src?: string;
  alt: string;
  width: string;
  height: string;
  className?: string;
  type?: 'avatar';
};

const Image: FC<Props> = ({ src, alt, width, height, className, type }) => {
  const userSlice = useAppSelector(getUserSlice);
  const location = useLocation();
  const navigate = useNavigate();
  const defaultAvatar = type === 'avatar' && !Boolean(userSlice.user?.avatar);

  const setAvatar = () => {
    navigate('/setAvatar', { state: { background: location } });
  };

  return (
    <div className={styles.container}>
      {defaultAvatar ? (
        <DefaultAvatarIcon width={width} height={height} />
      ) : (
        <img
          src={userSlice.user?.avatar}
          alt={alt}
          style={{
            width,
            height,
          }}
          className={`${styles.img} ${className || ''}`}
        />
      )}
      <Button
        typeElement='button'
        type='button'
        name='changeAvatar'
        text={<EditPencilIcon size='40' />}
        onClick={setAvatar}
        className={styles.edit}
      />
    </div>
  );
};

export default Image;
