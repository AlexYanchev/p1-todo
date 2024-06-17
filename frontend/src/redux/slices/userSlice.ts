import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import type { ActionReducerMapBuilder } from '@reduxjs/toolkit';
import type { RootState } from '../store.js';
import { UserProfileType, UserRegisterType } from '../../types/userType.js';
import { customFetch } from '../../requests';
import { ErrorTypeFromServer } from '../../types/errorTypes.js';

type UserProfileWithTokenType = UserProfileType & { token: string };

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

export const registerUser = createAsyncThunk<
  ErrorTypeFromServer,
  UserRegisterType
>('user/registerUser', async (registerDataForm) => {
  return customFetch({
    to: '/registration',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    data: registerDataForm,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const loginUser = createAsyncThunk<
  UserProfileWithTokenType & ErrorTypeFromServer,
  { login: string; password: string }
>('user/loginUser', async (formData) => {
  return customFetch({
    to: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    data: formData,
  }).then((res) => {
    if (res.error) {
      throw new Error(res.message);
    } else {
      return res;
    }
  });
});

const loginUserBuilderCases = (builder: ActionReducerMapBuilder<UserState>) => {
  builder.addCase(loginUser.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    state.user = action.payload;
  });
  builder.addCase(loginUser.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error;
  });
  builder.addCase(loginUser.pending, (state, action) => {
    state.status = 'pending';
  });
};

const registerUserBuilderCases = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder.addCase(registerUser.fulfilled, (state, action) => {
    state.status = 'fulfilled';
  });
  builder.addCase(registerUser.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error;
  });
  builder.addCase(registerUser.pending, (state, action) => {
    state.status = 'pending';
  });
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
    },
  },
  extraReducers(builder) {
    loginUserBuilderCases(builder);
    registerUserBuilderCases(builder);
  },
});

export const { addUser, logout } = userSlice.actions;

export const getUserSlice = (state: RootState) => state.user;

export default userSlice.reducer;
