import { ReactNode, FC, ReactElement, ReactChildren } from 'react';
import styles from './Defender.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Navigate } from 'react-router-dom';
import ErrorPage from '../../pages/ErrorPage/ErrorPage';
import { getUserSlice } from '../../redux/slices/userSlice';

type RoleTags = 'logged' | 'unlogged';

type Props = {
  children: ReactNode;
  role: RoleTags;
  // includeTags: RoleTags[];
  // excludeTags: RoleTags[];
};

const Defender: FC<Props> = ({ role, children }) => {
  const { user } = useAppSelector(getUserSlice) || localStorage.getItem('user');

  switch (role) {
    case 'logged': {
      return user ? <>{children}</> : <Navigate to='/login' />;
    }
    case 'unlogged': {
      return user ? <Navigate to='/tasks' /> : <>{children}</>;
    }
    default: {
      return <ErrorPage />;
    }
  }
};
export default Defender;
