import { FC, useState } from 'react';
import Button from '../Button/Button';
import styles from './ControlButtonsOwnTask.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  changeCompleteStatusTaskActionThunk,
  CompleteTaskActionReturnedType,
} from '../../redux/actionsAndBuilders/changeCompleteStatusTask';
import { deleteTaskAction } from '../../redux/actionsAndBuilders/deleteTask';

type Props = {
  taskId: string;
};

const ControlButtonsOwnTask: FC<Props> = ({ taskId }) => {
  const [completeTaskState, setCompleteTaskState] = useState(false);
  const userSlice = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const deleteTask = () => {
    if (userSlice.user) {
      dispatch(
        deleteTaskAction({ id: taskId, token: userSlice.user.token, dispatch })
      );
    }
  };

  const addStep = () => {
    navigate(`/addStep/${taskId}`, { state: { background: location } });
  };

  const completeTask = () => {
    if (userSlice.user) {
      dispatch(
        changeCompleteStatusTaskActionThunk({
          taskId,
          token: userSlice.user.token,
          dispatch,
        })
      ).then((res) => {
        const payload = res.payload as CompleteTaskActionReturnedType;
        setCompleteTaskState(payload.task.complete);
      });
    }
  };

  return (
    <div className={styles.container}>
      <Button
        typeElement='button'
        type='button'
        name='addStep'
        text='Добавить шаг'
        className={styles.top_button}
        onClick={addStep}
        options={{
          disabled: completeTaskState,
        }}
      />
      <Button
        typeElement='button'
        type='button'
        name='deleteTask'
        text='Удалить'
        onClick={deleteTask}
      />
      <Button
        typeElement='button'
        type='button'
        name='completeTask'
        text={completeTaskState ? 'Восстановить' : 'Завершить'}
        onClick={completeTask}
      />
    </div>
  );
};
export default ControlButtonsOwnTask;
