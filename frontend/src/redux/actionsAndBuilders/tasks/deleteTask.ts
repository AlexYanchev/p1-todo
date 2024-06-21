import {
  createAsyncThunk,
  ThunkDispatch,
  ActionReducerMapBuilder,
} from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { customFetch } from '../../../requests';
import { TasksState } from '../../slices/tasksSlice';
import { RootState } from '../../store';
import { ErrorTypeFromServer } from './commonTypes';

export const deleteTaskAction = createAsyncThunk<
  { success: boolean; message: string; _id: string } & ErrorTypeFromServer,
  {
    id: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/deleteTask', async (data) => {
  return customFetch({
    to: `/deleteTask/${data.id}`,
    method: 'DELETE',
    headers: {
      Authorization: data.token,
    },
    dispatch: data.dispatch,
  })
    .then((res) => res)
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const deleteTaskActionBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(deleteTaskAction.fulfilled, (state, action) => {
    state.status = 'fulfilled';
    state.waitingToDelete = action.payload._id;
    // state.own = state.own.filter((task) => task._id !== action.payload._id);
  });
  builder.addCase(deleteTaskAction.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(deleteTaskAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
