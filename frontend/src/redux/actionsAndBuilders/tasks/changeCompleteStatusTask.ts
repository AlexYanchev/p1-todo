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
import { ChangedTaskReturnedType, ErrorTypeFromServer } from './commonTypes';

export const changeCompleteStatusTaskActionThunk = createAsyncThunk<
  ChangedTaskReturnedType & ErrorTypeFromServer,
  {
    token: string;
    taskId: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/changeCompleteStatusTask', async (data) => {
  return customFetch({
    to: `/changeCompleteStatusTask/${data.taskId}`,
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

export const changeCompleteStatusTaskActionThunkBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(
    changeCompleteStatusTaskActionThunk.fulfilled,
    (state, action: PayloadAction<ChangedTaskReturnedType>) => {
      state.status = 'fulfilled';
      state.own = state.own.map((task) => {
        if (task._id === action.payload.task._id) {
          task.complete = action.payload.task.complete;
          return task;
        }
        return task;
      });
    }
  );
  builder.addCase(
    changeCompleteStatusTaskActionThunk.pending,
    (state, action) => {
      state.status = 'pending';
    }
  );
  builder.addCase(
    changeCompleteStatusTaskActionThunk.rejected,
    (state, action) => {
      state.status = 'rejected';
      state.error = action.error.message;
    }
  );
};
