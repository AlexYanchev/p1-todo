import { FC } from 'react';
import styles from './ViewTasksPage.module.css';
import SubMenu from '../../components/SubMenu/SubMenu';
import { TaskStatus } from '../../types/taskType';
import { tasks } from '../../MOCK_DATA';
import Task from '../../components/Task/Task';

type Props = {
  type: TaskStatus;
};

const ViewTasksPage: FC<Props> = ({ type }) => {
  //получаем таски
  return (
    <section className={styles.content}>
      <nav>{type !== TaskStatus.PUBLIC_TASK && <SubMenu />}</nav>
      <ul className={styles.tasks_container}>
        {tasks.map((task) => {
          return (
            <li key={task.id} className={styles.task_item}>
              <Task task={task} type={type} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
export default ViewTasksPage;
