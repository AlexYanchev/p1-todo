import { FC } from 'react';
import styles from './LikeIcon.module.css';

type Props = {
  pressed: boolean;
  size: 'small' | 'large';
};

const LikeIcon: FC<Props> = ({ pressed, size }) => {
  return (
    <svg
      width={size === 'small' ? '20.000000' : '39.000000'}
      height={size === 'small' ? '20.000000' : '39.000000'}
      viewBox={size === 'small' ? '0 0 20 20' : '0 0 39 39'}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
    >
      <path
        id='like-328'
        d='M0 20L4 20L4 8L0 8L0 20ZM22 9C22 7.9 21.1 7 20 7L13.69 7L14.64 2.43L14.67 2.1C14.67 1.7 14.5 1.32 14.23 1.04L13.17 0L6.59 6.59C6.21 6.95 6 7.45 6 8L6 18C6 19.1 6.9 20 8 20L17 20C17.83 20 18.54 19.5 18.84 18.78L21.86 11.73C21.95 11.5 22 11.26 22 11L22 9Z'
        fill='#444444'
        fill-opacity={pressed ? '1.000000' : '0.33'}
        fill-rule='evenodd'
      />
    </svg>
  );
};
export default LikeIcon;
