import styles from './Task.module.css';
import { TasksType, TaskTypeWithoutStepsField } from '../../types/taskType';
import { FC, useMemo } from 'react';
import ControlButtons from '../ControlButtons/ControlButtons';
import LikeIcon from '../icons/LikeIcon/LikeIcon';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Step from '../Step/Step';
import { formatDate } from '../../utils';
import SwitchButton from '../SwitchButton/SwitchButton';
import {
  getSpecificSteps,
  getWaitingToDeleteTask,
} from '../../redux/slices/tasksSlice';
import { changePublicStatusTaskActionThunk } from '../../redux/actionsAndBuilders/tasks/changePublicStatusTask';
import { getUserSlice } from '../../redux/slices/userSlice';
import { deleteTaskFromStore } from '../../redux/slices/tasksSlice';
import { putLikeToTaskActionThunk } from '../../redux/actionsAndBuilders/tasks/putLikeToTask';

type Props = {
  task: TaskTypeWithoutStepsField;
  type: TasksType;
};

const Task: FC<Props> = ({ task, type }) => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(getUserSlice);
  const specificSteps = useAppSelector(getSpecificSteps(task._id)) || [];
  const waitingToDeleteTask = useAppSelector(getWaitingToDeleteTask);
  const needDelete = task._id === waitingToDeleteTask;
  const ownTask = type === 'own';
  const sharedTask = type === 'shared';

  const pressedLikeIcon = useMemo(() => {
    if (userSlice.user && task.likes.includes(userSlice.user._id) && !ownTask) {
      return true;
    } else {
      return false;
    }
  }, [task.likes]);

  if (needDelete) {
    setTimeout(() => {
      dispatch(deleteTaskFromStore({ taskId: waitingToDeleteTask }));
    }, 1100);
  }

  const [createdAt, expiredAt] = useMemo(() => {
    return [formatDate(task.createdAt), formatDate(task.expiredAt)];
  }, [task.createdAt, task.expiredAt]);

  const changePublicStatusTask = () => {
    if (userSlice.user) {
      dispatch(
        changePublicStatusTaskActionThunk({
          taskId: task._id,
          token: userSlice.user.token,
          dispatch,
        })
      );
    }
  };

  const putLike = () => {
    if (ownTask) {
      return;
    } else {
      if (userSlice.user) {
        dispatch(
          putLikeToTaskActionThunk({
            taskId: task._id,
            token: userSlice.user.token,
            typeTask: type,
            dispatch,
          })
        );
      }
    }
  };

  return (
    <article
      className={`${styles.task_container} ${needDelete && styles.fall}`}
    >
      <div className={styles.title}>
        <p className={task.complete ? styles.complete : ''}>{task.title}</p>
        <span className={styles.title_date}>{createdAt}</span>
      </div>
      {task.complete ? (
        <p className={styles.steps_container}>ЗАВЕРШЕНО</p>
      ) : (
        <ol className={styles.steps_container}>
          {specificSteps.map((step) => {
            return (
              <li className={styles.step_container} key={step._id}>
                <Step step={step} shared={sharedTask} />
              </li>
            );
          })}
        </ol>
      )}
      <div className={styles.control_buttons_container}>
        <ControlButtons
          type={type}
          taskId={task._id}
          taskBelongsCurrentUser={task.owner === userSlice.user?._id}
        />
        <p className={styles.expiredAt}>Срок выполнения: {expiredAt}</p>
      </div>

      <div className={styles.footer_container}>
        <dl className={styles.likes}>
          <dt onClick={putLike}>
            <LikeIcon pressed={pressedLikeIcon} size='small' />
          </dt>
          <dd>{task.likes.length}</dd>
        </dl>
        {task.owner === userSlice.user?._id && (
          <SwitchButton
            labelText='Публичная'
            publicTask={task.public}
            onChange={changePublicStatusTask}
          />
        )}
      </div>
    </article>
  );
};
export default Task;
