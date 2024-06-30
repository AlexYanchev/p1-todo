import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import styles from './app.module.css';
import Footer from './components/Footer/Footer';
import Menu from './components/Menu/Menu';
import Popup from './components/Popup/Popup';
import ViewTasksPage from './pages/ViewTasksPage/ViewTasksPage';
import { TasksType } from './types/taskType';
import CreateTaskPage from './pages/CreateTaskPage/CreateTaskPage';
import { useEffect } from 'react';
import AddStepPage from './pages/AddStepPage/AddStepPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import SetAvatarPage from './pages/SetAvatarPage/SetAvatarPage';

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  const protectedRoutesFromDirectCall = ['/createTask', '/addStep'];

  // const routesForNotLoggedUsers = ['/login', '/registration'];
  // const lastUrl = localStorage.getItem('lastUrl');

  // const loggedUserNavigateRoute =
  //   lastUrl in routesForNotLoggedUsers ? '/' : lastUrl;
  // if (lastUrl) {
  //   console.log(true);
  //   return <Navigate to={lastUrl} />;
  // }

  if (
    !background &&
    protectedRoutesFromDirectCall.includes(location.pathname)
  ) {
    return <Navigate to='/tasks' />;
  }

  return (
    <section className={styles.container}>
      <Menu />
      <Routes location={background || location}>
        <Route path='tasks' element={<ViewTasksPage type='own' />} />
        <Route path='sharedTasks' element={<ViewTasksPage type='shared' />} />
        <Route path='publicTasks' element={<ViewTasksPage type='public' />} />
        <Route path='profile' element={<ProfilePage />} />
      </Routes>
      {background && (
        <Routes>
          <Route
            path='setAvatar'
            element={<Popup element={<SetAvatarPage />} />}
          />
          <Route
            path='createTask'
            element={<Popup element={<CreateTaskPage />} />}
          />
          <Route
            path='addStep/:taskId'
            element={<Popup element={<AddStepPage />} />}
          />
        </Routes>
      )}
      <Footer />
    </section>
  );
}

export default App;
