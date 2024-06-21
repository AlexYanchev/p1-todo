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
import { ErrorTypeFromServer } from './commonTypes';

export type DeleteStepActionReturnedType = {
  success: boolean;
  message: string;
  taskId: string;
  stepId: string;
};

export const deleteStepActionThunk = createAsyncThunk<
  DeleteStepActionReturnedType & ErrorTypeFromServer,
  {
    stepId: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/deleteStep', async (data) => {
  return customFetch({
    to: `/deleteStep/${data.stepId}`,
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

export const deleteStepActionThunkBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(
    deleteStepActionThunk.fulfilled,
    (state, action: PayloadAction<DeleteStepActionReturnedType>) => {
      state.status = 'fulfilled';
      state.steps[action.payload.taskId] = state.steps[
        action.payload.taskId
      ].filter((step) => step._id !== action.payload.stepId);
    }
  );
  builder.addCase(deleteStepActionThunk.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(deleteStepActionThunk.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
