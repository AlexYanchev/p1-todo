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
  classNameContainer?: string;
  classNameButton?: string;
};

const ControlButtons: FC<Props> = ({
  type,
  taskId,
  taskBelongsCurrentUser,
  classNameContainer,
  classNameButton,
}) => {
  switch (type) {
    case 'own': {
      return (
        <ControlButtonsOwnTask
          taskId={taskId}
          type={type}
          classNameContainer={classNameContainer}
          classNameButton={classNameButton}
        />
      );
    }
    case 'public': {
      return taskBelongsCurrentUser ? (
        <></>
      ) : (
        <ControlButtonsPublicTask taskId={taskId} type={type} />
      );
    }
    case 'shared': {
      return <ControlButtonsSharedTask taskId={taskId} type={type} />;
    }
  }
};
export default ControlButtons;
