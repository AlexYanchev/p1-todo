import styles from './Task.module.css';
import { TasksType, TaskTypeWithoutStepsField } from '../../types/taskType';
import { FC, useMemo, useState } from 'react';
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
import { getUserSlice } from '../../redux/slices/userSlice';
import { deleteTaskFromStore } from '../../redux/slices/tasksSlice';
import { changeTaskActionThunk } from '../../redux/actionsAndBuilders/tasks/changeTask';
import Button from '../Button/Button';
import Popup from '../Popup/Popup';
import FriendsListForShare from '../FriendsListForShare/FriendsListForShare';

type Props = {
  task: TaskTypeWithoutStepsField;
  type: TasksType;
};

const Task: FC<Props> = ({ task, type }) => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(getUserSlice);
  const specificSteps = useAppSelector(getSpecificSteps(task._id)) || [];
  const waitingToDeleteTask = useAppSelector(getWaitingToDeleteTask);
  const [openPopupFriendsList, setOpenPopupFriendsList] = useState(false);
  const needDelete = task._id === waitingToDeleteTask;
  const ownTask = task.owner === userSlice.user?._id;
  const sharedTask = type === 'shared';
  const pending = useAppSelector((state) => state.tasks.status === 'pending');

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
    if (pending) {
      return;
    }
    if (userSlice.user) {
      dispatch(
        changeTaskActionThunk({
          taskId: task._id,
          token: userSlice.user.token,
          dispatch,
          fields: 'public',
          typeTask: type,
        })
      );
    }
  };

  const putLike = () => {
    if (ownTask || pending) {
      return;
    } else {
      if (userSlice.user) {
        dispatch(
          changeTaskActionThunk({
            taskId: task._id,
            token: userSlice.user.token,
            dispatch,
            fields: 'likes',
            typeTask: type,
          })
        );
      }
    }
  };

  return (
    <article
      className={`${styles.task_container} ${needDelete && styles.fall}`}
    >
      {task.complete ? (
        <p className={styles.task_complete}>Задача завершена</p>
      ) : (
        <>
          <a href={`#steps-for-${task._id}`}>
            <div className={styles.title_group}>
              <p className={styles.title_date}>{createdAt}</p>
              <p className={styles.title}>{task.title}</p>
            </div>
          </a>

          <a href={`#steps-for-${task._id}`} className={styles.show_steps_link}>
            Посмотреть шаги
          </a>
        </>
      )}

      <div className={styles.control_buttons_container}>
        <ControlButtons
          type={type}
          taskId={task._id}
          taskBelongsCurrentUser={task.owner === userSlice.user?._id}
          classNameButton='button_control'
          classNameContainer={styles.buttons_container}
        />

        {!task.complete && (
          <Button
            typeElement='button'
            type='button'
            name='share'
            text='Поделится'
            className='button_control'
            onClick={() => setOpenPopupFriendsList(true)}
          />
        )}
      </div>

      {!task.complete && (
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
      )}
      <p className={styles.expiredAt}>Срок выполнения: {expiredAt}</p>

      <div id={`steps-for-${task._id}`} className={styles.lightbox}>
        <div className={styles.lightbox_content}>
          <a href='#' className={styles.close_lightbox}></a>
          {specificSteps.length ? (
            <ol className={styles.lightbox_steps_container}>
              {specificSteps.map((step) => {
                return (
                  <li className={styles.step_container} key={step._id}>
                    <Step step={step} shared={sharedTask} />
                  </li>
                );
              })}
            </ol>
          ) : (
            <p>Шагов нет</p>
          )}
        </div>
      </div>

      {openPopupFriendsList && (
        <Popup
          closePopupCb={() => setOpenPopupFriendsList(false)}
          format='friendList'
          element={
            <FriendsListForShare
              idTask={task._id}
              cb={() => setOpenPopupFriendsList(false)}
            />
          }
        />
      )}
    </article>
  );
  // return (
  //   <article
  //     className={`${styles.task_container} ${needDelete && styles.fall}`}
  //   >
  //     <div className={styles.title}>
  //       <p className={task.complete ? styles.complete : ''}>{task.title}</p>
  //       <span className={styles.title_date}>{createdAt}</span>
  //     </div>
  //     {task.complete ? (
  //       <p className={styles.steps_container}>ЗАВЕРШЕНО</p>
  //     ) : (
  //       <ol className={styles.steps_container}>
  //         {specificSteps.map((step) => {
  //           return (
  //             <li className={styles.step_container} key={step._id}>
  //               <Step step={step} shared={sharedTask} />
  //             </li>
  //           );
  //         })}
  //       </ol>
  //     )}
  //     <div className={styles.control_buttons_container}>
  //       <ControlButtons
  //         type={type}
  //         taskId={task._id}
  //         taskBelongsCurrentUser={task.owner === userSlice.user?._id}
  //       />
  //       <p className={styles.expiredAt}>Срок выполнения: {expiredAt}</p>
  //     </div>

  //     <div className={styles.footer_container}>
  //       <dl className={styles.likes}>
  //         <dt onClick={putLike}>
  //           <LikeIcon pressed={pressedLikeIcon} size='small' />
  //         </dt>
  //         <dd>{task.likes.length}</dd>
  //       </dl>
  //       <Button
  //         typeElement='button'
  //         type='button'
  //         name='share'
  //         text='Поделится'
  //         onClick={() => setOpenPopupFriendsList(true)}
  //       />
  //       {task.owner === userSlice.user?._id && (
  //         <SwitchButton
  //           labelText='Публичная'
  //           publicTask={task.public}
  //           onChange={changePublicStatusTask}
  //         />
  //       )}
  //     </div>

  //     {openPopupFriendsList && (
  //       <Popup
  //         closePopupCb={() => setOpenPopupFriendsList(false)}
  //         format='friendList'
  //         element={
  //           <FriendsListForShare
  //             idTask={task._id}
  //             cb={() => setOpenPopupFriendsList(false)}
  //           />
  //         }
  //       />
  //     )}
  //   </article>
  // );
};
export default Task;
