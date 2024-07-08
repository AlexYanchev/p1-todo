import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import styles from './FriendsListForShare.module.css';
import { customFetch } from '../../requests';
import PublicAvatar from '../PublicAvatar/PublicAvatar';
import { getFriendsList } from '../../redux/slices/profileDataSlice';
import { getFriendsListThunkAction } from '../../redux/actionsAndBuilders/profileData/friends/getFriendsList';

type Props = {
  idTask: string;
  cb: () => void;
};

const FriendsListForShare: FC<Props> = ({ idTask, cb }) => {
  const userSlice = useAppSelector(getUserSlice);
  const friendsList = useAppSelector(getFriendsList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userSlice.user) {
      return;
    }
    dispatch(
      getFriendsListThunkAction({ token: userSlice.user.token, dispatch })
    )
      .then((res) => {
        console.log('Запрос списка друзей успешен.', res);
      })
      .catch((err) => {
        console.log('Ошибка при запросе друзей.', err);
      });
  }, []);

  const share = (idFriend: string) => {
    if (!userSlice.user) {
      return;
    }

    customFetch({
      to: `/share/friend/${idFriend}/${idTask}`,
      method: 'PUT',
      headers: {
        Authorization: userSlice.user.token,
      },
      dispatch,
    })
      .then((res) => {
        console.log('Успешно поделились с другом. Id друга: ', idFriend);
        cb();
      })
      .catch((err) => {
        console.log('Произошла ошибка при отправке задаче другу.', err);
      });
  };

  return (
    <div className={styles.friends_list_container}>
      {friendsList.length ? (
        <ul className={styles.firends_list}>
          {friendsList.map((friend) => {
            return (
              <li
                key={friend._id}
                className={styles.friend_info_container}
                onClick={() => share(friend._id)}
              >
                <PublicAvatar srcAvatar={friend.avatar} />
                <div className={styles.name_container}>
                  <span className={styles.firstName}>
                    {friend.firstName} {friend.lastName}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Нет друзей с кем можно поделится</p>
      )}
    </div>
  );
};
export default FriendsListForShare;
