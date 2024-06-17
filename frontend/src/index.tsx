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
import { TasksType } from './types/taskType';
import Popup from './components/Popup/Popup';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Defender from './components/Defender/Defender';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Routes>
          <Route path='/' element={<Navigate to='/tasks' />} />
          <Route
            path='/*'
            element={
              <Defender role='logged'>
                <App />
              </Defender>
            }
          />
          <Route
            path='/login'
            element={
              <Defender role='unlogged'>
                <LoginPage />
              </Defender>
            }
          />
          <Route
            path='/registration'
            element={
              <Defender role='unlogged'>
                <RegistrationPage />
              </Defender>
            }
          />
        </Routes>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
