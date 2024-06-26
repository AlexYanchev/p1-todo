import { FC, useState } from 'react';
import Button from '../Button/Button';
import styles from './ControlButtonsPublicTask.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { changeTaskActionThunk } from '../../redux/actionsAndBuilders/tasks/changeTask';
import { TasksType } from '../../types/taskType';
import { getSpecificTask } from '../../redux/slices/tasksSlice';
import Spinner from '../Spinner/Spinner';

type Props = {
  taskId: string;
  type: TasksType;
};

const ControlButtonsPublicTask: FC<Props> = ({ taskId, type }) => {
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const currentTask = useAppSelector(getSpecificTask(type, taskId));
  const pending = useAppSelector((state) => state.tasks.status === 'pending');
  const [action, setAction] = useState({
    joinToTask: false,
  });
  const spinner = pending && action.joinToTask;

  console.log(action);
  const joinToTask = () => {
    if (userSlice.user) {
      dispatch(
        changeTaskActionThunk({
          taskId,
          token: userSlice.user.token,
          dispatch,
          typeTask: type,
          fields: 'members',
        })
      ).then(() => {
        setAction({ ...action, joinToTask: false });
      });
    }

    setAction({ ...action, joinToTask: true });
  };
  return (
    <div className={styles.container}>
      {
        <Button
          typeElement='button'
          type='button'
          name='joinToTask'
          text={
            currentTask!.members.includes(userSlice.user!._id) ? (
              'Отсоединиться'
            ) : spinner ? (
              <Spinner />
            ) : (
              'Присоединиться'
            )
          }
          onClick={joinToTask}
        />
      }
    </div>
  );
};
export default ControlButtonsPublicTask;
