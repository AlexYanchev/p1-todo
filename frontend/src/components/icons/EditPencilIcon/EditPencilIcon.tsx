import { FC } from 'react';
import styles from './EditPencilIcon.module.css';

type Props = {
  size: string;
};
const EditPencilIcon: FC<Props> = ({ size }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
    >
      <path
        id='矢量 23'
        d='M0 30.87L0 39L8.12 39L32.08 15.04L23.96 6.91L0 30.87ZM38.36 8.75C39.21 7.91 39.21 6.54 38.36 5.7L33.29 0.63C32.45 -0.22 31.08 -0.22 30.24 0.63L26.27 4.59L34.4 12.72L38.36 8.75Z'
        fill='#444444'
        fillOpacity='1.000000'
        fillRule='evenodd'
      />
    </svg>
  );
};
export default EditPencilIcon;
