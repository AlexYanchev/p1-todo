import { FC } from 'react';
import styles from './ViewTasksPage.module.css';
import SubMenu from '../../components/SubMenu/SubMenu';
import { TaskStatus } from '../../types/taskType';

type Props = {
  type: TaskStatus;
};

const ViewTasksPage: FC<Props> = ({ type }) => {
  //получаем таски
  return <section>{type !== TaskStatus.PUBLIC_TASK && <SubMenu />}</section>;
};
export default ViewTasksPage;
