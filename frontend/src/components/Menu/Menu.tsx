import styles from './Menu.module.css';
import LinkItem from '../LinkItem/LinkItem';
import Button from '../Button/Button';

const Menu = () => {
  return (
    <header className={styles.header}>
      <nav>
        <ul className={styles.link_list}>
          <li>
            <Button
              typeElement='button'
              type='button'
              name='createNewTask'
              text='Создать задачу'
              className={styles.createTaskButton}
            />
          </li>
          <li>
            <LinkItem to='tasks' text='Мои задачи' />
          </li>
          <li>
            <LinkItem to='publicTasks' text='Публичные задачи' />
          </li>
        </ul>
      </nav>
    </header>
  );
};
export default Menu;
