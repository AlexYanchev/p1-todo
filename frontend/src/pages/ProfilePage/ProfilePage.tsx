import styles from './ProfilePage.module.css';
import Avatar from '../../components/Avatar/Avatar';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserToken } from '../../redux/slices/userSlice';
import { Suspense, useEffect, useState } from 'react';
import ArchiveTasksViewer from '../../components/ArchiveTasksViewer/ArchiveTasksViewer';
import PublicAvatar from '../../components/PublicAvatar/PublicAvatar';
import { changeFriendsListThunkAction } from '../../redux/actionsAndBuilders/profileData/friends/changeFriendsList';
import Button from '../../components/Button/Button';
import ProfileInfo from '../../components/ProfileInfo/ProfileInfo';
import Notifications from '../../components/Notifications/Notifications';
import OfferTasks from '../../components/OfferTasks/OfferTasks';
import OfferSteps from '../../components/OfferSteps/OfferSteps';
import { getOffersThunkAction } from '../../redux/actionsAndBuilders/profileData/offers/getOffers';
import { getOffers } from '../../redux/slices/profileDataSlice';
import Spinner from '../../components/Spinner/Spinner';
import { getFriendsListThunkAction } from '../../redux/actionsAndBuilders/profileData/friends/getFriendsList';
import { getFriendsList } from '../../redux/slices/profileDataSlice';

const ProfilePage = () => {
  const userToken = useAppSelector(getUserToken);
  const dispatch = useAppDispatch();
  const friendsList = useAppSelector(getFriendsList);
  const { sharedToMeTasks, sharedToMeSteps } = useAppSelector(getOffers);
  const [openOffer, setOpenOffer] = useState({
    sharedToMeTasks: false,
    sharedToMeSteps: false,
  });

  useEffect(() => {
    if (!userToken) {
      return;
    }
    dispatch(
      getFriendsListThunkAction({
        token: userToken,
        dispatch,
      })
    )
      .then((res) => [
        console.log('Запрос на список друзей успешный. Результат: ', res),
      ])
      .catch((err) => {
        console.log(
          'Запрос на список друзей выполнился с ошибкой. Ошибка: ',
          err
        );
      });

    dispatch(getOffersThunkAction({ token: userToken, dispatch }))
      .then((res) => [
        console.log(
          'Запрос на количество предложений успешен. Результат: ',
          res
        ),
      ])
      .catch((err) => {
        console.log(
          'Запрос на количество предложений выполнился с ошибкой. Ошибка: ',
          err
        );
      });
  }, []);

  const deleteFriend = (idFriend: string) => {
    if (!userToken) {
      return;
    }
    dispatch(
      changeFriendsListThunkAction({
        token: userToken,
        dispatch,
        idFriend,
      })
    )
      .then((res) => {
        console.log(
          'Успешный запрос на удаление друга. Ответ от сервера: ',
          res
        );
      })
      .catch((err) => [
        console.log('Ошибка при запросе на удаление друга. Ошибка: ', err),
      ]);
  };

  return (
    <section>
      <h1>Профиль</h1>
      <div className={styles.profile_container}>
        <section className={styles.edit_profile_section}>
          <h2>Редактирование профиля</h2>
          <div className={styles.profile_info_container}>
            <div>
              <Avatar alt='Аватар' width='200px' height='200px' type='avatar' />
              <ArchiveTasksViewer />
            </div>
            <ProfileInfo />
          </div>
        </section>
        <section>
          <Notifications quantity={friendsList.length}>
            <h2 className={styles.friends_header}>Друзья</h2>
          </Notifications>

          <div className={styles.friends_container}>
            {friendsList.length ? (
              <ol className={styles.friends_list}>
                {friendsList.map((friend) => {
                  return (
                    <li key={friend._id} className={styles.friend_item}>
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
        </section>
        <section>
          <h2>Предложения</h2>
          <div className={styles.offers_container}>
            <div>
              <Notifications quantity={sharedToMeTasks.length}>
                <h3>Задачи</h3>
              </Notifications>
              <Button
                type='button'
                typeElement='button'
                name='sharedToMeTasks'
                text={openOffer.sharedToMeTasks ? 'Закрыть' : 'Открыть'}
                className={styles.tasks_button}
                onClick={() =>
                  setOpenOffer({
                    ...openOffer,
                    sharedToMeTasks: !openOffer.sharedToMeTasks,
                  })
                }
              />
              {openOffer.sharedToMeTasks && (
                <Suspense fallback={<Spinner />}>
                  <OfferTasks list={sharedToMeTasks} />
                </Suspense>
              )}
            </div>
            <div>
              <Notifications quantity={sharedToMeSteps.length}>
                <h3>Шаги</h3>
              </Notifications>
              <Button
                type='button'
                typeElement='button'
                name='sharedToMeSteps'
                text={openOffer.sharedToMeSteps ? 'Закрыть' : 'Открыть'}
                className={styles.tasks_button}
                onClick={() =>
                  setOpenOffer({
                    ...openOffer,
                    sharedToMeSteps: !openOffer.sharedToMeSteps,
                  })
                }
              />
              {openOffer.sharedToMeSteps && (
                <Suspense fallback={<Spinner />}>
                  <OfferSteps list={sharedToMeSteps} />
                </Suspense>
              )}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
};

export default ProfilePage;
