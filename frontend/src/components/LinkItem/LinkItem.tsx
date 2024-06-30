import styles from './LinkItem.module.css';
import { NavLink } from 'react-router-dom';
import { FC, ReactElement, ReactNode } from 'react';

type Props = {
  text: string | ReactNode | ReactElement;
  to: string;
  options?: {
    end: boolean;
  };
};

const LinkItem: FC<Props> = ({ text, to, options }) => {
  return (
    <NavLink
      {...options}
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
