import { useState } from 'react';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import styles from './LoginPage.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../redux/actionsAndBuilders/user/loginUser';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const status = useAppSelector((state) => state.user.status);
  const [formData, setFormData] = useState<{ login: string; password: string }>(
    {
      login: '',
      password: '',
    }
  );

  const disabledLoginButton =
    !Boolean(formData.login) ||
    !Boolean(formData.password) ||
    status === 'pending';

  const registration = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    navigate('/registration');
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser(formData))
      .unwrap()
      .then((res: any) => {
        dispatch(addUser(res));
        localStorage.setItem('user', JSON.stringify(res));
        navigate('/tasks');
      })
      .catch((err: Error) => console.log(err.message));
  };

  return (
    <section className={styles.container}>
      <UniversalForm
        elements={[
          {
            typeElement: 'input',
            type: 'text',
            name: 'login',
            label: 'Логин',
            value: formData.login,
            onChange,
            errorMessage: 'Только латинские буквы и цифры',
            options: {
              minLength: 3,
              maxLength: 15,
              'aria-errormessage': 'errorMessage-login',
            },
          },
          {
            typeElement: 'input',
            type: 'password',
            name: 'password',
            label: 'Пароль',
            value: formData.password,
            onChange,
          },

          {
            typeElement: 'button',
            type: 'submit',
            name: 'login',
            text: 'Войти',
            className: `standart-button`,
            options: {
              disabled: disabledLoginButton,
            },
          },
          {
            typeElement: 'button',
            type: 'button',
            name: 'register',
            text: 'Зарегистрироваться',
            className: `standart-button`,
            onClick: registration,
          },
        ]}
        onSubmit={onSubmit}
        className={styles.form}
      />
    </section>
  );
};
export default LoginPage;
