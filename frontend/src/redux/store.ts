import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import tasksReducer from './slices/tasksSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    tasks: tasksReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
