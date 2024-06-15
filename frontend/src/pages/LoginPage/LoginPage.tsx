import { useState } from 'react';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import styles from './LoginPage.module.css';
import { useAppDispatch } from '../../redux/hooks';
import { loginUser } from '../../redux/slices/userSlice';

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState<{ login: string; password: string }>(
    {
      login: '',
      password: '',
    }
  );

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.currentTarget.name]: e.currentTarget.value });
  };
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser(formData))
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
            type: 'button',
            name: 'cancel',
            text: 'Отмена',
            className: `${styles.button}`,
          },
          {
            typeElement: 'button',
            type: 'submit',
            name: 'register',
            text: 'Зарегистрироваться',
            className: `${styles.button}`,
          },
        ]}
        onSubmit={onSubmit}
        className={styles.form}
      />
    </section>
  );
};
export default LoginPage;
