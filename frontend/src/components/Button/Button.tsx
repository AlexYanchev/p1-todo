import styles from './Button.module.css';
import { FC, ReactElement, ReactNode, SyntheticEvent } from 'react';

export type ButtonElementProps = {
  typeElement: 'button';
  type: 'button' | 'submit' | 'reset';
  name: string;
  text: string | ReactNode | ReactElement;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  options?: {
    autofocus?: boolean;
    disabled?: boolean;
  };
};

const Button: FC<ButtonElementProps> = ({
  typeElement = 'button',
  text,
  type,
  name,
  onClick,
  className,
  options,
}) => {
  return (
    <button
      className={`${styles.button || ''} ${className || ''}`}
      type={type}
      name={name}
      onClick={onClick}
      {...options}
    >
      {text}
    </button>
  );
};
export default Button;
