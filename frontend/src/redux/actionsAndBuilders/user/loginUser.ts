import { createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { customFetch } from '../../../requests';
import { UserState } from '../../slices/userSlice';
import { ErrorTypeFromServer } from '../tasks/commonTypes';
import { UserProfileType } from '../../../types/userType';

export type UserProfileWithTokenType = UserProfileType & { token: string } & {
  prefix: string;
  fields: { [field: string]: string | string[] };
};

export const loginUser = createAsyncThunk<
  { data: UserProfileWithTokenType & ErrorTypeFromServer },
  { login: string; password: string }
>('user/loginUser', async (formData) => {
  return customFetch({
    to: '/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    data: { fields: formData },
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const loginUserBuilderCases = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder.addCase(loginUser.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    state.user = action.payload.data;
    localStorage.setItem('user', JSON.stringify(action.payload.data));
  });
  builder.addCase(loginUser.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error;
  });
  builder.addCase(loginUser.pending, (state, action) => {
    state.status = 'pending';
  });
};
