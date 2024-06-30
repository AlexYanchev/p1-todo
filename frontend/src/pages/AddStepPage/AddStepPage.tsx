import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import styles from './AddStepPage.module.css';
import { addStepToTaskAction } from '../../redux/actionsAndBuilders/tasks/addStepToTask';

const AddStepPage = () => {
  const [createStepDataForm, setCreateStepDataForm] = useState({
    title: '',
  });

  const userSlice = useAppSelector(getUserSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { taskId } = useParams();
  const pending = useAppSelector((state) => state.tasks.status === 'pending');
  const disabledCreateTaskButton =
    !Boolean(createStepDataForm.title) || pending;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateStepDataForm({
      ...createStepDataForm,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userSlice.user && taskId) {
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
            text: pending ? <Spinner /> : 'Добавить',
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
