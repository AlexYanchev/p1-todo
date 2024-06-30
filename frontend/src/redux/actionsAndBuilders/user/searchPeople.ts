import {
  createAsyncThunk,
  ActionReducerMapBuilder,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';
import { customFetch } from '../../../requests';
import { UserState } from '../../slices/userSlice';
import { ErrorTypeFromServer } from '../tasks/commonTypes';
import { UserProfileType } from '../../../types/userType';
import { RootState } from '../../store';

export const searchPeopleThunkAction = createAsyncThunk<
  { data: UserProfileType[] & ErrorTypeFromServer },
  {
    searchParams: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('user/searchPeople', async (data) => {
  return customFetch({
    to: `/searchPeople?${data.searchParams}`,
    method: 'GET',
    dispatch: data.dispatch,
    headers: { Authorization: data.token },
  })
    .then((res) => {
      console.log('Ответ от searchPeople: ', res);
      return res;
    })
    .catch((err) => {
      console.log('Ошибка от searchPeople: ', err);
      throw new Error(err.message);
    });
});

export const searchPeopleThunkActionBuilder = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder.addCase(searchPeopleThunkAction.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    // if (state.searchPeople.length) {
    //   state.searchPeople = [];
    // } else {}
    state.searchPeople = action.payload.data;
  });
  builder.addCase(searchPeopleThunkAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error;
  });
  builder.addCase(searchPeopleThunkAction.pending, (state, action) => {
    state.status = 'pending';
  });
};
