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

export const changeOfferTaskThunkAction = createAsyncThunk<
  {
    data: {
      idTask: string;
      alreadyInvolved: boolean;
    } & ErrorTypeFromServer;
  },
  {
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    idTask: string;
    action: 'delete' | 'accept';
  }
>('profileData/changeOfferTask', async (data) => {
  return customFetch({
    to: `/changeOfferTask/${data.idTask}/${data.action}`,
    method: 'PATCH',
    dispatch: data.dispatch,
    headers: {
      Authorization: data.token,
    },
  })
    .then((res) => {
      console.log('Ответ от changeOfferTask: ', res);
      return res;
    })
    .catch((err) => {
      console.log('Ошибка от changeOfferTask: ', err);
      throw new Error(err.message);
    });
});

export const changeOfferTaskThunkActionBuilder = (
  builder: ActionReducerMapBuilder<ProfileDataState>
) => {
  builder.addCase(changeOfferTaskThunkAction.fulfilled, (state, action) => {
    state.offers.status = 'fulfilled';
    state.offers.sharedToMeTasks = state.offers.sharedToMeTasks.filter(
      (task) => task._id !== action.payload.data.idTask
    );
  });
  builder.addCase(changeOfferTaskThunkAction.rejected, (state, action) => {
    state.offers.status = 'rejected';
    state.offers.error = action.error;
  });
  builder.addCase(changeOfferTaskThunkAction.pending, (state, action) => {
    state.offers.status = 'pending';
  });
};
