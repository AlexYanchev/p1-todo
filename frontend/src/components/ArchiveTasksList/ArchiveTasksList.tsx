import { FC } from 'react';
import { ArchiveTasksFileds } from '../../types/taskType';
import styles from './ArchiveTasksList.module.css';

type Props = {
  list: Array<ArchiveTasksFileds>;
  classNameContainer?: string;
};

const ArchiveTasksList: FC<Props> = ({ classNameContainer, list }) => {
  if (!list.length) {
    return <p>Тасков нет</p>;
  }
  return (
    <ul
      className={`${styles.container} ${
        classNameContainer ? classNameContainer : ''
      }`}
    >
      {list.map((task) => {
        return (
          <li key={task._id} className={styles.item}>
            {task.title}
          </li>
        );
      })}
    </ul>
  );
};
export default ArchiveTasksList;
