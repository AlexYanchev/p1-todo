import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import styles from './OfferSteps.module.css';
import { customFetch } from '../../requests';
import { OfferStep } from '../../types/stepTypes';
import Button from '../Button/Button';

const OfferSteps = () => {
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const [steps, setSteps] = useState<Array<OfferStep>>([]);

  useEffect(() => {
    if (!userSlice.user) {
      return;
    }
    customFetch({
      to: `/getData/offers/steps`,
      method: 'GET',
      dispatch,
      headers: {
        Authorization: userSlice.user.token,
      },
    })
      .then((res) => {
        console.log('Запрос на получения предложенных шагов. Результат: ', res);
        setSteps(res.data.sharedToMeSteps);
      })
      .catch((err) => {
        console.log(
          'Запрос на получения предложенных шагов выполнился с ошибкой. Ошибка: ',
          err
        );
      });
  }, []);

  const changeOfferStep = (idStep: string, action: 'delete' | 'accept') => {
    if (!userSlice.user) {
      return;
    }
    customFetch({
      to: `/changeOfferStep/${idStep}/${action}`,
      method: 'PATCH',
      dispatch,
      headers: {
        Authorization: userSlice.user.token,
      },
    })
      .then((res) => {
        console.log('Результат успешен: ', res);
        setSteps(steps.filter((step) => step._id !== res.data.sharedToMeSteps));
      })
      .catch((err) => {
        console.log('Запрос совершился с ошибкой: ', err);
      });
  };
  return (
    <div>
      <ul className={styles.steps_container}>
        {steps.map((step) => {
          return (
            <li className={styles.step} key={step._id}>
              <span>{step.title}</span>
              <span>к задаче {step.task.title}</span>
              <span>
                Предложил {step.proposedBy.firstName} {step.proposedBy.lastName}{' '}
                {step.proposedBy.login}
              </span>
              <div className={styles.buttons_control}>
                <Button
                  type='button'
                  typeElement='button'
                  name='accept'
                  text='Принять'
                  onClick={() => changeOfferStep(step._id, 'accept')}
                />
                <Button
                  type='button'
                  typeElement='button'
                  name='delete'
                  text='Удалить'
                  onClick={() => changeOfferStep(step._id, 'delete')}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default OfferSteps;
