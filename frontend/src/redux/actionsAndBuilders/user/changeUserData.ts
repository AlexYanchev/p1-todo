import {
  createAsyncThunk,
  ThunkDispatch,
  ActionReducerMapBuilder,
  PayloadAction,
} from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { customFetch } from '../../../requests';
import { TasksState } from '../../slices/tasksSlice';
import { RootState } from '../../store';
import { TasksType } from '../../../types/taskType';
import {
  ChangedTaskReturnedType,
  ErrorTypeFromServer,
} from '../tasks/commonTypes';
import { UserProfileType, UserType } from '../../../types/userType';
import { UserState } from '../../slices/userSlice';

export type FieldsForChanges = 'avatar' | 'firstName' | 'lastName' | 'login';

export type FieldsForChangesAsObject = { [field in FieldsForChanges]?: string };

export type ChangedUserDataReturnedType = {
  fields: FieldsForChangesAsObject;
  justCheck: boolean;
  canChange: boolean;
} & {
  success: boolean;
  message: string;
};

export const changeUserDataActionThunk = createAsyncThunk<
  ChangedUserDataReturnedType & ErrorTypeFromServer,
  {
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    fields: FieldsForChangesAsObject;
    justCheck?: boolean;
  }
>('user/changeUserData', async (data) => {
  return customFetch({
    to: data.justCheck ? `/changeUserData/justCheck` : `/changeUserData`,
    method: 'PATCH',
    headers: {
      Authorization: data.token,
      'Content-Type': 'application/json;charset=utf-8',
    },
    dispatch: data.dispatch,
    data: { fields: data.fields },
  })
    .then((res) => {
      if (data.justCheck) {
        res.justCheck = data.justCheck;
        return res;
      } else {
        return res;
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const changeUserDataActionThunkBuilder = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder.addCase(
    changeUserDataActionThunk.fulfilled,
    (state, action: PayloadAction<ChangedUserDataReturnedType>) => {
      state.status = 'fulfilled';

      if (action.payload.justCheck) {
        return;
      }

      if (state.user) {
        state.user = { ...state.user, ...action.payload.fields };
        localStorage.setItem('user', JSON.stringify(state.user));
      }
    }
  );
  builder.addCase(changeUserDataActionThunk.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(changeUserDataActionThunk.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
