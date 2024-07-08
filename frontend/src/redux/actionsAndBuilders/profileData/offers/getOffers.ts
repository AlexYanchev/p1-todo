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

export const getOffersThunkAction = createAsyncThunk<
  {
    data: {
      sharedToMeTasks: Array<OfferTaskType>;
      sharedToMeSteps: Array<OfferStepType>;
    } & ErrorTypeFromServer;
  },
  {
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('profileData/getOffers', async (data) => {
  return customFetch({
    to: '/getData/offers',
    method: 'GET',
    dispatch: data.dispatch,
    headers: {
      Authorization: data.token,
    },
  })
    .then((res) => {
      console.log('Ответ от /getData/offers: ', res);
      return res;
    })
    .catch((err) => {
      console.log('Ошибка от /getData/offers: ', err);
      throw new Error(err.message);
    });
});

export const getOffersThunkActionBuilder = (
  builder: ActionReducerMapBuilder<ProfileDataState>
) => {
  builder.addCase(getOffersThunkAction.fulfilled, (state, action) => {
    state.offers.status = 'fulfilled';
    state.offers.sharedToMeTasks = action.payload.data.sharedToMeTasks;
    state.offers.sharedToMeSteps = action.payload.data.sharedToMeSteps;
  });
  builder.addCase(getOffersThunkAction.rejected, (state, action) => {
    state.offers.status = 'rejected';
    state.offers.error = action.error;
  });
  builder.addCase(getOffersThunkAction.pending, (state, action) => {
    state.offers.status = 'pending';
  });
};
