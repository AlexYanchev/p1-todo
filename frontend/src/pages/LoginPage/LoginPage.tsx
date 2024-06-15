import { useState } from 'react';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import styles from './LoginPage.module.css';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/slices/userSlice';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ login: string; password: string }>(
    {
      login: '',
      password: '',
    }
  );

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
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
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
            className: `${styles.button}`,
          },
          {
            typeElement: 'button',
            type: 'button',
            name: 'register',
            text: 'Зарегистрироваться',
            className: `${styles.button}`,
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
