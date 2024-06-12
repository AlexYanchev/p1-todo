import styles from './Task.module.css';
import { TaskStatus, TaskType } from '../../types/taskType';
import { FC } from 'react';
import { StepType } from '../../types/stepTypes';
import ControlButtons from '../ControlButtons/ControlButtons';
import LikeIcon from '../icons/LikeIcon/LikeIcon';

type Props = {
  task: TaskType;
  type: TaskStatus;
};

const Task: FC<Props> = ({ task, type }) => {
  // получаем с сервера шаги для каждого таск
  const steps: StepType[] = [];

  return (
    <article>
      <div>
        <p>{task.title}</p>
        <span>{task.date}</span>
      </div>
      <div>
        {task.steps.map((step) => {
          return <>{step}</>;
        })}
      </div>

      <ControlButtons type={type} taskId={task.id} />
      <p>{task.expiredAt}</p>
      <div>
        <dl>
          <dt>
            <button type='button'>
              <LikeIcon pressed={true} size='large' />
            </button>
          </dt>
          <dd>{task.likes.length}</dd>
        </dl>
        <button type='button'>Публичная</button>
      </div>
    </article>
  );
};
export default Task;
