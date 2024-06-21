import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { addStepToTaskAction } from '../../redux/actionsAndBuilders/tasks/addStepToTask';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import userSlice, { getUserSlice } from '../../redux/slices/userSlice';
import styles from './SetAvatarPage.module.css';
import { changeUserAvatarActionThunk } from '../../redux/actionsAndBuilders/user/changeUserAvatar';

const SetAvatarPage = () => {
  const [srcImgDataForm, setSrcImgDataForm] = useState({
    src: '',
  });
  const disabledCreateTaskButton = !Boolean(srcImgDataForm.src);

  const userSlice = useAppSelector(getUserSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSrcImgDataForm({
      ...srcImgDataForm,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userSlice.user) {
      dispatch(
        changeUserAvatarActionThunk({
          token: userSlice.user.token,
          dispatch,
          fields: { avatar: srcImgDataForm.src },
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
            name: 'src',
            label: 'Ссылка на картинку',
            value: srcImgDataForm.src,
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
export default SetAvatarPage;
