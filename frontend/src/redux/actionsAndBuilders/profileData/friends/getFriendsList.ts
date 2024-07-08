import {
  createAsyncThunk,
  ActionReducerMapBuilder,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';
import { customFetch } from '../../../../requests';
import { ErrorTypeFromServer } from '../../tasks/commonTypes';
import { RootState } from '../../../store';
import { ProfileDataState } from '../../../slices/profileDataSlice';
import { OfferTaskType } from '../../../../types/taskType';
import { OfferStepType } from '../../../../types/stepTypes';
import { FriendSimpleProfileType } from '../../../../types/userType';

export const getFriendsListThunkAction = createAsyncThunk<
  {
    data: {
      friendsList: Array<FriendSimpleProfileType>;
    } & ErrorTypeFromServer;
  },
  {
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('profileData/getFriendsList', async (data) => {
  return customFetch({
    to: '/getData/friendsList',
    method: 'GET',
    dispatch: data.dispatch,
    headers: {
      Authorization: data.token,
    },
  })
    .then((res) => {
      console.log('Ответ от /getData/friendsList: ', res);
      return res;
    })
    .catch((err) => {
      console.log('Ошибка от /getData/friendsList: ', err);
      throw new Error(err.message);
    });
});

export const getFriendsListThunkActionBuilder = (
  builder: ActionReducerMapBuilder<ProfileDataState>
) => {
  builder.addCase(getFriendsListThunkAction.fulfilled, (state, action) => {
    state.friendsList.status = 'fulfilled';
    state.friendsList.data = action.payload.data.friendsList;
  });
  builder.addCase(getFriendsListThunkAction.rejected, (state, action) => {
    state.friendsList.status = 'rejected';
    state.friendsList.error = action.error;
  });
  builder.addCase(getFriendsListThunkAction.pending, (state, action) => {
    state.friendsList.status = 'pending';
  });
};
