import { FC, useState } from 'react';
import Button from '../Button/Button';
import styles from './ControlButtonsOwnTask.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import { deleteTaskAction } from '../../redux/actionsAndBuilders/tasks/deleteTask';
import { TasksType } from '../../types/taskType';
import { changeTaskActionThunk } from '../../redux/actionsAndBuilders/tasks/changeTask';
import { getSpecificTask } from '../../redux/slices/tasksSlice';
import Spinner from '../Spinner/Spinner';

type Props = {
  taskId: string;
  type: TasksType;
};

const ControlButtonsOwnTask: FC<Props> = ({ taskId, type }) => {
  const userSlice = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [action, setAction] = useState({
    addStep: false,
    deleteTask: false,
    completeTask: false,
  });
  const currentTask = useAppSelector(getSpecificTask(type, taskId));
  const pending = useAppSelector((state) => state.tasks.status === 'pending');

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
    setAction({ ...action, completeTask: true });
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
          disabled: currentTask?.complete || pending,
        }}
      />
      <Button
        typeElement='button'
        type='button'
        name='deleteTask'
        text={pending && action.deleteTask ? <Spinner /> : 'Удалить'}
        onClick={deleteTask}
        options={{ disabled: pending }}
      />
      <Button
        typeElement='button'
        type='button'
        name='completeTask'
        text={
          currentTask?.complete ? (
            'Восстановить'
          ) : pending && action.completeTask ? (
            <Spinner />
          ) : (
            'Завершить'
          )
        }
        onClick={completeTask}
        options={{ disabled: pending }}
      />
    </div>
  );
};
export default ControlButtonsOwnTask;
