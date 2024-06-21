import { FC, useState } from 'react';
import Button from '../Button/Button';
import styles from './ControlButtonsPublicTask.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import {
  JoinToTaskReturnedType,
  joinToTaskActionThunk,
} from '../../redux/actionsAndBuilders/tasks/joinToTask';

type Props = {
  taskId: string;
};

const ControlButtonsPublicTask: FC<Props> = ({ taskId }) => {
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const [join, setJoin] = useState(false);

  const joinToTask = () => {
    if (userSlice.user) {
      dispatch(
        joinToTaskActionThunk({ taskId, token: userSlice.user.token, dispatch })
      ).then((res) => {
        const response = res.payload as JoinToTaskReturnedType;
        setJoin(response.data.action);
      });
    }
  };
  return (
    <div className={styles.container}>
      {
        <Button
          typeElement='button'
          type='button'
          name='joinToTask'
          text={join ? 'Отсоединиться' : 'Присоединиться'}
          onClick={joinToTask}
        />
      }
    </div>
  );
};
export default ControlButtonsPublicTask;
