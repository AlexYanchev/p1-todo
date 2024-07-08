import { FC, useEffect, useRef } from 'react';
import { UserProfileType } from '../../types/userType';
import styles from './FoundPeopleList.module.css';
import Button from '../Button/Button';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice } from '../../redux/slices/userSlice';
import { changeFriendsListThunkAction } from '../../redux/actionsAndBuilders/profileData/friends/changeFriendsList';
import PublicAvatar from '../PublicAvatar/PublicAvatar';

type Props = {
  peopleList: Array<UserProfileType>;
  closeCallback: React.Dispatch<React.SetStateAction<boolean>>;
};

const FoundPeopleList: FC<Props> = ({ closeCallback, peopleList }) => {
  const listRef = useRef<HTMLUListElement>(null);
  const userSlice = useAppSelector(getUserSlice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.onclick = function (e) {
      //Проверяем, что все элементы есть
      if (e && e.target && listRef.current) {
        // Внешний элемент, который нам дает событие windows.onclick является HTML элементом
        const externalElem = e.target as HTMLElement;
        // Сравниваем, что бы наш ref соответствовал родителю элемента windows.
        // Именно родителю, так как windows дает только непосредственный элемент, где был клик
        // Поскольку у нас есть кнопка ее родитель не подходит нам, то сравниваем по атрибуту name кнопки
        if (
          listRef.current !== externalElem.parentElement &&
          externalElem.getAttribute('name') !== 'addToFriend'
        ) {
          closeCallback(false);
        }
      }
    };
    return () => {
      window.onclick = null;
    };
  }, []);

  const addToFriend = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    idFriend: string
  ) => {
    e.preventDefault();
    console.log(
      'Нажали кнопку Добавить в друзья. Текущий юзер: ',
      userSlice.user?.login
    );
    if (!userSlice.user) {
      return;
    }
    console.log('Нажали кнопку Добавить в друзья. Отправляем диспатч');
    dispatch(
      changeFriendsListThunkAction({
        token: userSlice.user.token,
        dispatch,
        idFriend,
      })
    )
      .unwrap()
      .then((res) => {
        console.log('Успешный ответ от addToFriend: ', res);
      })
      .catch((err) => {
        console.log('Ошибка от addToFriend: ', err);
      });
  };
  return (
    <ul className={styles.container} ref={listRef}>
      {peopleList.map((user) => {
        const isFriend = userSlice.user?.friends.includes(user._id);
        return (
          <li key={user._id} className={styles.user}>
            <PublicAvatar srcAvatar={user.avatar} />
            <span className={styles.firstName}>{user.firstName}</span>
            <span className={styles.lastName}>{user.lastName}</span>
            <span className={styles.login}>{user.login}</span>
            {!isFriend && (
              <Button
                typeElement='button'
                type='button'
                name='addToFriend'
                text='Добавить'
                onClick={(e) => {
                  addToFriend(e, user._id);
                }}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};
export default FoundPeopleList;
