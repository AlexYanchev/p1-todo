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
import { TasksType } from '../../../types/taskType';

export type JoinToTaskReturnedType = ChangedTaskReturnedType & {
  data: { clientId: string; action: boolean };
};

export const joinToTaskActionThunk = createAsyncThunk<
  JoinToTaskReturnedType & ErrorTypeFromServer,
  {
    taskId: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
  }
>('tasks/joinToTask', async (data) => {
  return customFetch({
    to: `/joinToTask/${data.taskId}`,
    method: 'PATCH',
    headers: {
      Authorization: data.token,
    },
    dispatch: data.dispatch,
  })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const joinToTaskActionThunkBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(
    joinToTaskActionThunk.fulfilled,
    (state, action: PayloadAction<JoinToTaskReturnedType>) => {
      state.status = 'fulfilled';
      state.shared.map((task) => {
        if (task._id === action.payload.task._id) {
          if (action.payload.data.action) {
            task.members.push(action.payload.data.clientId);
          } else {
            task.likes = task.likes.filter(
              (userId) => userId !== action.payload.data.clientId
            );
          }
          return task;
        }
        return task;
      });
    }
  );
  builder.addCase(joinToTaskActionThunk.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(joinToTaskActionThunk.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
