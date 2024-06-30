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

export const changeFriendsListThunkAction = createAsyncThunk<
  { data: { idFriend: string } & ErrorTypeFromServer },
  {
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    idFriend: string;
  }
>('user/changeFriendsList', async (data) => {
  return customFetch({
    to: `/changeFriendsList/${data.idFriend}`,
    method: 'PATCH',
    dispatch: data.dispatch,
    headers: { Authorization: data.token },
  })
    .then((res) => {
      console.log('Ответ от changeFriendsList: ', res);
      return res;
    })
    .catch((err) => {
      console.log('Ошибка от changeFriendsList: ', err);
      throw new Error(err.message);
    });
});

export const changeFriendsListThunkActionBuilder = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder.addCase(changeFriendsListThunkAction.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    console.log(action.payload);
    if (!state.user) {
      return;
    }
    if (!state.user.friends) {
      state.user.friends = [];
    }
    state.user.friends.push(action.payload.data.idFriend);
  });
  builder.addCase(changeFriendsListThunkAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error;
  });
  builder.addCase(changeFriendsListThunkAction.pending, (state, action) => {
    state.status = 'pending';
  });
};
