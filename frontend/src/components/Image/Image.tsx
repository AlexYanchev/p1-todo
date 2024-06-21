import { FC, useState } from 'react';
import styles from './Image.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import DefaultAvatarIcon from '../icons/DefaultAvatarIcon/DefaultAvatarIcon';
import EditPencilIcon from '../icons/EditPencilIcon/EditPencilIcon';
import { customFetch } from '../../requests';
import { FETCH_SITE_URL } from '../../options';
import Button from '../Button/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import Spinner from '../Spinner/Spinner';

type Props = {
  src?: string;
  alt: string;
  width: string;
  height: string;
  className?: string;
  type?: 'avatar';
};

const Image: FC<Props> = ({ src, alt, width, height, className, type }) => {
  const userSlice = useAppSelector(getUserSlice);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const defaultAvatar = type === 'avatar' && !Boolean(userSlice.user?.avatar);

  const setAvatar = () => {
    navigate('/setAvatar', { state: { background: location } });
  };

  return (
    <div className={styles.container}>
      {defaultAvatar ? (
        <DefaultAvatarIcon width={width} height={height} />
      ) : (
        <img
          src={userSlice.user?.avatar}
          alt={alt}
          style={{
            width,
            height,
          }}
          className={`${styles.img} ${className || ''}`}
        />
      )}
      <Button
        typeElement='button'
        type='button'
        name='changeAvatar'
        text={<EditPencilIcon size='40' />}
        onClick={setAvatar}
        className={styles.edit}
      />
    </div>
  );
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// const Image: FC<Props> = ({ src, alt, width, height, className, type }) => {
//   const userSlice = useAppSelector(getUserSlice);
//   const dispatch = useAppDispatch();
//   const avatar = src ? src : userSlice.user?.avatar;
//   const defaultAvatar = type === 'avatar' && !Boolean(avatar);

//   const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.item(0);
//     e.target.value = '';

//     if (file && userSlice.user) {
//       const fileType = file.type;
//       const arrayBufferFile = await file.arrayBuffer();
//       customFetch({
//         to: `/uploadFile`,
//         file: true,
//         method: 'POST',
//         headers: {
//           'Content-Type': fileType,
//           Authorization: userSlice.user.token,
//         },
//         data: arrayBufferFile,
//       }).then((res:any) => {
//         console.log(res);
//         // dispatch(setAvatar(res));
//       });
//     }

//     // e.target.value = '';
//   };

//   return (
//     <div className={styles.container}>
//       {defaultAvatar ? (
//         <DefaultAvatarIcon width={width} height={height} />
//       ) : (
//         <img
//           src={avatar}
//           alt={alt}
//           style={{
//             width,
//             height,
//           }}
//           className={`${styles.img} ${className || ''}`}
//         />
//       )}
//       <label className={styles.edit} htmlFor='uploadImg'>
//         <input
//           type='file'
//           className={styles.input}
//           id='uploadImg'
//           accept='image/png, image/jpeg'
//           name='uploadImg'
//           hidden
//           onChange={uploadFile}
//         />
//         <EditPencilIcon size='40' />
//       </label>
//     </div>
//   );
// };
export default Image;
