import LinkItem from '../LinkItem/LinkItem';
import styles from './SubMenu.module.css';

const SubMenu = () => {
  return (
    <nav>
      <LinkItem to='/sharedTasks' text='Совместные задачи' />
    </nav>
  );
};
export default SubMenu;
