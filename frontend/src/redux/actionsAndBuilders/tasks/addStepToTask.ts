import {
  createAsyncThunk,
  ThunkDispatch,
  ActionReducerMapBuilder,
  PayloadAction,
} from '@reduxjs/toolkit';
import { UnknownAction } from 'redux';
import { customFetch } from '../../../requests';
import { StepType } from '../../../types/stepTypes';
import { TasksState } from '../../slices/tasksSlice';
import { RootState } from '../../store';
import { ErrorTypeFromServer } from './commonTypes';

export type AddStepToTaskActionReturnedType = {
  success: boolean;
  message: string;
  step: StepType;
};

export const addStepToTaskAction = createAsyncThunk<
  AddStepToTaskActionReturnedType & ErrorTypeFromServer,
  {
    id: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    step: { title: string };
  }
>('tasks/addStepToTask', async (data) => {
  return customFetch({
    to: `/addStepToTask/${data.id}`,
    method: 'PATCH',
    headers: {
      Authorization: data.token,
      'Content-Type': 'application/json;charset=utf-8',
    },
    dispatch: data.dispatch,
    data: data.step,
  })
    .then((res) => res)
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const addStepToTaskBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(
    addStepToTaskAction.fulfilled,
    (state, action: PayloadAction<AddStepToTaskActionReturnedType>) => {
      state.status = 'fulfilled';
      state.steps[action.payload.step.taskId] = [
        action.payload.step,
        ...state.steps[action.payload.step.taskId],
      ];
    }
  );
  builder.addCase(addStepToTaskAction.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(addStepToTaskAction.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
