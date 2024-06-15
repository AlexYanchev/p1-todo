import { FC, useMemo } from 'react';
import styles from './CloseIcon.module.css';

export enum CloseIconSize {
  SMALL = 'SMALL',
  LARGE = 'LARGE',
}

type Props = {
  size?: CloseIconSize;
  color?: string;
  onClick: (e: React.MouseEvent<HTMLOrSVGElement, MouseEvent>) => void;
};

const CloseIcon: FC<Props> = ({ size, color, onClick }) => {
  const [sizeIcon, viewBox] = useMemo(() => {
    switch (size) {
      case CloseIconSize.LARGE: {
        return ['30.0', '0 0 30.0 30.0'];
      }
      case CloseIconSize.SMALL: {
        return ['15.0', '0 0 15.0 15.0'];
      }
      default:
        return ['22.0', '0 0 22.0 22.0'];
    }
  }, [size]);

  return (
    <svg
      onClick={onClick}
      width={sizeIcon}
      height={sizeIcon}
      viewBox={viewBox}
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      xmlnsXlink='http://www.w3.org/1999/xlink'
    >
      <line
        id='Line 3'
        x1='0.707108'
        y1='0.707107'
        x2='21.920324'
        y2='21.920332'
        stroke={color || '#C4C4C4'}
        strokeOpacity='1.000000'
        strokeWidth='2.000000'
      />
      <line
        id='Line 4'
        x1='21.920486'
        y1='0.707107'
        x2='0.707273'
        y2='21.920334'
        stroke={color || '#C4C4C4'}
        strokeOpacity='1.000000'
        strokeWidth='2.000000'
      />
    </svg>
  );
};
export default CloseIcon;
