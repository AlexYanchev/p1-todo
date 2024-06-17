import styles from './Task.module.css';
import { TasksType, TaskType } from '../../types/taskType';
import { FC } from 'react';
import { StepType } from '../../types/stepTypes';
import ControlButtons from '../ControlButtons/ControlButtons';
import LikeIcon from '../icons/LikeIcon/LikeIcon';
import Button from '../Button/Button';
import CompleteIcon from '../icons/CompleteIcon/CompleteIcon';
import DeleteBasketIcon from '../icons/DeleteBasketIcon/DeleteBasketIcon';

type Props = {
  task: TaskType;
  type: TasksType;
};

const Task: FC<Props> = ({ task, type }) => {
  return (
    <article className={styles.task_container}>
      <div className={styles.title}>
        <p>{task.title}</p>
        <span className={styles.title_date}>{task.createdAt}</span>
      </div>
      <ol className={styles.steps_container}>
        {task.steps.map((step) => {
          return (
            <li className={styles.step} key={step._id}>
              <span className={styles.step_title}>{step.title}</span>
              <div className={styles.step_controls}>
                <Button
                  typeElement='button'
                  type='button'
                  name='deleteStep'
                  text={<DeleteBasketIcon />}
                />
                <Button
                  typeElement='button'
                  type='button'
                  name='completeStep'
                  text={<CompleteIcon />}
                />
              </div>
            </li>
          );
        })}
      </ol>
      <div className={styles.control_buttons_container}>
        <ControlButtons type={type} taskId={task._id} />
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
