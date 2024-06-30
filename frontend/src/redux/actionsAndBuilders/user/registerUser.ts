import { createAsyncThunk, ActionReducerMapBuilder } from '@reduxjs/toolkit';
import { customFetch } from '../../../requests';
import { UserRegisterType } from '../../../types/userType';
import { UserState } from '../../slices/userSlice';
import { ErrorTypeFromServer } from '../tasks/commonTypes';

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
    .then((res: any) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const registerUserBuilderCases = (
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
