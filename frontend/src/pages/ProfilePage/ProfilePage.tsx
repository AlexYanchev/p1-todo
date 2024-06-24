import styles from './ProfilePage.module.css';
import Image from '../../components/Image/Image';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { useCallback, useState } from 'react';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import { changeUserDataActionThunk } from '../../redux/actionsAndBuilders/user/changeUserData';

type DataFormType = {
  firstName: string;
  lastName: string;
};

const ProfilePage = () => {
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const [dataForm, setDataForm] = useState<DataFormType>({
    firstName: '',
    lastName: '',
  });
  const user = userSlice.user;
  const pending = useAppSelector((state) => state.user.status === 'pending');

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
                typeElement: 'button',
                type: 'submit',
                name: 'editLastName',
                text: 'Сохранить',
                className: `standart-button`,
                options: {
                  disabled: Object.values(dataForm).every(
                    (value) => !Boolean(value) || pending
                  ),
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
