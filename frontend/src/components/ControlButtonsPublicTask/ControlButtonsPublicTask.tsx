import { FC } from 'react';
import Button from '../Button/Button';
import styles from './ControlButtonsPublicTask.module.css';

type Props = {
  //   onClickJoinTask: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  taskId: string;
};

const ControlButtonsPublicTask: FC<Props> = ({
  // onClickJoinTask,
  taskId,
}) => {
  return (
    <div className={styles.container}>
      <Button
        typeElement='button'
        type='button'
        name='joinToTask'
        text='Присоединиться'
        // onClick={onClickJoinTask}
      />
    </div>
  );
};
export default ControlButtonsPublicTask;
