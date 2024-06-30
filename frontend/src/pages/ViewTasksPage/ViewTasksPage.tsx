import { FC, useEffect } from 'react';
import styles from './ViewTasksPage.module.css';
import { TasksType } from '../../types/taskType';
import Task from '../../components/Task/Task';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { getTasks } from '../../redux/slices/tasksSlice';
import { getTasksAction } from '../../redux/actionsAndBuilders/tasks/getTasks';

type Props = {
  type: TasksType;
};

const ViewTasksPage: FC<Props> = ({ type }) => {
  const userSlice = useAppSelector(getUserSlice);
  // const tasksSlice = useAppSelector(
  //   getActualTasks(type),
  //   (a, b) => a.toString() === b.toString()
  // );
  const tasksSlice = useAppSelector(getTasks(type));
  const dispatch = useAppDispatch();
  const willShowTasks = tasksSlice.filter(
    (task) => !task.expired && !task.willBeDeleted
  );

  useEffect(() => {
    if (userSlice.user) {
      console.log(
        '/tasks. Запрашиваем таски',
        userSlice.user.token?.slice(0, 10)
      );
      dispatch(getTasksAction({ token: userSlice.user.token, type, dispatch }));
    }
  }, [type]);

  return (
    <section className={styles.content}>
      <ul className={styles.tasks_container}>
        {willShowTasks.map((task) => {
          return (
            <li key={task._id} className={styles.task_item}>
              <Task task={task} type={type} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
export default ViewTasksPage;
