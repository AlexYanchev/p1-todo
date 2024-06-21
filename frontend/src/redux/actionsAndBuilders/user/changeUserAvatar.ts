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

export type ChangeUserAvatarReturnedType = { user: UserProfileType } & {
  success: boolean;
  message: string;
};

export const changeUserAvatarActionThunk = createAsyncThunk<
  ChangeUserAvatarReturnedType & ErrorTypeFromServer,
  {
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    fields: { avatar?: string; firstName?: string; lastName?: string };
  }
>('user/changeUserData', async (data) => {
  return customFetch({
    to: `/changeUserData`,
    method: 'PATCH',
    headers: {
      Authorization: data.token,
      'Content-Type': 'application/json',
    },
    dispatch: data.dispatch,
    data: data.fields,
  })
    .then((res) => res)
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const changeUserAvatarActionThunkBuilder = (
  builder: ActionReducerMapBuilder<UserState>
) => {
  builder.addCase(
    changeUserAvatarActionThunk.fulfilled,
    (state, action: PayloadAction<ChangeUserAvatarReturnedType>) => {
      state.status = 'fulfilled';

      if (state.user) {
        state.user.avatar = action.payload.user.avatar;
      }
    }
  );
  builder.addCase(changeUserAvatarActionThunk.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(changeUserAvatarActionThunk.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
