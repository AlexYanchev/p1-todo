import { FC, useEffect } from 'react';
import styles from './ViewTasksPage.module.css';
import SubMenu from '../../components/SubMenu/SubMenu';
import { TasksType, TaskType } from '../../types/taskType';
import Task from '../../components/Task/Task';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice, logout } from '../../redux/slices/userSlice';
import { getTasks, getTasksAction } from '../../redux/slices/tasksSlice';

type Props = {
  type: TasksType;
};

const ViewTasksPage: FC<Props> = ({ type }) => {
  const userSlice = useAppSelector(getUserSlice);
  const tasksSlice = useAppSelector(getTasks);
  // const [specificTasks, setSpecificTasks] = useState<TaskType[]>([])
  const dispatch = useAppDispatch();
  const checkToken = (res: any) => {
    if (res.invalidToken) {
      dispatch(logout());
    }
  };
  useEffect(() => {
    if (userSlice.user) {
      dispatch(
        getTasksAction({ token: userSlice.user.token, type, dispatch })
      ).then((res) => {
        // checkToken(res);
      });
      // .catch((err) => console.log('Ошибка при открытии страницы', err));
    }
  }, [type]);

  return (
    <section className={styles.content}>
      <nav>{type !== 'public' && <SubMenu />}</nav>
      <ul className={styles.tasks_container}>
        {tasksSlice[type].map((task) => {
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
