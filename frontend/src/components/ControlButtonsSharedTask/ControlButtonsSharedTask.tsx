import { FC } from 'react';
import styles from './ControlButtonsSharedTask.module.css';
import Button from '../Button/Button';
import { useNavigate, useLocation } from 'react-router-dom';

type Props = {
  taskId: string;
};
const ControlButtonsSharedTask: FC<Props> = ({ taskId }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const proposeStep = () => {
    navigate(`/addStep/${taskId}`, { state: { background: location } });
  };
  return (
    <div className={styles.container}>
      <Button
        typeElement='button'
        type='button'
        name='offerStep'
        text='Предложить шаг'
        onClick={proposeStep}
      />
    </div>
  );
};
export default ControlButtonsSharedTask;
