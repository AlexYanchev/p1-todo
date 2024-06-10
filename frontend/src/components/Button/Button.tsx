import styles from './Button.module.css';
import { FC, SyntheticEvent } from 'react';

export type ButtonElementProps = {
  typeElement: 'button';
  type: 'button' | 'submit' | 'reset';
  name: string;
  text: string;
  className?: string;
  onClick?: (e?: SyntheticEvent) => void;
  options?: {
    autofocus?: boolean;
    disabled?: boolean;
  };
};

const Button: FC<ButtonElementProps> = ({
  typeElement,
  text,
  type,
  name,
  onClick,
  className,
  options,
}) => {
  return (
    <button
      className={`${styles.button} ${className || ''}`}
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
