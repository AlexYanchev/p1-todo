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
import Notifications from '../../components/Notifications/Notifications';
import OfferTasks from '../../components/OfferTasks/OfferTasks';
import OfferSteps from '../../components/OfferSteps/OfferSteps';

const ProfilePage = () => {
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();
  const [quantityOffers, setQuantityOffers] = useState({
    tasks: 0,
    steps: 0,
  });
  const [friendsList, setFriendsList] = useState<UserPublicProfileType[]>([]);
  const [openOffer, setOpenOffer] = useState({
    tasks: false,
    steps: false,
  });

  useEffect(() => {
    if (!userSlice.user) {
      return;
    }
    if (!friendsList.length) {
      customFetch({
        to: `/getData/friendsList`,
        method: 'GET',
        dispatch,
        headers: {
          Authorization: userSlice.user.token,
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

    customFetch({
      to: `/getData/offers`,
      method: 'GET',
      dispatch,
      headers: {
        Authorization: userSlice.user.token,
      },
    })
      .then((res) => [
        console.log(
          'Запрос на количество предложений успешен. Результат: ',
          res
        ),
        setQuantityOffers({
          tasks: Number(res.data.sharedToMeTasks),
          steps: Number(res.data.sharedToMeSteps),
        }),
      ])
      .catch((err) => {
        console.log(
          'Запрос на количество предложений выполнился с ошибкой. Ошибка: ',
          err
        );
      });
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
        <h2>Предложения</h2>
        <div>
          <Notifications quantity={quantityOffers.tasks}>
            <h3>Задачи</h3>
          </Notifications>
          <Button
            type='button'
            typeElement='button'
            name='sharedToMeTasks'
            text={openOffer.tasks ? 'Закрыть' : 'Открыть'}
            className={styles.tasks_button}
            onClick={() =>
              setOpenOffer({ ...openOffer, tasks: !openOffer.tasks })
            }
          />
          {openOffer.tasks && <OfferTasks />}
        </div>
        <div>
          <Notifications quantity={quantityOffers.steps}>
            <h3>Шаги</h3>
          </Notifications>
          <Button
            type='button'
            typeElement='button'
            name='sharedToMeSteps'
            text={openOffer.steps ? 'Закрыть' : 'Открыть'}
            className={styles.tasks_button}
            onClick={() =>
              setOpenOffer({ ...openOffer, steps: !openOffer.steps })
            }
          />
          {openOffer.steps && <OfferSteps />}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
