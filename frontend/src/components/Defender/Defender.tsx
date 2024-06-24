import { ReactNode, FC, ReactElement, ReactChildren, useEffect } from 'react';
import styles from './Defender.module.css';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Navigate } from 'react-router-dom';
import ErrorPage from '../../pages/ErrorPage/ErrorPage';
import { addUser, getUserSlice } from '../../redux/slices/userSlice';

type RoleTags = 'logged' | 'unlogged';

type Props = {
  children: ReactNode;
  role: RoleTags;
  // includeTags: RoleTags[];
  // excludeTags: RoleTags[];
};

const Defender: FC<Props> = ({ role, children }) => {
  const dispatch = useAppDispatch();
  const userFromLocalStorage = localStorage.getItem('user');
  const { user } = useAppSelector(getUserSlice);
  useEffect(() => {
    if (!user && userFromLocalStorage) {
      dispatch(addUser(JSON.parse(userFromLocalStorage)));
    }
  }, []);

  // window.onbeforeunload = function () {
  //   localStorage.setItem('lastUrl', window.location.pathname);
  // };
  // const lastUrl = localStorage.getItem('lastUrl') || '/tasks';

  switch (role) {
    case 'logged': {
      return user ? <>{children}</> : <Navigate to='/login' />;
    }
    case 'unlogged': {
      // return user ? <Navigate to={lastUrl} /> : <>{children}</>;
      return user ? <Navigate to='/' /> : <>{children}</>;
    }
    default: {
      return <ErrorPage />;
    }
  }
};
export default Defender;
