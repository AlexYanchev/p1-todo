import styles from './UniversalForm.module.css';
import { FC, SyntheticEvent } from 'react';
import Input, { InputElementProps } from '../Input/Input';
import Button, { ButtonElementProps } from '../Button/Button';

type Props = {
  elements: Array<InputElementProps | ButtonElementProps>;
  onSubmit: (e?: SyntheticEvent) => void;
};

const UniversalForm: FC<Props> = ({ elements, onSubmit }) => {
  return (
    <form onSubmit={onSubmit}>
      {elements.map((element, index) =>
        element.typeElement === 'button' ? (
          <Button {...element} key={`button-form-${index}`} />
        ) : (
          <Input {...element} key={`input-form-${index}`} />
        )
      )}
    </form>
  );
};
export default UniversalForm;
