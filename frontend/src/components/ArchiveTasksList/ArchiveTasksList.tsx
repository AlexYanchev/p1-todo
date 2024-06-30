import { FC } from 'react';
import { TaskTypeWithoutStepsField } from '../../types/taskType';
import styles from './ArchiveTasksList.module.css';
import Spinner from '../Spinner/Spinner';

type Props = {
  list: Array<TaskTypeWithoutStepsField>;
  downloading?: boolean;
};

const ArchiveTasksList: FC<Props> = ({ downloading, list }) => {
  if (downloading) {
    return <Spinner />;
  }

  if (!list.length) {
    return <p>Тасков нет</p>;
  }
  return (
    <ul className={styles.container}>
      {list.map((task) => {
        return <li key={task._id}>{task.title}</li>;
      })}
    </ul>
  );
};
export default ArchiveTasksList;
