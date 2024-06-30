import { FC, ReactElement, ReactNode } from 'react';
import styles from './Notifications.module.css';

type Props = {
  show?: boolean;
  quantity: number;
  children: ReactNode | ReactElement;
  options?: Partial<{
    left: `${string}px`;
    top: `${string}px`;
    right: `${string}px`;
    bottom: `${string}px`;
    backgroundColor: string;
    color: string;
    size: `${string}rem`;
    padding: `${string}px`;
    fontSize: `${string}rem`;
  }>;
};

const Notifications: FC<Props> = ({
  show = true,
  quantity,
  children,
  options,
}) => {
  const left = options?.left || `-10px`;
  const top = options?.top || `-10px`;
  const right = options?.right || `-10px`;
  const bottom = options?.bottom || `-10px`;
  const backgroundColor = options?.backgroundColor || `rgb(147, 218, 249)`;
  const color = options?.color || `rgba(0, 0, 0)`;
  const size = options?.size || `0.9rem`;
  const padding = options?.padding || `2px`;
  const fontSize = options?.fontSize || `0.8rem`;

  const resultStyle: any = {
    position: 'absolute',
    left,
    top,
    right,
    bottom,
    display: 'flex',
    backgroundColor,
    color,
    width: size,
    height: size,
    padding,
    fontSize,
    borderRadius: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 0px 5px rgba(0, 0, 0)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  };

  if (resultStyle.left) {
    delete resultStyle.right;
  } else if (resultStyle.right) {
    delete resultStyle.left;
  }

  if (resultStyle.top) {
    delete resultStyle.bottom;
  } else if (resultStyle.bottom) {
    delete resultStyle.top;
  }

  if (!show) {
    return <></>;
  }
  return (
    <div className={styles.notifications_container}>
      <span style={resultStyle}>{quantity}</span>
      {children}
    </div>
  );
};
export default Notifications;
