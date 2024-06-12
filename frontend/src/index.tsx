import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  Navigate,
  redirect,
  RouterProvider,
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import RegistrationPage from './pages/RegistrationPage/RegistrationPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ViewTasksPage from './pages/ViewTasksPage/ViewTasksPage';
import { TaskStatus } from './types/taskType';
import Popup from './components/Popup/Popup';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'publicTasks',
        element: <ViewTasksPage type={TaskStatus.PUBLIC_TASK} />,
      },
      {
        path: 'tasks',
        element: <ViewTasksPage type={TaskStatus.OWN_TASK} />,
        children: [
          {
            path: 'sharedTasks',
            element: <ViewTasksPage type={TaskStatus.SHARED_TASK} />,
          },
        ],
      },
      {
        path: 'createTask',
        element: <Popup element={<></>} />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/registration',
    element: <RegistrationPage />,
  },
]);

ReactDOM.render(
  <React.StrictMode>
    {/* <RouterProvider router={router} /> */}
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/tasks' />} />
        <Route path='/*' element={<App />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/registration' element={<RegistrationPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
