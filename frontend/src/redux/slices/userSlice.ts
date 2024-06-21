import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { RootState } from '../store.js';
import { UserProfileType, UserRegisterType } from '../../types/userType.js';
import { customFetch } from '../../requests';
import { ErrorTypeFromServer } from '../actionsAndBuilders/tasks/commonTypes.js';
import { changeUserAvatarActionThunkBuilder } from '../actionsAndBuilders/user/changeUserAvatar';
import {
  UserProfileWithTokenType,
  loginUserBuilderCases,
} from '../actionsAndBuilders/user/loginUser';
import { registerUserBuilderCases } from '../actionsAndBuilders/user/registerUser';

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
    // setHashPrefix: (state, action: PayloadAction<SetPrefixReturnedType>) => {
    //   const user = state.user;
    //   if (user) {
    //     user.prefix = action.payload.prefix;

    //   }
    // },
  },
  extraReducers(builder) {
    loginUserBuilderCases(builder);
    registerUserBuilderCases(builder);
    changeUserAvatarActionThunkBuilder(builder);
  },
});

export const { addUser, logout } = userSlice.actions;

export const getUserSlice = (state: RootState) => state.user;

export default userSlice.reducer;
