import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import styles from './AddStepPage.module.css';
import { addStepToTaskAction } from '../../redux/actionsAndBuilders/addStepToTask';

const AddStepPage = () => {
  const [createStepDataForm, setCreateStepDataForm] = useState({
    title: '',
  });
  const disabledCreateTaskButton = !Boolean(createStepDataForm.title);

  const userSlice = useAppSelector(getUserSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { taskId } = useParams();

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
          },

          {
            typeElement: 'button',
            type: 'submit',
            name: 'add',
            text: 'Добавить',
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
export default AddStepPage;
