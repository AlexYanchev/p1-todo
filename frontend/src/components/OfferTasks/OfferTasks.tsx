import { FC } from 'react';
import { OfferTaskType } from '../../types/taskType';
import styles from './OfferTasks.module.css';
import { getUserToken } from '../../redux/slices/userSlice';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import Button from '../Button/Button';
import { changeOfferTaskThunkAction } from '../../redux/actionsAndBuilders/profileData/offers/changeOfferTask';

type Props = {
  list: Array<OfferTaskType>;
};

const OfferTasks: FC<Props> = ({ list }) => {
  const userToken = useAppSelector(getUserToken);
  const dispatch = useAppDispatch();

  const changeOfferTask = (idTask: string, action: 'delete' | 'accept') => {
    if (!userToken) {
      return;
    }

    dispatch(
      changeOfferTaskThunkAction({ token: userToken, dispatch, idTask, action })
    )
      .then((res) => {
        console.log('Результат успешен: ', res);
      })
      .catch((err) => {
        console.log('Запрос совершился с ошибкой: ', err);
      });
  };

  return (
    <div>
      <ul className={styles.tasks_container}>
        {list.map((task) => {
          return (
            <li className={styles.task} key={task._id}>
              <span>{task.title}</span>
              <div className={styles.buttons_control}>
                <Button
                  type='button'
                  typeElement='button'
                  name='accept'
                  text='Принять'
                  onClick={() => changeOfferTask(task._id, 'accept')}
                />
                <Button
                  type='button'
                  typeElement='button'
                  name='delete'
                  text='Удалить'
                  onClick={() => changeOfferTask(task._id, 'delete')}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default OfferTasks;
