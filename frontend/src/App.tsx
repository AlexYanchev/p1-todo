import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import styles from './app.module.css';
import Footer from './components/Footer/Footer';
import Menu from './components/Menu/Menu';
import Popup from './components/Popup/Popup';
import ViewTasksPage from './pages/ViewTasksPage/ViewTasksPage';
import { TaskStatus } from './types/taskType';

function App() {
  const location = useLocation();
  const background = location.state && location.state.background;

  return (
    <section className={styles.container}>
      <Menu />
      <Routes location={background || location}>
        <Route
          path='tasks'
          element={<ViewTasksPage type={TaskStatus.OWN_TASK} />}
        />
        <Route
          path='publicTasks'
          element={<ViewTasksPage type={TaskStatus.PUBLIC_TASK} />}
        />
      </Routes>
      {background && (
        <Routes>
          <Route path='createTask' element={<Popup element={<></>} />} />
        </Routes>
      )}
      <Footer />
    </section>
  );
}

export default App;
