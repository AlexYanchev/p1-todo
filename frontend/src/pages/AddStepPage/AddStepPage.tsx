import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import styles from './AddStepPage.module.css';
import { addStepToTaskAction } from '../../redux/actionsAndBuilders/tasks/addStepToTask';
import { customFetch } from '../../requests';

const AddStepPage = () => {
  const [createStepDataForm, setCreateStepDataForm] = useState({
    title: '',
  });

  const userSlice = useAppSelector(getUserSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { taskId, offer } = useParams();
  const pending = useAppSelector((state) => state.tasks.status === 'pending');
  const disabledCreateTaskButton =
    !Boolean(createStepDataForm.title) || pending;

  const isOffer = offer === 'offer';
  const nameButton = isOffer ? 'Предложить' : 'Добавить';

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateStepDataForm({
      ...createStepDataForm,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userSlice.user) {
      return;
    }
    if (taskId && !isOffer) {
      dispatch(
        addStepToTaskAction({
          id: taskId,
          token: userSlice.user.token,
          dispatch,
          step: createStepDataForm,
        })
      ).then((res) => {
        navigate(-1);
      });
    } else if (isOffer) {
      customFetch({
        to: `/share/proposeStep/${taskId}`,
        method: 'PATCH',
        headers: {
          Authorization: userSlice.user.token,
          'Content-Type': 'application/json;charset=utf-8',
        },
        dispatch,
        data: { step: createStepDataForm },
      })
        .then((res) => {
          console.log('Успешно предложили шаг. ', res);
          navigate(-1);
        })
        .catch((err) => {
          console.log('Возникла ошибка, при предложении шага. ', err);
        });
    }

    e.currentTarget.reset();
  };

  return (
    <section className={styles.container}>
      <UniversalForm
        elements={[
          {
            typeElement: 'input',
            type: 'text',
            name: 'title',
            label: 'Шаг',
            value: createStepDataForm.title,
            onChange,
            errorMessage: 'От 3 до 30 символов.',
            options: {
              minLength: 3,
              maxLength: 30,
              'aria-errormessage': 'errorMessage-title',
              disabled: pending,
            },
          },

          {
            typeElement: 'button',
            type: 'submit',
            name: 'add',
            text: pending ? <Spinner /> : nameButton,
            className: `standart-button`,
            options: {
              disabled: disabledCreateTaskButton,
            },
          },
        ]}
        onSubmit={onSubmit}
        className='standart-form'
      />
    </section>
  );
};
export default AddStepPage;
