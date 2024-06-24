import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/Spinner/Spinner';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import styles from './SetAvatarPage.module.css';
import { changeUserDataActionThunk } from '../../redux/actionsAndBuilders/user/changeUserData';

const SetAvatarPage = () => {
  const [avatar, setAvatar] = useState({
    avatar: '',
  });
  const pending = useAppSelector((state) => state.user.status === 'pending');
  const disabledCreateTaskButton = !Boolean(avatar.avatar) || pending;

  const userSlice = useAppSelector(getUserSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatar({
      ...avatar,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (userSlice.user) {
      dispatch(
        changeUserDataActionThunk({
          token: userSlice.user.token,
          dispatch,
          fields: { avatar: avatar.avatar },
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
            value: avatar.avatar,
            onChange,
            options: {
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
export default SetAvatarPage;
