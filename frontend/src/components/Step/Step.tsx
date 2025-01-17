import { FC } from 'react';
import { StepType } from '../../types/stepTypes';
import Button from '../Button/Button';
import CompleteIcon from '../icons/CompleteIcon/CompleteIcon';
import DeleteBasketIcon from '../icons/DeleteBasketIcon/DeleteBasketIcon';
import styles from './Step.module.css';
import { getUserSlice } from '../../redux/slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { changeCompleteStatusStepActionThunk } from '../../redux/actionsAndBuilders/tasks/changeCompleteStatusStep';
import { deleteStepActionThunk } from '../../redux/actionsAndBuilders/tasks/deleteStep';

type Props = {
  step: StepType;
  shared: boolean;
};

const Step: FC<Props> = ({ step, shared }) => {
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(getUserSlice);

  const deleteStep = (stepId: string) => {
    if (userSlice.user) {
      dispatch(
        deleteStepActionThunk({ stepId, token: userSlice.user.token, dispatch })
      );
    }
  };

  const completeStep = (stepId: string) => {
    if (userSlice.user) {
      dispatch(
        changeCompleteStatusStepActionThunk({
          stepId,
          token: userSlice.user.token,
          dispatch,
        })
      );
    }
  };

  return (
    <div className={styles.step}>
      <span
        className={`${styles.step_title} ${
          step.complete ? styles.complete : ''
        } ${
          shared && step.owner === userSlice.user?._id ? styles.step_own : ''
        }`}
      >
        {step.title}
      </span>
      {step.owner === userSlice.user?._id && (
        <div className={styles.step_controls}>
          <Button
            typeElement='button'
            type='button'
            name='deleteStep'
            text={<DeleteBasketIcon />}
            onClick={() => {
              deleteStep(step._id);
            }}
          />
          <Button
            typeElement='button'
            type='button'
            name='completeStep'
            text={<CompleteIcon />}
            onClick={() => {
              completeStep(step._id);
            }}
          />
        </div>
      )}
    </div>
  );
};
export default Step;
