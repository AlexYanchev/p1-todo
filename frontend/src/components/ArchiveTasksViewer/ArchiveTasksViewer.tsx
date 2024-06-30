import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getTasks } from '../../redux/slices/tasksSlice';
import { TaskTypeWithoutStepsField } from '../../types/taskType';
import Button from '../Button/Button';
import styles from './ArchiveTasksViewer.module.css';
import ArchiveTasksList from '../ArchiveTasksList/ArchiveTasksList';
import { getTasksAction } from '../../redux/actionsAndBuilders/tasks/getTasks';
import { getUserSlice } from '../../redux/slices/userSlice';
import Spinner from '../Spinner/Spinner';

type SimplifiedTasksList = {
  expiredTasks: Array<TaskTypeWithoutStepsField>;
  completedTasks: Array<TaskTypeWithoutStepsField>;
  idDownloadingDeletedTasks: boolean;
  openIs: 'expired' | 'completed' | 'deleted' | null;
};

const ArchiveTasksViewer = () => {
  const userSlice = useAppSelector(getUserSlice);
  const tasksSlice = useAppSelector(getTasks('own'));
  const [tasksList, setTasksList] = useState<SimplifiedTasksList>({
    expiredTasks: [],
    completedTasks: [],
    idDownloadingDeletedTasks: false,
    openIs: null,
  });

  const openExpired = tasksList.openIs === 'expired';
  const openCompleted = tasksList.openIs === 'completed';
  const openDeleted = tasksList.openIs === 'deleted';
  const deletedTasks = tasksSlice.filter((task) => task.willBeDeleted);

  const dispatch = useAppDispatch();

  const getExpiredTasks = () => {
    if (openExpired) {
      setTasksList({ ...tasksList, openIs: null });
      return;
    }
    setTasksList({
      ...tasksList,
      expiredTasks: tasksSlice.filter((task) => task.expired),
      openIs: 'expired',
    });
  };

  const getCompletedTasks = () => {
    if (openCompleted) {
      setTasksList({ ...tasksList, openIs: null });
      return;
    }

    setTasksList({
      ...tasksList,
      completedTasks: tasksSlice.filter((task) => task.complete),
      openIs: 'completed',
    });
  };

  const getDeletedTasks = () => {
    if (openDeleted) {
      setTasksList({ ...tasksList, openIs: null });
      return;
    }

    if (!userSlice.user) {
      return;
    }

    setTasksList({
      ...tasksList,
      idDownloadingDeletedTasks: true,
      openIs: 'deleted',
    });

    dispatch(
      getTasksAction({
        token: userSlice.user?.token,
        type: 'own',
        dispatch,
        getDeletedTasks: true,
      })
    )
      .unwrap()
      .then((response) => {
        setTasksList({
          ...tasksList,
          idDownloadingDeletedTasks: false,
          openIs: 'deleted',
        });
      })
      .catch((e) => {
        console.log('Произошла ошибка получения удаленных тасков. Ошибка: ', e);
      });
  };

  const setTextButton = (text: string, open: boolean) => {
    return (
      <div className={styles.text_button_container}>
        <span>{text}</span>
        <span>{open ? <>&#9650;</> : <>&#9660;</>}</span>
      </div>
    );
  };
  return (
    <div className={styles.container}>
      <Button
        type='button'
        typeElement='button'
        name='expiredTasks'
        text={setTextButton('Просроченные', openExpired)}
        className={styles.tasks_button}
        onClick={getExpiredTasks}
      />
      {openExpired && <ArchiveTasksList list={tasksList.expiredTasks} />}
      <Button
        type='button'
        typeElement='button'
        name='completedTasks'
        text={setTextButton('Завершенные', openCompleted)}
        className={styles.tasks_button}
        onClick={getCompletedTasks}
      />
      {openCompleted && <ArchiveTasksList list={tasksList.completedTasks} />}
      <Button
        type='button'
        typeElement='button'
        name='deletedTasks'
        text={setTextButton('Удаленные', openDeleted)}
        className={styles.tasks_button}
        onClick={getDeletedTasks}
      />
      {openDeleted && deletedTasks && (
        <ArchiveTasksList
          downloading={!tasksList.idDownloadingDeletedTasks && !deletedTasks}
          list={deletedTasks}
        />
      )}
    </div>
  );
};
export default ArchiveTasksViewer;
