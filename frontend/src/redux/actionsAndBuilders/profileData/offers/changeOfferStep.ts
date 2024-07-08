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

export const changeOfferStepThunkAction = createAsyncThunk<
  {
    data: {
      idStep: string;
    } & ErrorTypeFromServer;
  },
  {
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    idStep: string;
    action: 'delete' | 'accept';
  }
>('profileData/changeOfferStep', async (data) => {
  return customFetch({
    to: `/changeOfferStep/${data.idStep}/${data.action}`,
    method: 'PATCH',
    dispatch: data.dispatch,
    headers: {
      Authorization: data.token,
    },
  })
    .then((res) => {
      console.log('Ответ от changeOfferStep: ', res);
      return res;
    })
    .catch((err) => {
      console.log('Ошибка от changeOfferStep: ', err);
      throw new Error(err.message);
    });
});

export const changeOfferStepThunkActionBuilder = (
  builder: ActionReducerMapBuilder<ProfileDataState>
) => {
  builder.addCase(changeOfferStepThunkAction.fulfilled, (state, action) => {
    state.offers.status = 'fulfilled';
    state.offers.sharedToMeSteps = state.offers.sharedToMeSteps.filter(
      (step) => step._id !== action.payload.data.idStep
    );
  });
  builder.addCase(changeOfferStepThunkAction.rejected, (state, action) => {
    state.offers.status = 'rejected';
    state.offers.error = action.error;
  });
  builder.addCase(changeOfferStepThunkAction.pending, (state, action) => {
    state.offers.status = 'pending';
  });
};
