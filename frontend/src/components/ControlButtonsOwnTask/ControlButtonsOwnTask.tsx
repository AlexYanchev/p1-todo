import { FC } from 'react';
import Button from '../Button/Button';
import styles from './ControlButtonsOwnTask.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { deleteTaskAction } from '../../redux/actionsAndBuilders/tasks';

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
  const userSlice = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const deleteTask = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (userSlice.user) {
      dispatch(
        deleteTaskAction({ id: taskId, token: userSlice.user.token, dispatch })
      );
    }
  };

  const addStep = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    navigate(`/addStep/${taskId}`, { state: { background: location } });
  };
  return (
    <div className={styles.container}>
      <Button
        typeElement='button'
        type='button'
        name='addStep'
        text='Добавить шаг'
        className={styles.top_button}
        onClick={addStep}
      />
      <Button
        typeElement='button'
        type='button'
        name='deleteTask'
        text='Удалить'
        onClick={deleteTask}
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
