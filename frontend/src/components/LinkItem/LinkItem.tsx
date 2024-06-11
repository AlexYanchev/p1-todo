import styles from './LinkItem.module.css';
import { NavLink } from 'react-router-dom';
import { FC } from 'react';

type Props = {
  text: string;
  to: string;
};

const LinkItem: FC<Props> = ({ text, to }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive ? `${styles.link} ${styles.active}` : styles.link
      }
    >
      {text}
    </NavLink>
  );
};
export default LinkItem;
