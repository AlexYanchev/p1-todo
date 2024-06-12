import styles from './Task.module.css';
import { TaskStatus, TaskType } from '../../types/taskType';
import { FC } from 'react';
import { StepType } from '../../types/stepTypes';
import ControlButtons from '../ControlButtons/ControlButtons';
import LikeIcon from '../icons/LikeIcon/LikeIcon';
import { steps } from '../../MOCK_DATA';

type Props = {
  task: TaskType;
  type: TaskStatus;
};

const Task: FC<Props> = ({ task, type }) => {
  // получаем с сервера шаги для каждого таск
  const stepsData: StepType[] = steps.filter((step) => step.id in task.steps);
  return (
    <article className={styles.task_container}>
      <div className={styles.title}>
        <p>{task.title}</p>
        <span className={styles.title_date}>{task.date}</span>
      </div>
      <ol className={styles.steps_container}>
        {task.steps.map((step) => {
          return (
            <li className={styles.step} key={step}>
              {step}
            </li>
          );
        })}
      </ol>
      <div className={styles.control_buttons_container}>
        <ControlButtons type={type} taskId={task.id} />
        <p className={styles.expiredAt}>Срок выполнения: {task.expiredAt}</p>
      </div>

      <div className={styles.footer_container}>
        <dl className={styles.likes}>
          <dt>
            <LikeIcon pressed={true} size='small' />
          </dt>
          <dd>{task.likes.length}</dd>
        </dl>
        <button type='button'>Публичная</button>
      </div>
    </article>
  );
};
export default Task;
