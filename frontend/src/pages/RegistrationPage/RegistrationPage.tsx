import UniversalForm from '../../components/UniversalForm/UniversalForm';
import styles from './RegistrationPage.module.css';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { useAppSelector } from '../../redux/hooks';
import Spinner from '../../components/Spinner/Spinner';
import { registerUser } from '../../redux/actionsAndBuilders/user/registerUser';

const RegistrationPage = () => {
  const [registerDataForm, setRegisterDataForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
    retryPassword: '',
    login: '',
  });

  const userSlice = useAppSelector(getUserSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.user.status);

  const disabledRegisterButton =
    !Object.values(registerDataForm).every((v) => Boolean(v)) ||
    registerDataForm.password !== registerDataForm.retryPassword ||
    status === 'pending';

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterDataForm({
      ...registerDataForm,
      [e.currentTarget.name]: e.currentTarget.value,
    });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { retryPassword, ...registerData } = registerDataForm;
    dispatch(registerUser(registerData))
      .unwrap()
      .then((res: any) => {
        navigate('/login');
      })
      .catch((err: Error) => console.log('Ошибка', err.message));
  };

  const cancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    navigate(-1);
  };

  return (
    <section className={styles.container}>
      <UniversalForm
        elements={[
          {
            typeElement: 'input',
            type: 'text',
            name: 'firstName',
            label: 'Имя',
            value: registerDataForm.firstName,
            onChange,
            errorMessage:
              'Количество символов от 2 до 15. Только русские буквы',
            options: {
              minLength: 2,
              maxLength: 15,
              pattern: '^[а-яА-ЯёЁ]+$',
              'aria-errormessage': 'errorMessage-firstName',
            },
          },
          {
            typeElement: 'input',
            type: 'text',
            name: 'lastName',
            label: 'Фамилия',
            value: registerDataForm.lastName,
            onChange,
            errorMessage:
              'Количество символов от 2 до 20. Только русские буквы',
            options: {
              minLength: 2,
              maxLength: 15,
              pattern: '^[а-яА-ЯёЁ]+$',
              'aria-errormessage': 'errorMessage-lastName',
            },
          },
          {
            typeElement: 'input',
            type: 'password',
            name: 'password',
            label: 'Пароль',
            value: registerDataForm.password,
            onChange,
          },
          {
            typeElement: 'input',
            type: 'password',
            name: 'retryPassword',
            label: 'Повторите пароль',
            value: registerDataForm.retryPassword,
            onChange,
          },
          {
            typeElement: 'input',
            type: 'text',
            name: 'login',
            label: 'Логин',
            value: registerDataForm.login,
            onChange,
            errorMessage:
              'Только латинские буквы и цифры. От 3 до 15 символов.',
            options: {
              minLength: 3,
              maxLength: 15,
              'aria-errormessage': 'errorMessage-login',
            },
          },
          {
            typeElement: 'button',
            type: 'button',
            name: 'cancel',
            text: 'Отмена',
            className: `standart-button`,
            onClick: cancel,
          },
          {
            typeElement: 'button',
            type: 'submit',
            name: 'register',
            text: 'Зарегистрироваться',
            className: `standart-button`,
            options: {
              disabled: disabledRegisterButton,
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
export default RegistrationPage;
