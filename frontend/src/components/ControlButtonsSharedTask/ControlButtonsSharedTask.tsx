import { FC } from 'react';
import styles from './ControlButtonsSharedTask.module.css';
import Button from '../Button/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import { TasksType } from '../../types/taskType';

type Props = {
  taskId: string;
  type: TasksType;
};
const ControlButtonsSharedTask: FC<Props> = ({ taskId, type }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const proposeStep = () => {
    navigate(`/addStep/${taskId}/offer`, { state: { background: location } });
  };
  return (
    <div className={styles.container}>
      <Button
        typeElement='button'
        type='button'
        name='offerStep'
        text='Предложить шаг'
        className='button_control'
        onClick={proposeStep}
      />
    </div>
  );
};
export default ControlButtonsSharedTask;
