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
    )
      .unwrap()
      .then((res) => {});

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
                },
                onChange,
              },

              {
                typeElement: 'button',
                type: 'submit',
                name: 'editLastName',
                text: 'Сохранить',
                className: styles.button_save,
                options: {
                  disabled: Object.values(dataForm).every(
                    (value) => !Boolean(value)
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// const ProfilePage = () => {
//   const userSlice = useAppSelector(getUserSlice);
//   const dispatch = useAppDispatch();
//   const user = userSlice.user;

// //   const [imagesSrc, setImagesSrc] = useState<{
// //     permission: boolean;
// //     avatar: string | null;
// //     avatarLink: string | null;
// //   }>({
// //     permission: false,
// //     avatar: null,
// //     avatarLink: null,
// //   });

// //   useEffect(() => {
// //     if (user) {
// //       customFetch({
// //         to: `/createLinks`,
// //         method: 'POST',
// //         headers: {
// //           Authorization: user.token,
// //           'Content-Type': 'application/json',
// //           // 'Content-Type': `image/${picType}`,
// //         },
// //         dispatch,
// //         data: { fields: { avatar: 1 } },
// //       }).then((res: any) => {
// //         dispatch(setHashPrefix(res));
// //       });
// //     }
// //   }, []);

//   //   useEffect(() => {
//   //     if (user && Boolean(user.avatar)) {
//   //       customFetch({
//   //         to: `/getFile/avatar`,
//   //         method: 'GET',
//   //         headers: {
//   //           Authorization: user.token,
//   //           // 'Content-Type': `image/${picType}`,
//   //         },
//   //         dispatch,
//   //       }).then((res: any) => {
//   //         dispatch(setAvatar(res));

//   //         setImagesSrc({ ...imagesSrc, avatar: res.avatar });
//   //       });
//   //     }
//   //   }, [userSlice]);

//   //   useEffect(() => {
//   //     if (user && imagesSrc.avatar && !imagesSrc.avatarLink) {
//   //       customFetch({
//   //         to: '/getPermissionToResources',
//   //         method: 'POST',
//   //         headers: {
//   //           Authorization: user.token,
//   //           'Content-Type': 'application/json',
//   //         },
//   //         data: { avatar: imagesSrc.avatar },
//   //         dispatch,
//   //       }).then((res: any) => {
//   //         setImagesSrc({
//   //           ...imagesSrc,
//   //           //   avatarLink: `http://localhost:3001/store/test.png`,
//   //           avatarLink: `http://localhost:3001/store/avatar/${user._id}/${res.avatar}`,
//   //           permission: true,
//   //         });
//   //       });
//   //     }
//   //   }, [imagesSrc.avatar]);

//   //   return (
//   //     <section className={styles.profile_container}>
//   //       {imagesSrc.permission && imagesSrc.avatarLink ? (
//   //         <Image
//   //           alt='Аватар'
//   //           width='300px'
//   //           height='300px'
//   //           type='avatar'
//   //           src={imagesSrc.avatarLink}
//   //           // src={`http://localhost:3001/testStatic/${user?.token}`}
//   //         />
//   //       ) : (
//   //         <Image alt='Аватар' width='300px' height='300px' type='avatar' />
//   //       )}
//   //     </section>
//   //   );

// //   return (
// //     <section className={styles.profile_container}>
// //       {user && Boolean(user.prefix) && Boolean(user.avatar) ? (
// //         <Image
// //           alt='Аватар'
// //           width='300px'
// //           height='300px'
// //           type='avatar'
// //           //   src={`http://localhost:3001/store/${user.prefix}/test.png`}
// //           src={`http://localhost:3001/store/${user.prefix}/${user.avatar}`}
// //           // src={`http://localhost:3001/testStatic/${user?.token}`}
// //         />
// //       ) : (
// //         <Image alt='Аватар' width='300px' height='300px' type='avatar' />
// //       )}
// //     </section>
// //   );
// };
export default ProfilePage;
