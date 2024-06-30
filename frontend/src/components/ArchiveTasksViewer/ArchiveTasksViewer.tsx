import { Suspense, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getTasks } from '../../redux/slices/tasksSlice';
import { ArchiveTasksFileds } from '../../types/taskType';
import Button from '../Button/Button';
import styles from './ArchiveTasksViewer.module.css';
import ArchiveTasksList from '../ArchiveTasksList/ArchiveTasksList';
import { getTasksAction } from '../../redux/actionsAndBuilders/tasks/getTasks';
import { getUserSlice } from '../../redux/slices/userSlice';
import Notifications from '../Notifications/Notifications';
import { customFetch } from '../../requests';
import Spinner from '../Spinner/Spinner';

type SimplifiedTasksList = {
  expiredTasks: Array<ArchiveTasksFileds>;
  completedTasks: Array<ArchiveTasksFileds>;
  deletedTasks: Array<ArchiveTasksFileds>;
  openIs: 'expired' | 'completed' | 'deleted' | null;
};

const ArchiveTasksViewer = () => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(getUserSlice);
  const [tasksList, setTasksList] = useState<SimplifiedTasksList>({
    expiredTasks: [],
    completedTasks: [],
    deletedTasks: [],
    openIs: null,
  });

  const openExpired = tasksList.openIs === 'expired';
  const openCompleted = tasksList.openIs === 'completed';
  const openDeleted = tasksList.openIs === 'deleted';

  useEffect(() => {
    if (userSlice.user) {
      customFetch({
        to: '/getArchiveTasks',
        method: 'GET',
        dispatch,
        headers: {
          Authorization: userSlice.user?.token,
        },
      })
        .then((res: { data: Array<ArchiveTasksFileds> }) => {
          setTasksList({
            ...tasksList,
            expiredTasks: res.data.filter((task) => task.expired),
            completedTasks: res.data.filter((task) => task.complete),
            deletedTasks: res.data.filter((task) => task.willBeDeleted),
          });
        })
        .catch((err) => {
          console.log(
            'Произошла ошибка запроса архивных тасков. Ошибка: ',
            err
          );
        });
    }
  }, []);

  const getExpiredTasks = () => {
    if (openExpired) {
      setTasksList({ ...tasksList, openIs: null });
      return;
    }
    setTasksList({
      ...tasksList,
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
      openIs: 'completed',
    });
  };

  const getDeletedTasks = () => {
    if (openDeleted) {
      setTasksList({ ...tasksList, openIs: null });
      return;
    }
    setTasksList({
      ...tasksList,
      openIs: 'deleted',
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
    <Suspense fallback={<Spinner />}>
      <div className={styles.container}>
        <Notifications quantity={tasksList.expiredTasks.length}>
          <Button
            type='button'
            typeElement='button'
            name='expiredTasks'
            text={setTextButton('Просроченные', openExpired)}
            className={styles.tasks_button}
            onClick={getExpiredTasks}
          />
        </Notifications>

        {openExpired && <ArchiveTasksList list={tasksList.expiredTasks} />}
        <Notifications quantity={tasksList.completedTasks.length}>
          <Button
            type='button'
            typeElement='button'
            name='completedTasks'
            text={setTextButton('Завершенные', openCompleted)}
            className={styles.tasks_button}
            onClick={getCompletedTasks}
          />
        </Notifications>
        {openCompleted && <ArchiveTasksList list={tasksList.completedTasks} />}
        <Notifications quantity={tasksList.deletedTasks.length}>
          <Button
            type='button'
            typeElement='button'
            name='deletedTasks'
            text={setTextButton('Удаленные', openDeleted)}
            className={styles.tasks_button}
            onClick={getDeletedTasks}
          />
        </Notifications>
        {openDeleted && <ArchiveTasksList list={tasksList.deletedTasks} />}
      </div>
    </Suspense>
  );
};
export default ArchiveTasksViewer;
