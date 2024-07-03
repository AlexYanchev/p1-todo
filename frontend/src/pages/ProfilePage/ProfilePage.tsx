import styles from './ProfilePage.module.css';
import Avatar from '../../components/Avatar/Avatar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { useEffect, useState } from 'react';
import ArchiveTasksViewer from '../../components/ArchiveTasksViewer/ArchiveTasksViewer';
import { UserPublicProfileType } from '../../types/userType';
import { customFetch } from '../../requests';
import PublicAvatar from '../../components/PublicAvatar/PublicAvatar';
import { changeFriendsListThunkAction } from '../../redux/actionsAndBuilders/user/addToFriend';
import Button from '../../components/Button/Button';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';

const ProfilePage = () => {
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();

  const [friendsList, setFriendsList] = useState<UserPublicProfileType[]>([]);

  useEffect(() => {
    if (userSlice.user && !friendsList.length) {
      customFetch({
        to: `/getData/friendsList`,
        method: 'GET',
        dispatch,
        headers: {
          Authorization: userSlice.user?.token,
        },
      })
        .then((res) => [
          console.log('Запрос на список друзей успешный. Результат: ', res),
          setFriendsList(res.data.result.friends),
        ])
        .catch((err) => {
          console.log(
            'Запрос на список друзей выполнился с ошибкой. Ошибка: ',
            err
          );
        });
    }
  }, []);

  const deleteFriend = (idFriend: string) => {
    if (!userSlice.user) {
      return;
    }
    dispatch(
      changeFriendsListThunkAction({
        token: userSlice.user.token,
        dispatch,
        idFriend,
      })
    )
      .then((res) => {
        console.log(
          'Успешный запрос на удаление друга. Ответ от сервера: ',
          res
        );
        setFriendsList(friendsList.filter((friend) => friend._id !== idFriend));
      })
      .catch((err) => [
        console.log('Ошибка при запросе на удаление друга. Ошибка: ', err),
      ]);
  };

  return (
    <section className={styles.profile_container}>
      <div className={styles.content}>
        <div>
          <Avatar alt='Аватар' width='300px' height='300px' type='avatar' />
          <ArchiveTasksViewer />
        </div>
        <ProfileInfo />
      </div>
      <div className={styles.friends_container}>
        <h2 className={styles.friends_header}>Друзья</h2>
        {friendsList.length ? (
          <ol className={styles.friends_list}>
            {friendsList.map((friend) => {
              return (
                <li key={friend._id}>
                  <PublicAvatar srcAvatar={friend.avatar} />
                  <span>
                    {friend.firstName} {friend.lastName}
                  </span>
                  <Button
                    typeElement='button'
                    type='button'
                    name='deleteFriend'
                    onClick={() => deleteFriend(friend._id)}
                    text='Удалить'
                  />
                </li>
              );
            })}
          </ol>
        ) : (
          <p>Друзей нет</p>
        )}
      </div>
      <div className={styles.incoming_action}>
        <h2>Действия</h2>
        <h3>Входящие задачи</h3>
        <h3>Предложенные шаги</h3>
      </div>
    </section>
  );
};

export default ProfilePage;
