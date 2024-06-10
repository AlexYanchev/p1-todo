import styles from './Input.module.css';
import { FC, SyntheticEvent } from 'react';

export type InputElementProps = {
  typeElement: 'input';
  type:
    | 'checkbox'
    | 'color'
    | 'date'
    | 'email'
    | 'file'
    | 'image'
    | 'number'
    | 'password'
    | 'radio'
    | 'text'
    | 'tel';
  name: string;
  label: string;
  value: string;
  placeholder?: string;
  className?: string;
  classNameContainer?: string;
  classNameLabel?: string;
  onChange?: (e?: SyntheticEvent) => void;
  options?: {
    autofocus?: boolean;
    disabled?: boolean;
    checked?: boolean;
    max?: string;
    min?: string;
    maxlength?: number;
    minlength?: number;
    pattern?: string;
    readonly?: boolean;
  };
};

const Input: FC<InputElementProps> = ({
  typeElement,
  classNameContainer,
  classNameLabel,
  className,
  label,
  name,
  type,
  value,
  onChange,
  placeholder,
  options,
}) => {
  return (
    <label className={`${styles.container} ${classNameContainer || ''}`}>
      <span className={`${styles.label} ${classNameLabel || ''}`}>{label}</span>
      <input
        className={`${styles.input} ${className || ''}`}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...options}
      />
    </label>
  );
};
export default Input;
