import { FC } from 'react';
import styles from './ControlButtonsSharedTask.module.css';
import Button from '../Button/Button';

type Props = {
  //   onClickToOfferStep: (
  //     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => void;
  taskId: string;
};
const ControlButtonsSharedTask: FC<Props> = ({
  // onClickToOfferStep
  taskId,
}) => {
  return (
    <div className={styles.container}>
      <Button
        typeElement='button'
        type='button'
        name='offerStep'
        text='Предложить шаг'
        // onClick={onClickToOfferStep}
      />
    </div>
  );
};
export default ControlButtonsSharedTask;
