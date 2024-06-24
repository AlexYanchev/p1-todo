import { FC, useState } from 'react';
import Button from '../Button/Button';
import styles from './ControlButtonsOwnTask.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteTaskAction } from '../../redux/actionsAndBuilders/tasks/deleteTask';
import { TasksType } from '../../types/taskType';
import { changeTaskActionThunk } from '../../redux/actionsAndBuilders/tasks/changeTask';
import { getSpecificTask } from '../../redux/slices/tasksSlice';

type Props = {
  taskId: string;
  type: TasksType;
};

const ControlButtonsOwnTask: FC<Props> = ({ taskId, type }) => {
  const userSlice = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentTask = useAppSelector(getSpecificTask(type, taskId));

  const deleteTask = () => {
    if (userSlice.user) {
      dispatch(
        deleteTaskAction({ id: taskId, token: userSlice.user.token, dispatch })
      );
    }
  };

  const addStep = () => {
    navigate(`/addStep/${taskId}`, { state: { background: location } });
  };

  const completeTask = () => {
    if (userSlice.user) {
      dispatch(
        changeTaskActionThunk({
          taskId,
          token: userSlice.user.token,
          dispatch,
          typeTask: type,
          fields: 'complete',
        })
      );
    }
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
        options={{
          disabled: currentTask?.complete,
        }}
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
        text={currentTask?.complete ? 'Восстановить' : 'Завершить'}
        onClick={completeTask}
      />
    </div>
  );
};
export default ControlButtonsOwnTask;
