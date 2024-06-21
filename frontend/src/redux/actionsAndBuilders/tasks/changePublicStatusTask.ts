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

export const changePublicStatusTaskActionThunk = createAsyncThunk<
  ChangedTaskReturnedType & ErrorTypeFromServer,
  {
    token: string;
    taskId: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/changePublicStatusTask', async (data) => {
  return customFetch({
    to: `/changePublicStatusTask/${data.taskId}`,
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

export const changePublicStatusTaskActionThunkBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(
    changePublicStatusTaskActionThunk.fulfilled,
    (state, action: PayloadAction<ChangedTaskReturnedType>) => {
      state.status = 'fulfilled';
      state.own = state.own.map((task) =>
        task._id === action.payload.task._id
          ? { ...action.payload.task, public: action.payload.task.public }
          : task
      );
    }
  );
  builder.addCase(
    changePublicStatusTaskActionThunk.pending,
    (state, action) => {
      state.status = 'pending';
    }
  );
  builder.addCase(
    changePublicStatusTaskActionThunk.rejected,
    (state, action) => {
      state.status = 'rejected';
      state.error = action.error.message;
    }
  );
};