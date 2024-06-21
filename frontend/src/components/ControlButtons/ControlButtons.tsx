import { FC } from 'react';
import { TasksType } from '../../types/taskType';
import styles from './ControlButtons.module.css';
import ControlButtonsOwnTask from '../ControlButtonsOwnTask/ControlButtonsOwnTask';
import ControlButtonsPublicTask from '../ControlButtonsPublicTask/ControlButtonsPublicTask';
import ControlButtonsSharedTask from '../ControlButtonsSharedTask/ControlButtonsSharedTask';

type Props = {
  type: TasksType;
  taskId: string;
  taskBelongsCurrentUser: boolean;
};

const ControlButtons: FC<Props> = ({
  type,
  taskId,
  taskBelongsCurrentUser,
}) => {
  switch (type) {
    case 'own': {
      return <ControlButtonsOwnTask taskId={taskId} />;
    }
    case 'public': {
      return taskBelongsCurrentUser ? (
        <></>
      ) : (
        <ControlButtonsPublicTask taskId={taskId} />
      );
    }
    case 'shared': {
      return <ControlButtonsSharedTask taskId={taskId} />;
    }
  }
};
export default ControlButtons;
