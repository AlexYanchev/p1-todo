import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store.js';
import {
  UserProfileWithTokenType,
  loginUserBuilderCases,
} from '../actionsAndBuilders/user/loginUser';
import { registerUserBuilderCases } from '../actionsAndBuilders/user/registerUser';
import { changeUserDataActionThunkBuilder } from '../actionsAndBuilders/user/changeUserData';
import { searchPeopleThunkActionBuilder } from '../actionsAndBuilders/user/searchPeople';
import { UserProfileType } from '../../types/userType.js';
import { changeFriendsListThunkActionBuilder } from '../actionsAndBuilders/profileData/friends/changeFriendsList.js';

export type SetPrefixReturnedType = {
  success: boolean;
  message: string;
  prefix: string;
  fields: { [field: string]: string | string[] };
};

export interface UserState {
  searchPeople: Array<UserProfileType>;
  user: UserProfileWithTokenType | null;
  status: 'idle' | 'pending' | 'fulfilled' | 'rejected';
  error: any;
}

const initialState: UserState = {
  searchPeople: [],
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
    searchPeopleThunkActionBuilder(builder);
    loginUserBuilderCases(builder);
    registerUserBuilderCases(builder);
    changeUserDataActionThunkBuilder(builder);
  },
});

export const { addUser, logout } = userSlice.actions;

export const getUserSlice = (state: RootState) => state.user;

export const getUserToken = (state: RootState) => state.user.user?.token;

export const getFoundPeople = (state: RootState) => state.user.searchPeople;

export default userSlice.reducer;
