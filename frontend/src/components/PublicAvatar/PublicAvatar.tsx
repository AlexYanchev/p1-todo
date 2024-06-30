import { FC } from 'react';
import styles from './PublicAvatar.module.css';
import DefaultAvatarIcon from '../icons/DefaultAvatarIcon/DefaultAvatarIcon';

type Props = {
  srcAvatar: string;
};
const PublicAvatar: FC<Props> = ({ srcAvatar }) => {
  return (
    <>
      {Boolean(srcAvatar) ? (
        <img
          alt='Аватар пользователя'
          className={styles.avatar}
          src={srcAvatar}
        />
      ) : (
        <DefaultAvatarIcon width='50px' height='50px' />
      )}
    </>
  );
};
export default PublicAvatar;
