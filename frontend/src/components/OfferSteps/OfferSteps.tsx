import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice, getUserToken } from '../../redux/slices/userSlice';
import styles from './OfferSteps.module.css';
import { customFetch } from '../../requests';
import { OfferStepType } from '../../types/stepTypes';
import Button from '../Button/Button';
import { changeOfferStepThunkAction } from '../../redux/actionsAndBuilders/profileData/offers/changeOfferStep';

type Props = {
  list: Array<OfferStepType>;
};

const OfferSteps: FC<Props> = ({ list }) => {
  const userToken = useAppSelector(getUserToken);
  const dispatch = useAppDispatch();

  const changeOfferStep = (idStep: string, action: 'delete' | 'accept') => {
    if (!userToken) {
      return;
    }

    dispatch(
      changeOfferStepThunkAction({ token: userToken, dispatch, idStep, action })
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
      <ul className={styles.steps_container}>
        {list.map((step) => {
          return (
            <li className={styles.step} key={step._id}>
              <span>Шаг: {step.title}</span>
              <span>Задача: {step.task.title}</span>
              <span>
                Предложил: {step.proposedBy.firstName}{' '}
                {step.proposedBy.lastName} {step.proposedBy.login}
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
