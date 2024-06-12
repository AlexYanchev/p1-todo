import { FC } from 'react';
import Button from '../Button/Button';
import styles from './ControlButtonsOwnTask.module.css';

type Props = {
  //   onClickAddStep: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  //   onClickDeleteTask: (
  //     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => void;
  //   onClickCompleteTask: (
  //     e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  //   ) => void;
  taskId: string;
};

const ControlButtonsOwnTask: FC<Props> = ({
  //   onClickAddStep,
  //   onClickDeleteTask,
  //   onClickCompleteTask,
  taskId,
}) => {
  return (
    <div className={styles.container}>
      <Button
        typeElement='button'
        type='button'
        name='addStep'
        text='Добавить шаг'
        className={styles.top_button}
        // onClick={onClickAddStep}
      />
      <Button
        typeElement='button'
        type='button'
        name='deleteTask'
        text='Удалить'
        // onClick={onClickDeleteTask}
      />
      <Button
        typeElement='button'
        type='button'
        name='completeTask'
        text='Завершить'
        // onClick={onClickCompleteTask}
      />
    </div>
  );
};
export default ControlButtonsOwnTask;
