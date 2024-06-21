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

export type PutLikeReturnedType = ChangedTaskReturnedType & {
  typeTask: TasksType;
  data: { clientId: string; action: boolean };
};

export const putLikeToTaskActionThunk = createAsyncThunk<
  PutLikeReturnedType & ErrorTypeFromServer,
  {
    taskId: string;
    token: string;
    dispatch: ThunkDispatch<RootState, undefined, UnknownAction>;
    typeTask: TasksType;
  }
>('tasks/putLikeToTask', async (data) => {
  return customFetch({
    to: `/putLikeToTask/${data.taskId}`,
    method: 'PATCH',
    headers: {
      Authorization: data.token,
    },
    dispatch: data.dispatch,
  })
    .then((res) => {
      res.typeTask = data.typeTask;
      return res;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
});

export const putLikeToTaskActionThunkBuilder = (
  builder: ActionReducerMapBuilder<TasksState>
) => {
  builder.addCase(
    putLikeToTaskActionThunk.fulfilled,
    (state, action: PayloadAction<PutLikeReturnedType>) => {
      state.status = 'fulfilled';
      state[action.payload.typeTask].map((task) => {
        if (task._id === action.payload.task._id) {
          if (action.payload.data.action) {
            task.likes.push(action.payload.data.clientId);
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
  builder.addCase(putLikeToTaskActionThunk.pending, (state, action) => {
    state.status = 'pending';
  });
  builder.addCase(putLikeToTaskActionThunk.rejected, (state, action) => {
    state.status = 'rejected';
    state.error = action.error.message;
  });
};
