import { useEffect, useState } from 'react';
import { OfferTaskType } from '../../types/taskType';
import styles from './OfferTasks.module.css';
import userSlice, { getUserSlice } from '../../redux/slices/userSlice';
import { customFetch } from '../../requests';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import Button from '../Button/Button';

const OfferTasks = () => {
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const [tasks, setTasks] = useState<Array<OfferTaskType>>([]);

  useEffect(() => {
    if (!userSlice.user) {
      return;
    }
    customFetch({
      to: `/getData/offers/tasks`,
      method: 'GET',
      dispatch,
      headers: {
        Authorization: userSlice.user.token,
      },
    })
      .then((res) => {
        console.log(
          'Запрос на получения предложенных тасков. Результат: ',
          res
        );
        setTasks(res.data.sharedToMeTasks);
      })
      .catch((err) => {
        console.log(
          'Запрос на получения предложенных тасков выполнился с ошибкой. Ошибка: ',
          err
        );
      });
  }, []);

  const changeOfferTask = (idTask: string, action: 'delete' | 'accept') => {
    if (!userSlice.user) {
      return;
    }
    customFetch({
      to: `/changeOfferTask/${idTask}/${action}`,
      method: 'PATCH',
      dispatch,
      headers: {
        Authorization: userSlice.user.token,
      },
    })
      .then((res) => {
        console.log('Результат успешен: ', res);
        setTasks(tasks.filter((task) => task._id !== res.data.sharedToMeTasks));
      })
      .catch((err) => {
        console.log('Запрос совершился с ошибкой: ', err);
      });
  };

  return (
    <div>
      <ul className={styles.tasks_container}>
        {tasks.map((task) => {
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
