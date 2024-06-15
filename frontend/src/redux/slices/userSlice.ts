import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { RootState } from '../store.js';
import { UserProfileType } from '../../types/userType.js';

type UserProfileWithTokenType = UserProfileType & { token: string };

export interface UserState {
  user: UserProfileWithTokenType | null;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: any;
}

export const loginUser = createAsyncThunk<
  UserProfileWithTokenType,
  { login: string; password: string }
>('user/loginUser', async (formData) => {
  return fetch('http://localhost:3001/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .catch((err) => console.log(err));
});

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<UserProfileWithTokenType>) => {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.user = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = action.payload;
    });
    builder.addCase(loginUser.pending, (state, action) => {
      state.status = 'pending';
    });
  },
});

export const { addUser } = userSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const getUser = (state: RootState) => state.user;

export default userSlice.reducer;
