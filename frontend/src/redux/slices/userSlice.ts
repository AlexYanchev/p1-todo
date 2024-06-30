import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store.js';
import {
  UserProfileWithTokenType,
  loginUserBuilderCases,
} from '../actionsAndBuilders/user/loginUser';
import { registerUserBuilderCases } from '../actionsAndBuilders/user/registerUser';
import { changeUserDataActionThunkBuilder } from '../actionsAndBuilders/user/changeUserData';

export type SetPrefixReturnedType = {
  success: boolean;
  message: string;
  prefix: string;
  fields: { [field: string]: string | string[] };
};

export interface UserState {
  user: UserProfileWithTokenType | null;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: any;
}

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
    logout: (state) => {
      state.user = null;
      localStorage.clear();
    },
  },
  extraReducers(builder) {
    loginUserBuilderCases(builder);
    registerUserBuilderCases(builder);
    changeUserDataActionThunkBuilder(builder);
  },
});

export const { addUser, logout } = userSlice.actions;

export const getUserSlice = (state: RootState) => state.user;

export default userSlice.reducer;
