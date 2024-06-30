import styles from './ProfilePage.module.css';
import Image from '../../components/Image/Image';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { useCallback, useRef, useState } from 'react';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { changeUserDataActionThunk } from '../../redux/actionsAndBuilders/user/changeUserData';
import ArchiveTasksViewer from '../../components/ArchiveTasksViewer/ArchiveTasksViewer';

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
  const disabledButton =
    Object.values(dataForm).every((value) => !Boolean(value) || pending) ||
    !fieldCanChange.login.canChange;

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
          <Image alt='Аватар' width='300px' height='300px' type='avatar' />
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
    </section>
  );
};

export default ProfilePage;
