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
  const disabledRegisterButton =
    !Object.values(registerDataForm).every((v) => Boolean(v)) ||
    registerDataForm.password !== registerDataForm.retryPassword;

  const userSlice = useAppSelector(getUserSlice);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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
          },
          {
            typeElement: 'input',
            type: 'text',
            name: 'lastName',
            label: 'Фамилия',
            value: registerDataForm.lastName,
            onChange,
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
          },
          {
            typeElement: 'button',
            type: 'button',
            name: 'cancel',
            text: 'Отмена',
            className: `${styles.button}`,
            onClick: cancel,
          },
          {
            typeElement: 'button',
            type: 'submit',
            name: 'register',
            text: 'Зарегистрироваться',
            className: `${styles.button}`,
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
