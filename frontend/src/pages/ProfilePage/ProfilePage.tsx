import styles from './ProfilePage.module.css';
import Avatar from '../../components/Avatar/Avatar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { useCallback, useEffect, useRef, useState } from 'react';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { changeUserDataActionThunk } from '../../redux/actionsAndBuilders/user/changeUserData';
import ArchiveTasksViewer from '../../components/ArchiveTasksViewer/ArchiveTasksViewer';
import { UserPublicProfileType } from '../../types/userType';
import { customFetch } from '../../requests';
import PublicAvatar from '../../components/PublicAvatar/PublicAvatar';
import { changeFriendsListThunkAction } from '../../redux/actionsAndBuilders/user/addToFriend';
import Button from '../../components/Button/Button';

type DataFormType = {
  firstName: string;
  lastName: string;
  login: string;
};

const ProfilePage = () => {
  const loginInputRef = useRef<HTMLInputElement>(null);
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const [dataForm, setDataForm] = useState<DataFormType>({
    firstName: '',
    lastName: '',
    login: '',
  });
  const [fieldCanChange, setFieldCanChange] = useState({
    login: { check: false, canChange: false },
  });
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();
  const user = userSlice.user;
  const pending = useAppSelector((state) => state.user.status === 'pending');
  const [friendsList, setFriendsList] = useState<UserPublicProfileType[]>([]);

  useEffect(() => {
    if (userSlice.user && !friendsList.length) {
      customFetch({
        to: `/getData/friendsList`,
        method: 'GET',
        dispatch,
        headers: {
          Authorization: userSlice.user?.token,
        },
      })
        .then((res) => [
          console.log('Запрос на список друзей успешный. Результат: ', res),
          setFriendsList(res.data.result.friends),
        ])
        .catch((err) => {
          console.log(
            'Запрос на список друзей выполнился с ошибкой. Ошибка: ',
            err
          );
        });
    }
  }, []);
  const disabledButton =
    Object.values(dataForm).every((value) => !Boolean(value) || pending) ||
    !fieldCanChange.login.canChange;

  const deleteFriend = (idFriend: string) => {
    if (!userSlice.user) {
      return;
    }
    dispatch(
      changeFriendsListThunkAction({
        token: userSlice.user.token,
        dispatch,
        idFriend,
      })
    )
      .then((res) => {
        console.log(
          'Успешный запрос на удаление друга. Ответ от сервера: ',
          res
        );
        setFriendsList(friendsList.filter((friend) => friend._id !== idFriend));
      })
      .catch((err) => [
        console.log('Ошибка при запросе на удаление друга. Ошибка: ', err),
      ]);
  };

  const resetForm = useCallback(() => {
    let field: keyof DataFormType;
    for (field in dataForm) {
      dataForm[field] = '';
    }
  }, [dataForm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDataForm({
      ...dataForm,
      [e.currentTarget.name]: e.currentTarget.value,
    });

    if (
      user &&
      e.currentTarget.name === 'login' &&
      e.currentTarget.value.length >= 3 &&
      e.currentTarget.value.match(/^[A-Za-z0-9]+$/)
    ) {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      const id = setTimeout(
        (newLogin) => {
          dispatch(
            changeUserDataActionThunk({
              token: user.token,
              dispatch,
              fields: { login: newLogin },
              justCheck: true,
            })
          )
            .unwrap()
            .then((res) => {
              if (!res.data.canChange) {
                loginInputRef.current?.setCustomValidity('Логин занят');
              } else {
                loginInputRef.current?.setCustomValidity('');
              }
              setFieldCanChange({
                ...fieldCanChange,
                login: { check: true, canChange: res.data.canChange },
              });
              loginInputRef.current?.focus();
            })
            .catch((error) => {
              console.log('Error check field: login');
            });
        },
        1000,
        e.currentTarget.value
      );

      setTimeoutId(id);
    } else {
      setFieldCanChange({
        ...fieldCanChange,
        login: { check: false, canChange: false },
      });
    }
  };

  const saveChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    const resultData = Object.keys(dataForm).reduce((acc, current) => {
      const field = current as keyof DataFormType;

      if (user[field] === dataForm[field] || !Boolean(dataForm[field])) {
        return acc;
      } else {
        acc[field] = dataForm[field];
        return acc;
      }
    }, {} as { [k in keyof DataFormType]: string });

    dispatch(
      changeUserDataActionThunk({
        token: user?.token,
        dispatch,
        fields: resultData,
      })
    );

    resetForm();
  };

  return (
    <section className={styles.profile_container}>
      <div className={styles.content}>
        <div>
          <Avatar alt='Аватар' width='300px' height='300px' type='avatar' />
          <ArchiveTasksViewer />
        </div>

        <div className={styles.info_container}>
          <UniversalForm
            className={styles.form_container}
            elements={[
              {
                typeElement: 'input',
                type: 'text',
                name: 'firstName',
                label: 'Имя',
                placeholder: user?.firstName,
                value: dataForm.firstName,
                errorMessage:
                  'Количество символов от 2 до 15. Только русские буквы',
                options: {
                  minLength: 2,
                  maxLength: 15,
                  pattern: '^[а-яА-ЯёЁ]+$',
                  'aria-errormessage': 'errorMessage-firstName',
                  disabled: pending,
                },
                onChange,
              },

              {
                typeElement: 'input',
                type: 'text',
                name: 'lastName',
                label: 'Фамилия',
                placeholder: user?.lastName,
                value: dataForm.lastName,
                errorMessage:
                  'Количество символов от 2 до 15. Только русские буквы',
                options: {
                  minLength: 2,
                  maxLength: 15,
                  pattern: '^[а-яА-ЯёЁ]+$',
                  'aria-errormessage': 'errorMessage-lastName',
                  disabled: pending,
                },
                onChange,
              },
              {
                typeElement: 'input',
                type: 'text',
                name: 'login',
                label: 'Логин',
                placeholder: user?.login,
                value: dataForm.login,
                errorMessage:
                  fieldCanChange.login.check && !fieldCanChange.login.canChange
                    ? 'Логин занят'
                    : 'Только латинские буквы и цифры. От 3 до 15 символов.',
                options: {
                  minLength: 3,
                  maxLength: 15,
                  pattern: '^[A-Za-z0-9]+$',
                  'aria-errormessage': 'errorMessage-login',
                  disabled: pending,
                  ref: loginInputRef,
                },
                onChange,
              },

              {
                typeElement: 'button',
                type: 'submit',
                name: 'editLastName',
                text: 'Сохранить',
                className: `standart-button`,
                options: {
                  disabled: disabledButton,
                },
              },
            ]}
            onSubmit={saveChange}
          />
        </div>
      </div>
      <div className={styles.friends_container}>
        <h2 className={styles.friends_header}>Друзья</h2>
        <ol className={styles.friends_list}>
          {friendsList.map((friend) => {
            return (
              <li key={friend._id}>
                <PublicAvatar srcAvatar={friend.avatar} />
                <span>
                  {friend.firstName} {friend.lastName}
                </span>
                <Button
                  typeElement='button'
                  type='button'
                  name='deleteFriend'
                  onClick={() => deleteFriend(friend._id)}
                  text='Удалить'
                />
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default ProfilePage;
