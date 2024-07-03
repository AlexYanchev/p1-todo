import { FC, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import styles from './FriendsListForShare.module.css';
import { UserPublicProfileType } from '../../types/userType';
import { customFetch } from '../../requests';
import PublicAvatar from '../PublicAvatar/PublicAvatar';

type Props = {
  idTask: string;
  cb: () => void;
};

const FriendsListForShare: FC<Props> = ({ idTask, cb }) => {
  const userSlice = useAppSelector(getUserSlice);
  const [friendsList, setFriendsList] = useState<Array<UserPublicProfileType>>(
    []
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!userSlice.user) {
      return;
    }
    customFetch({
      to: '/getData/friendsList',
      method: 'GET',
      headers: {
        Authorization: userSlice.user.token,
      },
      dispatch,
    })
      .then((res) => {
        console.log('Запрос списка друзей успешен.', res);
        setFriendsList(res.data.result.friends);
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
    <>
      {friendsList.length ? (
        <ul className={styles.friends_list_container}>
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
    </>
  );
};
export default FriendsListForShare;
