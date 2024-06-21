import { FC, useEffect } from 'react';
import styles from './ViewTasksPage.module.css';
import SubMenu from '../../components/SubMenu/SubMenu';
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
  const tasksSlice = useAppSelector(getTasks(type));
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (userSlice.user) {
      dispatch(getTasksAction({ token: userSlice.user.token, type, dispatch }));
    }
  }, [type]);

  return (
    <section className={styles.content}>
      <nav>{type !== 'public' && <SubMenu />}</nav>
      <ul className={styles.tasks_container}>
        {tasksSlice.map((task) => {
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
