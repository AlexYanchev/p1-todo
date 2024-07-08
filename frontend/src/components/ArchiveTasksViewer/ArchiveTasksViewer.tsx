import { Suspense, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Button from '../Button/Button';
import styles from './ArchiveTasksViewer.module.css';
import ArchiveTasksList from '../ArchiveTasksList/ArchiveTasksList';
import { getUserToken } from '../../redux/slices/userSlice';
import Notifications from '../Notifications/Notifications';
import Spinner from '../Spinner/Spinner';
import { getArchiveTasksThunkAction } from '../../redux/actionsAndBuilders/profileData/archiveTasks/getArchiveTasks';
import { getArchiveTasks } from '../../redux/slices/profileDataSlice';

const ArchiveTasksViewer = () => {
  const dispatch = useAppDispatch();
  const userToken = useAppSelector(getUserToken);
  const { expiredTasks, completedTasks, deletedTasks } =
    useAppSelector(getArchiveTasks);
  const [openIs, setOpenIs] = useState<
    'expired' | 'completed' | 'deleted' | null
  >(null);

  const openExpired = openIs === 'expired';
  const openCompleted = openIs === 'completed';
  const openDeleted = openIs === 'deleted';

  useEffect(() => {
    if (userToken) {
      dispatch(getArchiveTasksThunkAction({ token: userToken, dispatch }))
        .then((res) => {
          console.log('Успешно запросили архивные таски. Ошибка: ');
        })
        .catch((err) => {
          console.log(
            'Произошла ошибка запроса архивных тасков. Ошибка: ',
            err
          );
        });
    }
  }, []);

  const openExpiredTasks = () => {
    if (openExpired) {
      setOpenIs(null);
      return;
    }
    setOpenIs('expired');
  };

  const openCompletedTasks = () => {
    if (openCompleted) {
      setOpenIs(null);
      return;
    }
    setOpenIs('completed');
  };

  const openDeletedTasks = () => {
    if (openDeleted) {
      setOpenIs(null);
      return;
    }
    setOpenIs('deleted');
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
      <Notifications quantity={expiredTasks.length}>
        <Button
          type='button'
          typeElement='button'
          name='expiredTasks'
          text={setTextButton('Просроченные', openExpired)}
          className={styles.tasks_button}
          onClick={openExpiredTasks}
        />
      </Notifications>

      {openExpired && (
        <Suspense fallback={<Spinner />}>
          <ArchiveTasksList list={expiredTasks} />
        </Suspense>
      )}
      <Notifications quantity={completedTasks.length}>
        <Button
          type='button'
          typeElement='button'
          name='completedTasks'
          text={setTextButton('Завершенные', openCompleted)}
          className={styles.tasks_button}
          onClick={openCompletedTasks}
        />
      </Notifications>
      {openCompleted && (
        <Suspense fallback={<Spinner />}>
          <ArchiveTasksList list={completedTasks} />
        </Suspense>
      )}
      <Notifications quantity={deletedTasks.length}>
        <Button
          type='button'
          typeElement='button'
          name='deletedTasks'
          text={setTextButton('Удаленные', openDeleted)}
          className={styles.tasks_button}
          onClick={openDeletedTasks}
        />
      </Notifications>
      {openDeleted && (
        <Suspense fallback={<Spinner />}>
          <ArchiveTasksList list={deletedTasks} />
        </Suspense>
      )}
    </div>
  );
};
export default ArchiveTasksViewer;
