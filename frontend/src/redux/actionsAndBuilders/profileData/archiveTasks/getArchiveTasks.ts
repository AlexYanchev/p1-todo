import {
  createAsyncThunk,
  ActionReducerMapBuilder,
  ThunkDispatch,
  UnknownAction,
} from '@reduxjs/toolkit';
import { customFetch } from '../../../../requests';
import { UserState } from '../../../slices/userSlice';
import { ErrorTypeFromServer } from '../../tasks/commonTypes';
import { UserProfileType } from '../../../../types/userType';
import { RootState } from '../../../store';
import { ArchiveTasksFields } from '../../../../types/taskType';
import { ProfileDataState } from '../../../slices/profileDataSlice';

export const getArchiveTasksThunkAction = createAsyncThunk<
  { data: Array<ArchiveTasksFields> & ErrorTypeFromServer },
  {
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('profileData/getArchiveTasks', async (data) => {
  return customFetch({
    to: '/getArchiveTasks',
    method: 'GET',
    dispatch: data.dispatch,
    headers: {
      Authorization: data.token,
    },
  })
    .then((res) => {
      console.log('Ответ от getArchiveTasks: ', res);
      return res;
    })
    .catch((err) => {
      console.log('Ошибка от getArchiveTasks: ', err);
      throw new Error(err.message);
    });
});

export const getArchiveTasksThunkActionBuilder = (
  builder: ActionReducerMapBuilder<ProfileDataState>
) => {
  builder.addCase(getArchiveTasksThunkAction.fulfilled, (state, action) => {
    state.archiveTasks.status = 'fulfilled';
    state.archiveTasks.expiredTasks = action.payload.data.filter(
      (task) => task.expired
    );
    state.archiveTasks.completedTasks = action.payload.data.filter(
      (task) => task.complete
    );
    state.archiveTasks.deletedTasks = action.payload.data.filter(
      (task) => task.willBeDeleted
    );
  });
  builder.addCase(getArchiveTasksThunkAction.rejected, (state, action) => {
    state.archiveTasks.status = 'rejected';
    state.archiveTasks.error = action.error;
  });
  builder.addCase(getArchiveTasksThunkAction.pending, (state, action) => {
    state.archiveTasks.status = 'pending';
  });
};
