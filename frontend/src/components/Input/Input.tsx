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
  value?: string;
  placeholder?: string;
  className?: string;
  classNameContainer?: string;
  classNameLabel?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
  typeElement = 'input',
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
  const styleContainer = classNameContainer
    ? classNameContainer
    : styles.container || '';

  const styleLabel = classNameLabel ? classNameLabel : styles.label || '';

  const styleInput = className ? className : styles.input || '';

  return (
    <label className={styleContainer}>
      <span className={styleLabel}>{label}</span>
      <input
        className={styleInput}
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
