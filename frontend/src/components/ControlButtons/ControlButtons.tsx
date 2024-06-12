import { FC } from 'react';
import { TaskStatus } from '../../types/taskType';
import styles from './ControlButtons.module.css';
import ControlButtonsOwnTask from '../ControlButtonsOwnTask/ControlButtonsOwnTask';
import ControlButtonsPublicTask from '../ControlButtonsPublicTask/ControlButtonsPublicTask';
import ControlButtonsSharedTask from '../ControlButtonsSharedTask/ControlButtonsSharedTask';

type Props = {
  type: TaskStatus;
  taskId: string;
};

const ControlButtons: FC<Props> = ({ type, taskId }) => {
  switch (type) {
    case TaskStatus.OWN_TASK: {
      return <ControlButtonsOwnTask taskId={taskId} />;
    }
    case TaskStatus.PUBLIC_TASK: {
      return <ControlButtonsPublicTask taskId={taskId} />;
    }
    case TaskStatus.SHARED_TASK: {
      return <ControlButtonsSharedTask taskId={taskId} />;
    }
  }
};
export default ControlButtons;
