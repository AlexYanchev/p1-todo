import {
  createAsyncThunk,
  ActionReducerMapBuilder,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';
import { customFetch } from '../../../../requests';
import { UserState } from '../../../slices/userSlice';
import { ErrorTypeFromServer } from '../../tasks/commonTypes';
import {
  FriendSimpleProfileType,
  UserProfileType,
} from '../../../../types/userType';
import { RootState } from '../../../store';
import { ProfileDataState } from '../../../slices/profileDataSlice';

export const changeFriendsListThunkAction = createAsyncThunk<
  {
    data: { friendsList: Array<FriendSimpleProfileType> } & ErrorTypeFromServer;
  },
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
  builder: ActionReducerMapBuilder<ProfileDataState>
) => {
  builder.addCase(changeFriendsListThunkAction.fulfilled, (state, action) => {
    state.friendsList.status = 'fulfilled';
    state.friendsList.data = action.payload.data.friendsList;
  });
  builder.addCase(changeFriendsListThunkAction.rejected, (state, action) => {
    state.friendsList.status = 'rejected';
    state.friendsList.error = action.error;
  });
  builder.addCase(changeFriendsListThunkAction.pending, (state, action) => {
    state.friendsList.status = 'pending';
  });
};
