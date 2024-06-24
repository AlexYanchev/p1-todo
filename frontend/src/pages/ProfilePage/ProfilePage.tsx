import styles from './ProfilePage.module.css';
import Image from '../../components/Image/Image';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { useEffect, useState } from 'react';
import { customFetch } from '../../requests';
import UniversalForm from '../../components/UniversalForm/UniversalForm';
import EditPencilIcon from '../../components/icons/EditPencilIcon/EditPencilIcon';

const ProfilePage = () => {
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const user = userSlice.user;

  return (
    <section className={styles.profile_container}>
      <div className={styles.content}>
        <Image alt='Аватар' width='300px' height='300px' type='avatar' />
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
              },
              {
                typeElement: 'button',
                type: 'button',
                name: 'editFirstName',
                text: <EditPencilIcon size={'20'} />,
                className: styles.form_button_edit,
              },
              {
                typeElement: 'input',
                type: 'text',
                name: 'lastName',
                label: 'Фамилия',
                placeholder: user?.lastName,
              },

              {
                typeElement: 'button',
                type: 'button',
                name: 'editLastName',
                text: <EditPencilIcon size={'20'} />,
                className: styles.form_button_edit,
              },
            ]}
            onSubmit={() => {}}
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
