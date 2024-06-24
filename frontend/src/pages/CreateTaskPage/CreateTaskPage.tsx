import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import styles from './CreateTaskPage.module.css';
import { createTaskAction } from '../../redux/actionsAndBuilders/tasks/createTask';

const CreateTaskPage = () => {
  const [createTaskDataForm, setCreateTaskDataForm] = useState({
    title: '',
    public: false,
    expiredAt: '',
  });
  const disabledCreateTaskButton =
    !Boolean(createTaskDataForm.title) ||
    !Boolean(createTaskDataForm.expiredAt);

  const userSlice = useAppSelector(getUserSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const currentDate = new Date();

  const currentFormattedDate = useMemo(() => {
    return `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate.getDate() - 1}`;
  }, [currentDate.getDate()]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCreateTaskDataForm({
      ...createTaskDataForm,
      [e.currentTarget.name]:
        e.currentTarget.type === 'checkbox'
          ? e.currentTarget.checked
          : e.currentTarget.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userSlice.user) {
      dispatch(
        createTaskAction({
          task: createTaskDataForm,
          token: userSlice.user.token,
          dispatch,
        })
      ).then(() => navigate(-1));
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
            label: 'Заголовок',
            value: createTaskDataForm.title,
            onChange,
            errorMessage: 'От 3 до 15 символов.',
            options: {
              minLength: 3,
              maxLength: 15,
              'aria-errormessage': 'errorMessage-title',
            },
          },
          {
            typeElement: 'input',
            type: 'checkbox',
            name: 'public',
            label: 'Публичная',
            options: {
              checked: createTaskDataForm.public,
            },
            onChange,
            className: styles.checkbox,
            classNameContainer: styles.checkbox_container,
          },
          {
            typeElement: 'input',
            type: 'date',
            name: 'expiredAt',
            label: 'Сделать до',
            value: createTaskDataForm.expiredAt,
            onChange,
            options: {
              min: currentFormattedDate,
            },
          },

          {
            typeElement: 'button',
            type: 'submit',
            name: 'create',
            text: 'Создать',
            className: `${styles.button}`,
            options: {
              disabled: disabledCreateTaskButton,
            },
          },
        ]}
        onSubmit={onSubmit}
        className={styles.form}
      />
      {userSlice.status === 'pending' && <Spinner sizeInEM={2} />}
    </section>
  );
};
export default CreateTaskPage;
