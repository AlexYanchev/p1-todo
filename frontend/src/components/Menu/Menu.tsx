import styles from './Menu.module.css';
import LinkItem from '../LinkItem/LinkItem';
import Button from '../Button/Button';
import Popup from '../Popup/Popup';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { getUserSlice, logout } from '../../redux/slices/userSlice';

const Menu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const userSlice = useAppSelector(getUserSlice);

  const createTask = () => {
    navigate('/createTask', { state: { background: location } });
  };

  const logoutProfile = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    dispatch(logout());
    localStorage.removeItem('user');
  };
  return (
    <header className={styles.header}>
      <nav className={styles.link_container}>
        <ul className={styles.link_list}>
          <li>
            <Button
              typeElement='button'
              type='button'
              name='createNewTask'
              text='Создать задачу'
              className={styles.createTaskButton}
              onClick={createTask}
            />
          </li>
          <li>
            <LinkItem to='tasks' text='Мои задачи' />
          </li>
          <li>
            <LinkItem to='publicTasks' text='Публичные задачи' />
          </li>
        </ul>
        <ul className={styles.link_list}>
          <li>
            <LinkItem to='profile' text='Мой профиль' />
          </li>
          <li>
            <Button
              typeElement='button'
              type='button'
              name='logout'
              text='Выход'
              onClick={logoutProfile}
              className={styles.logout_button}
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Menu;
