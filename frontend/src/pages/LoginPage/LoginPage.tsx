import UniversalForm from '../../components/UniversalForm/UniversalForm';
import styles from './LoginPage.module.css';

const LoginPage = () => {
  return (
    <section className={styles.container}>
      <UniversalForm
        elements={[
          {
            typeElement: 'input',
            type: 'text',
            name: 'login',
            label: 'Логин',
            value: '',
          },
          {
            typeElement: 'input',
            type: 'password',
            name: 'password',
            label: 'Пароль',
            value: '',
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
        onSubmit={() => true}
        className={styles.form}
      />
    </section>
  );
};
export default LoginPage;
