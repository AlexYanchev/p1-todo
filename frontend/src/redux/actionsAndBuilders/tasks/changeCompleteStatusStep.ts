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

export type ChangeCompleteStepActionReturnedType = {
  success: boolean;
  message: string;
  step: StepType;
};

export const changeCompleteStatusStepActionThunk = createAsyncThunk<
  { data: ChangeCompleteStepActionReturnedType & ErrorTypeFromServer },
  {
    stepId: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/changeCompleteStatusStep', async (data) => {
  return customFetch({
    to: `/changeCompleteStatusStep/${data.stepId}`,
    method: 'PATCH',
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

export const changeCompleteStatusStepActionThunkBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(
    changeCompleteStatusStepActionThunk.fulfilled,
    (state, action) => {
      state.status = 'fulfilled';
      state.steps[action.payload.data.step.taskId] = state.steps[
        action.payload.data.step.taskId
      ].map((step) =>
        step._id === action.payload.data.step._id
          ? { ...step, complete: action.payload.data.step.complete }
          : step
      );
    }
  );
  builder.addCase(
    changeCompleteStatusStepActionThunk.pending,
    (state, action) => {
      state.status = 'pending';
    }
  );
  builder.addCase(
    changeCompleteStatusStepActionThunk.rejected,
    (state, action) => {
      state.status = 'rejected';
      state.error = action.error.message;
    }
  );
};
