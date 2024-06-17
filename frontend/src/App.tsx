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

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;
  const protectedRoutesFromDirectCall = ['/createTask', '/addStep'];

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
      </Routes>
      {background && (
        <Routes>
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
