import { FC } from 'react';
import styles from './ViewTasksPage.module.css';
import SubMenu from '../../components/SubMenu/SubMenu';

type Props = {
  publicTasks?: boolean;
};

const ViewTasksPage: FC<Props> = ({ publicTasks }) => {
  return <section>{!publicTasks && <SubMenu />}</section>;
};
export default ViewTasksPage;
